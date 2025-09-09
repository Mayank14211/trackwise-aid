import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Clock } from "lucide-react";

interface ConflictAlert {
  id: string;
  type: "block_occupation" | "signal_conflict" | "platform_conflict";
  trains: string[];
  location: string;
  severity: "critical" | "warning";
  timeToConflict: number;
  description: string;
}

const mockConflicts: ConflictAlert[] = [
  {
    id: "1",
    type: "block_occupation",
    trains: ["IC 2047", "RE 4521"],
    location: "Block B-8",
    severity: "critical",
    timeToConflict: 2,
    description: "Two trains approaching same block simultaneously"
  },
  {
    id: "2",
    type: "platform_conflict", 
    trains: ["FR 9834"],
    location: "Platform 3",
    severity: "warning",
    timeToConflict: 8,
    description: "Platform occupied longer than scheduled"
  }
];

export function ConflictAlerts() {
  const getSeverityColor = (severity: string) => {
    return severity === "critical" ? "danger" : "warning";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "platform_conflict": return MapPin;
      default: return AlertTriangle;
    }
  };

  if (mockConflicts.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-success" />
            Conflict Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-success text-sm">All clear - no conflicts detected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-danger" />
          Conflict Alerts
          <span className="ml-2 px-2 py-1 bg-danger text-danger-foreground rounded-full text-xs">
            {mockConflicts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockConflicts.map((conflict) => {
            const TypeIcon = getTypeIcon(conflict.type);
            const severityColor = getSeverityColor(conflict.severity);
            
            return (
              <Alert 
                key={conflict.id}
                className={`border-${severityColor}/50 bg-${severityColor}/10`}
              >
                <TypeIcon className={`h-4 w-4 text-${severityColor}`} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-${severityColor} capitalize`}>
                        {conflict.severity} Conflict
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {conflict.timeToConflict}min
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {conflict.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Location: {conflict.location}</span>
                      <span>Trains: {conflict.trains.join(", ")}</span>
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