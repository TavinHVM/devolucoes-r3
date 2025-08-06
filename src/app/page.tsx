'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';
import Header from '../components/header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  FileText,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  ArrowRight,
  BarChart3,
  Activity,
  AlertCircle,
  Target,
  Zap,
} from 'lucide-react';
import { getRandomTip, getTimeOfDay, formatLastUpdate } from '../utils/homeUtils';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalSolicitacoes: 0,
    pendentes: 0,
    aprovadas: 0,
    recusadas: 0,
    loading: true,
  });
  const [randomTip] = useState(getRandomTip());
  const [timeOfDay] = useState(getTimeOfDay());

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/getSolicitacoes');
        if (response.ok) {
          const data = await response.json();
          const pendentes = data.filter((s: any) => s.status.toUpperCase() === 'PENDENTE').length;
          const aprovadas = data.filter((s: any) => s.status.toUpperCase() === 'APROVADA').length;
          const recusadas = data.filter((s: any) => s.status.toUpperCase() === 'RECUSADA').length;
          
          setStats({
            totalSolicitacoes: data.length,
            pendentes,
            aprovadas,
            recusadas,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const quickActions = [
    {
      title: 'Nova Solicitação',
      description: 'Criar uma nova solicitação de devolução',
      icon: Plus,
      href: '/criar-solicitacao',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Ver Solicitações',
      description: 'Visualizar todas as solicitações',
      icon: FileText,
      href: '/solicitacoes',
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administrar usuários do sistema',
      icon: Users,
      href: '/usuarios',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const recentActivity = [
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

  if (isLoading || stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <div className="text-white text-xl">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Vai redirecionar para login
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bem-vindo ao Sistema de Devoluções R3
              </h1>
              {user && (
                <p className="text-slate-400">
                  {timeOfDay === 'morning' && 'Bom dia, '}
                  {timeOfDay === 'afternoon' && 'Boa tarde, '}
                  {timeOfDay === 'evening' && 'Boa noite, '}
                  <span className="text-green-400 font-medium">{user.first_name} {user.last_name}</span>! 
                  Aqui está um resumo das atividades.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total de Solicitações</p>
                  <p className="text-3xl font-bold text-white">{stats.totalSolicitacoes}</p>
                  <p className="text-slate-500 text-sm mt-1">Todas as solicitações</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Pendentes</p>
                  <p className="text-3xl font-bold text-white">{stats.pendentes}</p>
                  <p className="text-slate-500 text-sm mt-1">Aguardando análise</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Aprovadas</p>
                  <p className="text-3xl font-bold text-white">{stats.aprovadas}</p>
                  <p className="text-slate-500 text-sm mt-1">Aprovadas hoje</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Recusadas</p>
                  <p className="text-3xl font-bold text-white">{stats.recusadas}</p>
                  <p className="text-slate-500 text-sm mt-1">Requerem atenção</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-full">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`h-auto p-6 flex flex-col items-center gap-3 ${action.color} text-white hover:text-white transition-all duration-200 hover:scale-105`}
                        onClick={() => router.push(action.href)}
                      >
                        <IconComponent className="h-8 w-8" />
                        <div className="text-center">
                          <p className="font-semibold">{action.title}</p>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Resumo de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Taxa de Aprovação</span>
                      <span className="text-green-400 font-medium">
                        {stats.totalSolicitacoes > 0 
                          ? Math.round((stats.aprovadas / stats.totalSolicitacoes) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: stats.totalSolicitacoes > 0 
                            ? `${(stats.aprovadas / stats.totalSolicitacoes) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Solicitações Pendentes</span>
                      <span className="text-yellow-400 font-medium">
                        {stats.totalSolicitacoes > 0 
                          ? Math.round((stats.pendentes / stats.totalSolicitacoes) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: stats.totalSolicitacoes > 0 
                            ? `${(stats.pendentes / stats.totalSolicitacoes) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Tips */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => router.push('/solicitacoes')}
                >
                  Ver todas as atividades
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Tips & Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                  Dicas Úteis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-medium text-sm">{randomTip.title}</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {randomTip.message}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Lembrete</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Solicitações pendentes há mais de 24h aparecem destacadas na lista.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Sistema</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Última atualização</span>
                    <span className="text-slate-400 text-sm">{formatLastUpdate()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Versão</span>
                    <span className="text-slate-400 text-sm">v2.1.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
