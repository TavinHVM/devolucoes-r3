import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatRelativeTime, formatBrazilianDateTime } from "../../utils/timeUtils";

interface ActivityItem {
  id: number;
  action: string;
  description: string;
  time: Date | string;
  type: 'success' | 'warning' | 'info';
  nome?: string;
  status?: string;
}

export const RecentActivity: React.FC = () => {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/recentActivity', {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError('Erro ao carregar atividades recentes');
        // Fallback to empty array
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const recentActivity: ActivityItem[] = [
    {
      id: 1,
      action: 'Solicitação aprovada',
      description: 'Solicitação #1234 foi aprovada',
      time: '2 horas atrás',
      type: 'success',
    },
    {
      id: 2,
      action: 'Nova solicitação',
      description: 'Solicitação #1235 foi criada',
      time: '4 horas atrás',
      type: 'info',
    },
    {
      id: 3,
      action: 'Solicitação recusada',
      description: 'Solicitação #1233 foi recusada',
      time: '6 horas atrás',
      type: 'warning',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  // Use real data if available, otherwise use fallback
  const displayActivities = activities.length > 0 ? activities : recentActivity;

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mx-4 max-h-96 overflow-y-auto scrollbar-dark">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 animate-pulse">
                <div className="h-4 w-4 bg-slate-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                  <div className="h-2 bg-slate-600 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mx-4 max-h-137 overflow-y-auto scrollbar-dark">
          {displayActivities.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-slate-400">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma atividade recente</p>
              </div>
            </div>
          ) : (
            displayActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{activity.action}</p>
                  <p className="text-slate-400 text-xs">{activity.description}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {typeof activity.time === 'string' ? activity.time : formatBrazilianDateTime(activity.time)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <div className="mx-4">
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-4 bg-blue-500/20"
            onClick={() => router.push('/solicitacoes')}
          >
            Ver todas as atividades
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
