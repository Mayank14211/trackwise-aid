import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  status?: "success" | "warning" | "danger" | "neutral";
}

export function KPICard({ title, value, unit, change, icon: Icon, status = "neutral" }: KPICardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "text-success";
      case "warning": return "text-warning";
      case "danger": return "text-danger";
      default: return "text-primary";
    }
  };

  const getChangeColor = () => {
    if (change === undefined) return "";
    return change >= 0 ? "text-success" : "text-danger";
  };

  return (
    <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${getStatusColor()}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          {unit && (
            <div className="text-sm text-muted-foreground">
              {unit}
            </div>
          )}
        </div>
        {change !== undefined && (
          <p className={`text-xs ${getChangeColor()} mt-1`}>
            {change >= 0 ? "+" : ""}{change}% from last hour
          </p>
        )}
      </CardContent>
    </Card>
  );
}