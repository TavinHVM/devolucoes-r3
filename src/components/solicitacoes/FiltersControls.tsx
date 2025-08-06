import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Search,
  RefreshCw,
  Download,
} from "lucide-react";

interface FiltersControlsProps {
  busca: string;
  setBusca: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export const FiltersControls: React.FC<FiltersControlsProps> = ({
  busca,
  setBusca,
  status,
  setStatus,
  refreshing,
  onRefresh,
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros e Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 items-end pl-4">
          <div className="flex-1">
            <label className="text-slate-300 text-sm font-medium">
              Buscar solicitações
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Nome, NF, cliente, RCA..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="w-full lg:w-48">
            <label className="text-slate-300 text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v || "Todos")}>
              <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white w-full">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Todos" className="text-white">
                  Todos
                </SelectItem>
                <SelectItem value="PENDENTE" className="text-white">
                  Pendente
                </SelectItem>
                <SelectItem value="APROVADA" className="text-white">
                  Aprovada
                </SelectItem>
                <SelectItem value="RECUSADA" className="text-white">
                  Recusada
                </SelectItem>
                <SelectItem value="DESDOBRADA" className="text-white">
                  Desdobrada
                </SelectItem>
                <SelectItem value="REENVIADA" className="text-white">
                  Reenviada
                </SelectItem>
                <SelectItem value="ABATIDA" className="text-white">
                  Abatida
                </SelectItem>
                <SelectItem value="FINALIZADA" className="text-white">
                  Finalizada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pr-4">
            <Button
              onClick={onRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Atualizando..." : "Atualizar"}
            </Button>

            <Button className="bg-green-600 hover:bg-green-700 text-white h-10 cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Relatório
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
