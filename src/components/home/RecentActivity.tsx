import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface ActivityItem {
  id: number;
  action: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

export const RecentActivity: React.FC = () => {
  const router = useRouter();

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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mx-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{activity.action}</p>
                <p className="text-slate-400 text-xs">{activity.description}</p>
                <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>

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
