import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";
import { formatLastUpdate } from "../../utils/homeUtils";

export const SystemStatus: React.FC = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="px-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          Status do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mx-4">
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
  );
};
