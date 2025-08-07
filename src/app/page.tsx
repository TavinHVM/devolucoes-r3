'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';
import { useHomePage } from '../hooks/useHomePage';
import Header from '../components/header';
import {
  WelcomeHeader,
  DashboardStats,
  QuickActions,
  PerformanceOverview,
  RecentActivity,
  TipsAndInfo,
  SystemStatus,
  DashboardLoading,
} from '../components/home';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { stats, randomTip, timeOfDay } = useHomePage(isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || stats.loading) {
    return <DashboardLoading />;
  }

  if (!isAuthenticated) {
    return null; // Vai redirecionar para login
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
              <TipsAndInfo randomTip={randomTip} />
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
