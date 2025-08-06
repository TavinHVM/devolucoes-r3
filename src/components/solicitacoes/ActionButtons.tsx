import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  Target,
  AlertTriangle,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Solicitacao, SelectedFiles } from "@/types/solicitacao";
import { FileUploadNFDevRecibo } from "@/components/fileUpload_NFDev_Recibo";
import {
  AprovarSolicitacao,
  RecusarSolicitacao,
  DesdobrarSolicitacao,
  AbaterSolicitacao,
  FinalizarSolicitacao,
  ReenviarSolicitacao,
} from "@/utils/solicitacoes/botoesSolicitacoes";

interface ActionButtonsProps {
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

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  solicitacao,
  userPermissions,
}) => {
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>({
    nfDevolucao: null,
    recibo: null,
  });
  const [filesValid, setFilesValid] = useState(false);

  const { status, id } = solicitacao;

  if (status.toUpperCase() === "PENDENTE") {
    return (
      <>
        {userPermissions.canAprovar && (
          <Dialog>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <DialogTrigger className="flex items-center justify-center text-sm font-semibold gap-1 bg-green-600 hover:bg-green-700 cursor-pointer py-2 px-4 rounded-md">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span>Aprovar</span>
            </DialogTrigger>
            
            <DialogContent>
              <Card className="bg-slate-800 border-slate-600 rounded-lg p-6 border-none shadow-none">
                <CardHeader>
                  <span className="text-lg font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Aprovar Solicitação
                  </span>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (selectedFiles.nfDevolucao && selectedFiles.recibo) {
                        AprovarSolicitacao(id, selectedFiles.nfDevolucao, selectedFiles.recibo);
                      }
                    }}
                  >
                    <FileUploadNFDevRecibo
                      onFilesChange={(files) => setSelectedFiles(files)}
                      onValidationChange={(isValid) => setFilesValid(isValid)}
                    />
                    <Button
                      type="submit"
                      className={`w-full font-bold mt-4 ${
                        filesValid
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-slate-600 text-slate-400 cursor-not-allowed"
                      }`}
                      disabled={!filesValid}
                    >
                      {filesValid
                        ? "Aprovar Solicitação"
                        : "Selecione ambos os arquivos para aprovar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}

        {userPermissions.canRecusar && (
          <Dialog>
            <DialogTrigger className="flex items-center justify-center text-sm font-semibold gap-1 bg-red-600 hover:bg-red-700 cursor-pointer py-2 px-4 rounded-md">
              <XCircle className="h-4 w-4 mr-2" />
              <span>Recusar</span>
            </DialogTrigger>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <DialogContent>
              <Card className="bg-slate-800 border-slate-600 rounded-lg p-6 border-none shadow-none">
                <CardHeader>
                  <span className="text-lg font-bold text-red-400 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Motivo da Recusa
                  </span>
                </CardHeader>
                <CardContent>
                  <Label className="text-slate-300 mb-2 block">
                    Digite o Motivo da Recusa:
                  </Label>
                  <Input
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 mb-4"
                    placeholder="Descreva o motivo..."
                    value={motivoRecusa}
                    onChange={(e) => setMotivoRecusa(e.target.value)}
                  />
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold w-full mt-2"
                    onClick={() => RecusarSolicitacao(id, motivoRecusa)}
                    disabled={motivoRecusa.trim() === ""}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Recusar
                  </Button>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  if (status.toUpperCase() === "APROVADA" && userPermissions.canDesdobrar) {
    return (
      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => DesdobrarSolicitacao(id)}
      >
        <Target className="h-4 w-4 mr-2" />
        Desdobrar
      </Button>
    );
  }

  if (status.toUpperCase() === "DESDOBRADA" && userPermissions.canAbater) {
    return (
      <Button
        className="bg-yellow-600 hover:bg-yellow-700"
        onClick={() => AbaterSolicitacao(id)}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Abater
      </Button>
    );
  }

  if (status.toUpperCase() === "ABATIDA" && userPermissions.canFinalizar) {
    return (
      <Button
        className="bg-lime-600 hover:bg-lime-700"
        onClick={() => FinalizarSolicitacao(id)}
      >
        <Zap className="h-4 w-4 mr-2" />
        Finalizar
      </Button>
    );
  }

  if (status.toUpperCase() === "RECUSADA" && userPermissions.canReenviar) {
    return (
      <Button
        className="bg-orange-600 hover:bg-orange-700"
        onClick={() => ReenviarSolicitacao(id)}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reenviar
      </Button>
    );
  }

  return null;
};
