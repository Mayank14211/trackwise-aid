import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, TrendingUp, CheckCircle, XCircle, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  train_id: string | null;
  action: string;
  reason: string;
  expected_delay_reduction: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function RecommendationsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Recommendation[];
    },
    refetchInterval: 30000,
  });

  const updateRecommendationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('recommendations')
        .update({ 
          status: status as any, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast({
        title: "Recommendation Updated",
        description: `Recommendation ${status} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update recommendation",
        variant: "destructive",
      });
    },
  });
  const getRecommendationPriority = (delayReduction: number) => {
    if (delayReduction >= 5) return { level: "high", variant: "destructive" as const };
    if (delayReduction >= 2) return { level: "medium", variant: "secondary" as const };
    return { level: "low", variant: "outline" as const };
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !recommendations?.length) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No pending recommendations</p>
            <p className="text-sm text-muted-foreground mt-1">AI is monitoring your system</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {recommendations.length} pending
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const priority = getRecommendationPriority(rec.expected_delay_reduction);
            
            return (
              <div
                key={rec.id}
                className="p-4 rounded-lg border border-border/50 bg-secondary/30 space-y-3 transition-colors hover:bg-secondary/40"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground break-words">{rec.action}</h4>
                        <Badge variant={priority.variant} className="text-xs whitespace-nowrap">
                          {priority.level} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 break-words">
                        {rec.reason}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(rec.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-success" />
                      <span className="text-success">-{rec.expected_delay_reduction}min delay</span>
                    </div>
                    {rec.train_id && (
                      <div className="text-xs text-muted-foreground">
                        Train ID: {rec.train_id.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
                  <Button 
                    size="sm" 
                    onClick={() => updateRecommendationMutation.mutate({ id: rec.id, status: 'accepted' })}
                    disabled={updateRecommendationMutation.isPending}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => updateRecommendationMutation.mutate({ id: rec.id, status: 'rejected' })}
                    disabled={updateRecommendationMutation.isPending}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={updateRecommendationMutation.isPending}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modify
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}