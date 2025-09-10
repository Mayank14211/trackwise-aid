import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ConflictAlert {
  id: string;
  type: string;
  trains: string[];
  location: string;
  severity: "critical" | "warning";
  timeToConflict: number;
  description: string;
}

// Simulate conflict detection based on train data
const detectConflicts = (trains: any[]): ConflictAlert[] => {
  const conflicts: ConflictAlert[] = [];
  
  // Check for trains in same section with delays
  const delayedTrains = trains.filter(t => t.delay > 5);
  delayedTrains.forEach((train, index) => {
    if (index === 0 && delayedTrains.length > 1) {
      conflicts.push({
        id: `conflict-${train.id}`,
        type: "delay_cascade",
        trains: delayedTrains.slice(0, 2).map(t => t.name),
        location: train.current_section || "Unknown Section",
        severity: train.delay > 10 ? "critical" : "warning",
        timeToConflict: Math.max(0, 15 - train.delay),
        description: `Multiple delayed trains may cause cascade delays in ${train.current_section || 'section'}`
      });
    }
  });

  // Check for trains with same scheduled time in different sections
  const scheduledTrains = trains.filter(t => t.scheduled_time);
  for (let i = 0; i < scheduledTrains.length - 1; i++) {
    const train1 = scheduledTrains[i];
    const train2 = scheduledTrains[i + 1];
    
    const time1 = new Date(train1.scheduled_time).getTime();
    const time2 = new Date(train2.scheduled_time).getTime();
    
    if (Math.abs(time1 - time2) < 300000 && train1.current_section !== train2.current_section) { // 5 minutes
      conflicts.push({
        id: `timing-${train1.id}-${train2.id}`,
        type: "timing_conflict",
        trains: [train1.name, train2.name],
        location: "Junction Point",
        severity: "warning",
        timeToConflict: Math.floor(Math.abs(time1 - Date.now()) / 60000),
        description: `Trains scheduled within 5 minutes may conflict at junction points`
      });
    }
  }

  return conflicts;
};

export function ConflictAlerts() {
  const { data: trains, isLoading } = useQuery({
    queryKey: ['trains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trains')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const conflicts = trains ? detectConflicts(trains) : [];
  const getSeverityColor = (severity: string) => {
    return severity === "critical" ? "destructive" : "default";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "timing_conflict": return Clock;
      case "delay_cascade": return AlertTriangle;
      default: return MapPin;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Conflict Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Analyzing conflicts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conflicts.length === 0) {
    return (
      <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Conflict Alerts
            <span className="ml-auto text-sm font-normal text-success">All Clear</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3 opacity-50" />
            <p className="text-success text-sm font-medium">No conflicts detected</p>
            <p className="text-muted-foreground text-xs mt-1">System is operating normally</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Conflict Alerts
          <span className="ml-2 px-2 py-1 bg-destructive text-destructive-foreground rounded-full text-xs">
            {conflicts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conflicts.map((conflict) => {
            const TypeIcon = getTypeIcon(conflict.type);
            const severityVariant = getSeverityColor(conflict.severity);
            
            return (
              <Alert 
                key={conflict.id}
                variant={severityVariant}
                className="transition-all duration-200 hover:border-opacity-75"
              >
                <TypeIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className={`font-medium capitalize text-sm ${
                        conflict.severity === 'critical' ? 'text-destructive' : 'text-warning'
                      }`}>
                        {conflict.severity} Alert
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {conflict.timeToConflict > 0 ? `${conflict.timeToConflict}min to conflict` : 'Active now'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground break-words">
                      {conflict.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span className="break-words">📍 {conflict.location}</span>
                      <span className="break-words">🚂 {conflict.trains.join(", ")}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}