import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Train, AlertTriangle } from "lucide-react";

interface TrainData {
  id: string;
  number: string;
  status: "on-time" | "delayed" | "conflict";
  currentBlock: string;
  nextSignal: string;
  delay: number;
  eta: string;
}

const mockTrains: TrainData[] = [
  {
    id: "1",
    number: "IC 2047",
    status: "on-time",
    currentBlock: "A-12",
    nextSignal: "S-45",
    delay: 0,
    eta: "14:23"
  },
  {
    id: "2", 
    number: "RE 4521",
    status: "delayed",
    currentBlock: "B-8",
    nextSignal: "S-32",
    delay: 5,
    eta: "14:28"
  },
  {
    id: "3",
    number: "FR 9834",
    status: "conflict",
    currentBlock: "C-15",
    nextSignal: "S-67",
    delay: 0,
    eta: "14:25"
  }
];

export function TrainTracker() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time": return "success";
      case "delayed": return "warning";
      case "conflict": return "danger";
      default: return "neutral";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "conflict": return AlertTriangle;
      default: return Train;
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Train className="h-5 w-5 text-primary" />
          Active Trains
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTrains.map((train) => {
            const StatusIcon = getStatusIcon(train.status);
            
            return (
              <div
                key={train.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30"
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-5 w-5 text-${getStatusColor(train.status)}`} />
                  <div>
                    <div className="font-medium text-foreground">{train.number}</div>
                    <div className="text-sm text-muted-foreground">
                      Block: {train.currentBlock} → Signal: {train.nextSignal}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      ETA: {train.eta}
                    </div>
                    {train.delay > 0 && (
                      <div className="text-xs text-warning">
                        +{train.delay}min delay
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={getStatusColor(train.status) as any}
                    className="capitalize"
                  >
                    {train.status}
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