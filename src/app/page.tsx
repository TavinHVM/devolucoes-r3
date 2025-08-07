"use client";
import { useAuth } from "../contexts/AuthContext";
import { useHomePage } from "../hooks/useHomePage";
import Header from "../components/header";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  WelcomeHeader,
  DashboardStats,
  QuickActions,
  PerformanceOverview,
  RecentActivity,
  TipsAndInfo,
  SystemStatus,
  DashboardLoading,
} from "../components/home";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user, isAuthenticated } = useAuth();
  const { stats, randomTip, timeOfDay } = useHomePage(isAuthenticated);

  if (stats.loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader user={user} timeOfDay={timeOfDay} />

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <QuickActions />
            <PerformanceOverview stats={stats} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity />
            <TipsAndInfo randomTip={randomTip} />
            <SystemStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
