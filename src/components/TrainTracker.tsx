import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Train, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TrainData {
  id: string;
  name: string;
  type: string;
  priority: string;
  current_section: string | null;
  scheduled_time: string | null;
  actual_time: string | null;
  delay: number;
}

export function TrainTracker() {
  const { data: trains, isLoading, error } = useQuery({
    queryKey: ['trains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trains')
        .select('*')
        .order('scheduled_time', { ascending: true });
      
      if (error) throw error;
      return data as TrainData[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getTrainStatus = (train: TrainData) => {
    if (train.delay > 10) return "delayed";
    if (train.delay > 0) return "warning";
    return "on-time";
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time": return "default";
      case "delayed": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delayed": return AlertTriangle;
      default: return Train;
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Active Trains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading trains...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !trains?.length) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Active Trains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active trains found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Train className="h-5 w-5 text-primary" />
          Active Trains
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {trains.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trains.map((train) => {
            const status = getTrainStatus(train);
            const StatusIcon = getStatusIcon(status);
            
            return (
              <div
                key={train.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 transition-colors hover:bg-secondary/50 gap-3 sm:gap-0"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <StatusIcon className={`h-5 w-5 flex-shrink-0 ${
                    status === 'delayed' ? 'text-destructive' : 
                    status === 'warning' ? 'text-warning' : 'text-success'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate">{train.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="capitalize">{train.type}</span> • Priority: <span className="capitalize">{train.priority}</span>
                    </div>
                    {train.current_section && (
                      <div className="text-xs text-muted-foreground">
                        Section: {train.current_section}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Scheduled:</span> {formatTime(train.scheduled_time)}
                    </div>
                    {train.actual_time && (
                      <div className="text-xs text-muted-foreground">
                        Actual: {formatTime(train.actual_time)}
                      </div>
                    )}
                    {train.delay > 0 && (
                      <div className="text-xs text-destructive font-medium">
                        +{train.delay}min delay
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={getStatusColor(status)}
                    className="capitalize whitespace-nowrap"
                  >
                    {status === 'on-time' ? 'On Time' : status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}