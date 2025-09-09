import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, TrendingUp, CheckCircle, XCircle, Edit } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  delayReduction: number;
  throughputGain: number;
  affectedTrains: string[];
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Hold IC 2047 at Signal S-45",
    description: "Hold for 2 minutes to allow RE 4521 to clear Block B-8 and prevent conflict",
    priority: "high",
    delayReduction: 5,
    throughputGain: 8,
    affectedTrains: ["IC 2047", "RE 4521"]
  },
  {
    id: "2", 
    title: "Reroute FR 9834 via Track 3",
    description: "Alternative routing to avoid congestion in main corridor",
    priority: "medium",
    delayReduction: 3,
    throughputGain: 12,
    affectedTrains: ["FR 9834"]
  },
  {
    id: "3",
    title: "Adjust platform assignment",
    description: "Move IC 2047 to Platform 2 to optimize station throughput",
    priority: "low",
    delayReduction: 1,
    throughputGain: 5,
    affectedTrains: ["IC 2047"]
  }
];

export function RecommendationsPanel() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "neutral";
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg border border-border/50 bg-secondary/30 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <Badge 
                      variant={getPriorityColor(rec.priority) as any}
                      className="text-xs"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-success" />
                      <span className="text-success">-{rec.delayReduction}min delay</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="text-primary">+{rec.throughputGain}% throughput</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Affects: {rec.affectedTrains.join(", ")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button size="sm" variant="outline" className="border-danger text-danger hover:bg-danger/10">
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3 mr-1" />
                  Modify
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}