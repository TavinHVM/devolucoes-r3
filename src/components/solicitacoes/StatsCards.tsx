import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
  Zap,
} from "lucide-react";
import { Solicitacao } from "@/types/solicitacao";

interface StatsCardsProps {
  solicitacoes: Solicitacao[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ solicitacoes }) => {
  const stats = [
    {
      title: "Total",
      value: solicitacoes.length,
      icon: FileText,
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Pendentes",
      value: solicitacoes.filter((s) => s.status.toUpperCase() === "PENDENTE").length,
      icon: Clock,
      bgColor: "bg-gray-500/20",
      iconColor: "text-gray-400",
    },
    {
      title: "Aprovadas",
      value: solicitacoes.filter((s) => s.status.toUpperCase() === "APROVADA").length,
      icon: CheckCircle2,
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      title: "Recusadas",
      value: solicitacoes.filter((s) => s.status.toUpperCase() === "RECUSADA").length,
      icon: XCircle,
      bgColor: "bg-red-500/20",
      iconColor: "text-red-400",
    },
    {
      title: "Desdobradas",
      value: solicitacoes.filter((s) => s.status.toUpperCase() === "DESDOBRADA").length,
      icon: Target,
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Finalizadas",
      value: solicitacoes.filter((s) => s.status.toUpperCase() === "FINALIZADA").length,
      icon: Zap,
      bgColor: "bg-lime-500/20",
      iconColor: "text-lime-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 p-0">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="mb-1.5">
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
