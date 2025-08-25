import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  X,
  CalendarIcon,
} from "lucide-react";
import { Solicitacao } from "@/types/solicitacao";
import { DownloadDialog } from "./DownloadDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FiltersControlsProps {
  busca: string;
  setBusca: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  startDate: string | null;
  setStartDate: (value: string | null) => void;
  endDate: string | null;
  setEndDate: (value: string | null) => void;
  refreshing: boolean;
  onRefresh: () => void;
  // Add filtered solicitacoes for download
  filteredSolicitacoes: Solicitacao[];
}

export const FiltersControls: React.FC<FiltersControlsProps> = ({
  busca,
  setBusca,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  refreshing,
  onRefresh,
  filteredSolicitacoes,
}) => {
  // Função para criar data sem problemas de timezone
  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month é 0-indexed
  };

  // Função para formatar data local para string
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros e Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="w-full lg:w-2/5">
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

          {/* Period filter (data início - data fim) */}
          <div className="w-full lg:w-72">
            <label className="text-slate-300 text-sm font-medium flex items-center justify-between mb-1">
              Período
              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white h-auto p-1"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
            </label>
            <div className="flex gap-2">
              {/* Data Início */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white text-sm h-9"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {startDate ? (
                        format(createLocalDate(startDate), "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-slate-400">Data inicial</span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ? createLocalDate(startDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = formatLocalDate(date);
                        setStartDate(formattedDate);
                        
                        // Se a data final for anterior à nova data inicial, limpe a data final
                        if (endDate && date > createLocalDate(endDate)) {
                          setEndDate(null);
                        }
                      } else {
                        setStartDate(null);
                      }
                    }}
                    initialFocus
                    className="text-white [&_.rdp-day]:text-white [&_.rdp-day_selected]:bg-blue-600 [&_.rdp-day_selected]:text-white [&_.rdp-day:hover]:bg-slate-700"
                  />
                </PopoverContent>
              </Popover>

              {/* Data Fim */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white text-sm h-9"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {endDate ? (
                        format(createLocalDate(endDate), "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-slate-400">Data final</span>
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? createLocalDate(endDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = formatLocalDate(date);
                        setEndDate(formattedDate);
                      } else {
                        setEndDate(null);
                      }
                    }}
                    disabled={(date) => {
                      // Desabilita datas anteriores à data inicial se uma foi selecionada
                      if (startDate) {
                        return date < createLocalDate(startDate);
                      }
                      return false;
                    }}
                    initialFocus
                    className="text-white [&_.rdp-day]:text-white [&_.rdp-day_selected]:bg-blue-600 [&_.rdp-day_selected]:text-white [&_.rdp-day:hover]:bg-slate-700"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status */}
          <div className="w-full lg:w-44">
            <label className="text-slate-300 text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v || "Todos")}>
              <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white w-full h-9">
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

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={onRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Atualizando..." : "Atualizar"}
            </Button>

            <DownloadDialog 
              solicitacoes={filteredSolicitacoes}
              currentFilter={status}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
