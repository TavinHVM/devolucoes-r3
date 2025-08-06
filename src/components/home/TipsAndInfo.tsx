import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AlertCircle,
  Target,
  CheckCircle2,
} from "lucide-react";

interface TipsAndInfoProps {
  randomTip: {
    title: string;
    message: string;
    type: string;
  };
}

export const TipsAndInfo: React.FC<TipsAndInfoProps> = ({ randomTip }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-400" />
          Dicas Úteis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mx-4">
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
  );
};
