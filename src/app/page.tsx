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
import { useRouter } from "next/router";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { stats, randomTips, timeOfDay } = useHomePage(isAuthenticated);

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
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <PerformanceOverview stats={stats} />
            
            {/* Bottom row for Tips and System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TipsAndInfo randomTips={randomTips} />
              <SystemStatus />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
