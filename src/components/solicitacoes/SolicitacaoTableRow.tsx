import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Calendar, User, Handshake, Wallet } from "lucide-react";
import { Solicitacao } from "@/types/solicitacao";
import { truncateText } from "@/utils/truncateText";
import {
  getStatusIcon,
  getStatusClass,
  getStatusBadgeVariant,
} from "@/utils/solicitacoes/statusUtils";
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
  onRefreshList?: () => void;
}

export const SolicitacaoTableRow: React.FC<SolicitacaoTableRowProps> = ({
  solicitacao,
  userPermissions,
  onRefreshList,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleActionComplete = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    // Atualizar a lista de solicitações
    onRefreshList?.();
  };

  const handleCloseDetailDialog = () => {
    setDialogOpen(false);
  };
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
  } = solicitacao;

  return (
    <>
      {/* Toast renderizado no nível da página */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="cursor-pointer hover:text-white">
          <TableRow className="border-slate-700 hover:bg-slate-700/30">
            <TableCell className="text-center">
              <Badge
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                #{id}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-medium text-white">
                    {truncateText(nome, 20)}
                  </p>
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
                  {new Date(created_at).toLocaleDateString()} -{" "}
                  {new Date(created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
          </TableRow>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-dark bg-slate-800 border-slate-700 text-white">
          <SolicitacaoDetailView
            solicitacao={solicitacao}
            userPermissions={userPermissions}
            onActionComplete={handleActionComplete}
            onCloseDetailDialog={handleCloseDetailDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
