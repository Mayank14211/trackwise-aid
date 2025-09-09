import { KPICard } from "@/components/KPICard";
import { TrainTracker } from "@/components/TrainTracker";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { ConflictAlerts } from "@/components/ConflictAlerts";
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Gauge,
  Train,
  Settings,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Train className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Railway Control System</h1>
              <p className="text-sm text-muted-foreground">Section Alpha - Central Control</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Controller 1
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Section Throughput"
            value={42}
            unit="trains/hour"
            change={5.2}
            icon={TrendingUp}
            status="success"
          />
          <KPICard
            title="Average Delay"
            value={3.2}
            unit="minutes"
            change={-1.8}
            icon={Clock}
            status="success"
          />
          <KPICard
            title="Punctuality"
            value={94.5}
            unit="%"
            change={2.1}
            icon={Activity}
            status="success"
          />
          <KPICard
            title="Track Utilization"
            value={78}
            unit="%"
            change={-0.5}
            icon={Gauge}
            status="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Train Tracking & Conflicts */}
          <div className="lg:col-span-2 space-y-6">
            <TrainTracker />
            <ConflictAlerts />
          </div>

          {/* Right Column - Recommendations */}
          <div className="lg:col-span-1">
            <RecommendationsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
