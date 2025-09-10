import { KPICard } from "@/components/KPICard";
import { TrainTracker } from "@/components/TrainTracker";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { ConflictAlerts } from "@/components/ConflictAlerts";
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Target,
  Train,
  Settings,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 pb-4 border-b border-border/50">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Railway Control System
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Section A-12 • Active monitoring • Real-time operations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Operator:</span> J. Smith
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="sm:hidden">Settings</span>
            </Button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <KPICard
            title="Throughput"
            value={142}
            unit="trains/hour"
            change={+5.2}
            icon={TrendingUp}
            status="success"
          />
          <KPICard
            title="Average Delay"
            value={3.2}
            unit="minutes"
            change={-1.1}
            icon={Clock}
            status="success"
          />
          <KPICard
            title="Punctuality"
            value={94.8}
            unit="%"
            change={+2.3}
            icon={Target}
            status="success"
          />
          <KPICard
            title="Track Utilization"
            value={78}
            unit="%"
            change={+4.1}
            icon={Activity}
            status="warning"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Train Tracker - Full width on small screens, 2/3 on large */}
          <div className="xl:col-span-2 order-1">
            <TrainTracker />
          </div>
          
          {/* Alerts and Recommendations - Stacked on mobile, sidebar on large */}
          <div className="space-y-4 sm:space-y-6 order-2">
            <ConflictAlerts />
            <RecommendationsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
