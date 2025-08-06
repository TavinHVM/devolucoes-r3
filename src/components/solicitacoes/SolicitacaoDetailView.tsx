import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  User,
  Package,
  Download,
} from "lucide-react";
import { Solicitacao } from "@/types/solicitacao";
import { getStatusIcon, getStatusClass, getStatusBadgeVariant } from "@/utils/solicitacoes/statusUtils";
import { ProdutosCard } from "@/components/solicitacoes/produtos";
import { ActionButtons } from "./ActionButtons";

interface SolicitacaoDetailViewProps {
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

export const SolicitacaoDetailView: React.FC<SolicitacaoDetailViewProps> = ({
  solicitacao,
  userPermissions,
}) => {
  const {
    id,
    nome,
    cod_cliente,
    filial,
    carga,
    numero_nf,
    rca,
    tipo_devolucao,
    vale,
    cod_cobranca,
    motivo_devolucao,
    motivo_recusa,
    status,
    created_at,
    arquivo_url,
  } = solicitacao;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-white w-full justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Solicitação #{id}
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <span className="text-md text-white flex items-center gap-2 font-bold">
                {getStatusIcon(status)}
              </span>
              <span>Status</span>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex gap-2 mx-4 h-full">
                <div className="flex justify-center h-full">
                  <Badge
                    variant={getStatusBadgeVariant(status)}
                    className={`flex items-center gap-1 w-fit ${getStatusClass(status)}`}
                  >
                    {getStatusIcon(status)}
                    {status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex text-slate-400 justify-end text-sm items-center gap-1">
                  <span>Criada em:</span>
                  <span>{new Date(created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Informações Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className="bg-slate-700/50 border-slate-600 col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mx-4">
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Código do cliente:</p>
                  <p className="text-white font-medium">{cod_cliente}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Nome do cliente:</p>
                  <p className="text-white font-medium">{nome}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Identificador do Cliente:</p>
                  <p className="text-white font-medium">{"10.641.901/0001-16"}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Filial:</p>
                  <p className="text-white font-medium">
                    {filial === "1" ? "1 - CD APARECIDA" : "5 - LOJA RIO VERDE"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nota Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mx-4">
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Carga:</p>
                  <p className="text-white font-medium">{carga}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">NF:</p>
                  <p className="text-white font-medium">{numero_nf}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Cód:</p>
                  <p className="text-white font-medium">{cod_cliente}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">RCA:</p>
                  <p className="text-white font-medium">{rca}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-white flex items-center gap-2">
                <Package className="h-4 w-4" />
                Devolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mx-4">
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Tipo de Devolução:</p>
                  <Badge
                    variant="secondary"
                    className={`text-white text-md w-fit capitalize ${
                      tipo_devolucao.toUpperCase() === "PARCIAL"
                        ? "bg-amber-500 hover:bg-amber-500"
                        : "bg-emerald-500 hover:bg-emerald-500"
                    }`}
                  >
                    {tipo_devolucao}
                  </Badge>
                </div>
                {vale && (
                  <div className="flex gap-2 items-center">
                    <p className="text-slate-400 text-sm">Vale:</p>
                    <Badge
                      variant="secondary"
                      className={`text-white text-md w-fit capitalize ${
                        (vale as string).toUpperCase() === "SIM"
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-red-800 hover:bg-red-800"
                      }`}
                    >
                      {vale}
                    </Badge>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Código Cobrança:</p>
                  <p className="text-white font-medium">{cod_cobranca}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-slate-400 text-sm">Nome Cobrança:</p>
                  <p className="text-white font-medium">{cod_cobranca}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivo da Devolução */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Motivo da Devolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-8">
              <p className="text-slate-300">{motivo_devolucao}</p>
            </div>
          </CardContent>
        </Card>

        {/* Motivo da Recusa */}
        {Boolean(motivo_recusa && motivo_recusa.trim()) && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Motivo da Recusa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-8">
                <p className="text-slate-300">{motivo_recusa}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Produtos */}
        <ProdutosCard numeroNF={numero_nf} />

        {/* Botões de Ação - Centralizados */}
        <div className="flex justify-center gap-4 mt-6">
          <ActionButtons solicitacao={solicitacao} userPermissions={userPermissions} />
        </div>
      </div>

      <DialogFooter>
        {arquivo_url && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Baixar NF
          </Button>
        )}
      </DialogFooter>
    </>
  );
};
