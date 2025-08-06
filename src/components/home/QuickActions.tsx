import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Users,
  Zap,
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const router = useRouter();

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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
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
  );
};
