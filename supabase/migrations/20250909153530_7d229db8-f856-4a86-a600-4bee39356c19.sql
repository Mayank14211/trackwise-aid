-- Create enum types for better data integrity
CREATE TYPE public.train_type AS ENUM ('passenger', 'freight', 'express', 'regional');
CREATE TYPE public.train_priority AS ENUM ('low', 'normal', 'high', 'emergency');
CREATE TYPE public.recommendation_status AS ENUM ('pending', 'accepted', 'rejected', 'modified');
CREATE TYPE public.action_outcome AS ENUM ('success', 'failure', 'partial');

-- Create trains table
CREATE TABLE public.trains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type train_type NOT NULL DEFAULT 'passenger',
  priority train_priority NOT NULL DEFAULT 'normal',
  current_section TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  actual_time TIMESTAMP WITH TIME ZONE,
  delay INTEGER DEFAULT 0, -- delay in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id UUID REFERENCES public.trains(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  expected_delay_reduction INTEGER DEFAULT 0, -- in minutes
  status recommendation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Will be linked to auth.users when authentication is implemented
  action TEXT NOT NULL,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  outcome action_outcome NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scenarios table
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  config_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations for development)
-- These can be restricted later when authentication is implemented
CREATE POLICY "Allow all operations on trains" ON public.trains FOR ALL USING (true);
CREATE POLICY "Allow all operations on recommendations" ON public.recommendations FOR ALL USING (true);
CREATE POLICY "Allow all operations on audit_logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on scenarios" ON public.scenarios FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_trains_current_section ON public.trains(current_section);
CREATE INDEX idx_trains_scheduled_time ON public.trains(scheduled_time);
CREATE INDEX idx_recommendations_train_id ON public.recommendations(train_id);
CREATE INDEX idx_recommendations_status ON public.recommendations(status);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_trains_updated_at
  BEFORE UPDATE ON public.trains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for development
INSERT INTO public.trains (name, type, priority, current_section, scheduled_time, actual_time, delay) VALUES
  ('Express 101', 'express', 'high', 'Section A', now() + interval '1 hour', now() + interval '65 minutes', 5),
  ('Freight 502', 'freight', 'low', 'Section B', now() + interval '2 hours', null, 0),
  ('Regional 203', 'regional', 'normal', 'Section C', now() + interval '30 minutes', now() + interval '35 minutes', 5);

INSERT INTO public.scenarios (name, description, config_json) VALUES
  ('Normal Operations', 'Standard operational scenario', '{"weather": "clear", "traffic": "normal"}'),
  ('Heavy Delay', 'Scenario with significant delays', '{"weather": "adverse", "traffic": "heavy", "delays": true}'),
  ('Freight Priority', 'Prioritize freight trains', '{"freight_priority": true, "passenger_delay_tolerance": 10}');