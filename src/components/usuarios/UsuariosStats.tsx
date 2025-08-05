import { Card, CardContent } from '../ui/card';
import { Users, Shield, User, Warehouse, BadgeCent } from 'lucide-react';
import { Usuario } from './types';

interface UsuariosStatsProps {
  usuarios: Usuario[];
}

export function UsuariosStats({ usuarios }: UsuariosStatsProps) {
  const statsConfig = [
    {
      label: 'Total de Usuários',
      value: usuarios.length,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Administradores',
      value: usuarios.filter(u => u.user_level === 'adm').length,
      icon: Shield,
      color: 'red'
    },
    {
      label: 'Vendas',
      value: usuarios.filter(u => u.user_level === 'vendas').length,
      icon: User,
      color: 'blue'
    },
    {
      label: 'Financeiro',
      value: usuarios.filter(u => u.user_level === 'financeiro').length,
      icon: BadgeCent,
      color: 'green'
    },
    {
      label: 'Logística',
      value: usuarios.filter(u => u.user_level === 'logistica').length,
      icon: Warehouse,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400',
      red: 'bg-red-500/20 text-red-400',
      green: 'bg-green-500/20 text-green-400',
      orange: 'bg-orange-500/20 text-orange-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${getColorClasses(stat.color)} rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
