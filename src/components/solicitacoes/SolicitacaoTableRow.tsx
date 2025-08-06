import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Eye,
  Calendar,
  User,
  Handshake,
  Wallet,
  Download,
} from "lucide-react";
import { Solicitacao } from "@/types/solicitacao";
import { truncateText } from "@/utils/truncateText";
import { getStatusIcon, getStatusClass, getStatusBadgeVariant } from "@/utils/solicitacoes/statusUtils";
import { SolicitacaoDetailView } from "./SolicitacaoDetailView";

interface SolicitacaoTableRowProps {
  solicitacao: Solicitacao;
  userPermissions: {
    canAprovar: boolean;
    canRecusar: boolean;
    canDesdobrar: boolean;
    canAbater: boolean;
    canFinalizar: boolean;
    canReenviar: boolean;
  };
}

export const SolicitacaoTableRow: React.FC<SolicitacaoTableRowProps> = ({
  solicitacao,
  userPermissions,
}) => {
  const {
    id,
    nome,
    filial,
    numero_nf,
    cod_cliente,
    rca,
    tipo_devolucao,
    created_at,
    status,
    arquivo_url,
  } = solicitacao;

  return (
    <TableRow className="border-slate-700 hover:bg-slate-700/30">
      <TableCell>
        <Badge variant="outline" className="text-slate-300 border-slate-600">
          #{id}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <div>
            <p className="font-medium text-white">{truncateText(nome, 20)}</p>
            <p className="text-sm text-slate-400">Filial: {filial}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Handshake className="h-4 w-4 text-slate-400" />
          <span className="text-white">{cod_cliente}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <span className="text-white">{numero_nf}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-400" />
          <p className="text-sm text-white">{rca}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={`text-white flex justify-center py-2 w-full max-w-16 text-sm capitalize ${
            tipo_devolucao.toUpperCase() === "PARCIAL"
              ? "bg-amber-500 hover:bg-amber-500"
              : "bg-emerald-500 hover:bg-emerald-500"
          }`}
        >
          {tipo_devolucao}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-white">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={getStatusBadgeVariant(status)}
          className={`flex items-center gap-1 ${getStatusClass(status)}`}
        >
          {getStatusIcon(status)}
          {status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger
              asChild
              className="cursor-pointer hover:text-white"
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-dark bg-slate-800 border-slate-700 text-white">
              <SolicitacaoDetailView
                solicitacao={solicitacao}
                userPermissions={userPermissions}
              />
            </DialogContent>
          </Dialog>

          {arquivo_url && (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:text-blue-400 hover:bg-blue-500/30 cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
