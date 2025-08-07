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
  CircleCheck,
  CircleX,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
  const [vale, setVale] = useState("");

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
            
            <DialogContent className="max-w-2xl">
              <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600 rounded-xl p-6 border-none shadow-2xl">
                <CardHeader className="pb-4">
                  <span className="text-xl font-bold text-green-400 flex items-center gap-3">
                    <div className="p-2 bg-green-600/20 rounded-full">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    Aprovar Solicitação
                  </span>
                  <p className="text-slate-400 text-sm mt-2">
                    Envie os arquivos necessários e confirme se é vale para aprovar esta solicitação.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (selectedFiles.nfDevolucao && selectedFiles.recibo && vale && vale !== "") {
                        AprovarSolicitacao(id, selectedFiles.nfDevolucao, selectedFiles.recibo, vale);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        📎 Arquivos Necessários
                      </h3>
                      <FileUploadNFDevRecibo
                        onFilesChange={(files) => setSelectedFiles(files)}
                        onValidationChange={(isValid) => setFilesValid(isValid)}
                      />
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        🏷️ Informações Adicionais
                      </h3>
                      <div className="w-full">
                        <Label className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
                          É vale?
                          <span className="text-red-400 font-bold">*</span>
                        </Label>
                        <Select value={vale || undefined} onValueChange={(v) => setVale(v || "")}>
                          <SelectTrigger className="mt-1 bg-gradient-to-r from-slate-700 to-slate-600 border-slate-500 text-white w-full hover:from-slate-600 hover:to-slate-500 transition-all duration-200 shadow-lg h-12">
                            <SelectValue placeholder="Selecione se é vale ou não" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600 shadow-xl">
                            <SelectItem value="SIM" className="text-white hover:bg-green-600/20 focus:bg-green-600/20">
                              <div className="flex items-center">
                                <CircleCheck className="h-4 w-4 mr-2 text-green-400" />
                                <span>SIM</span>
                              </div>                         
                            </SelectItem>
                            <SelectItem value="NÃO" className="text-white hover:bg-red-600/20 focus:bg-red-600/20">
                              <div className="flex items-center">
                                <CircleX className="h-4 w-4 mr-2 text-red-400" />
                                <span>NÃO</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {!vale && (
                          <p className="text-amber-400 text-xs mt-2 flex items-center animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Campo obrigatório para aprovar a solicitação
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    
                    <Button
                      type="submit"
                      className={`w-full font-bold py-4 h-14 transition-all duration-300 ${
                        filesValid && vale
                          ? "bg-gradient-to-r from-green-600 via-green-700 to-green-600 hover:from-green-700 hover:via-green-800 hover:to-green-700 text-white shadow-xl transform hover:scale-[1.02] hover:shadow-green-500/25"
                          : "bg-gradient-to-r from-slate-600 to-slate-700 text-slate-400 cursor-not-allowed"
                      }`}
                      disabled={!filesValid || !vale}
                    >
                      {filesValid && vale
                        ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-lg">Aprovar Solicitação</span>
                          </div>
                        )
                        : (
                          <div className="flex items-center justify-center gap-3">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm">
                              {!filesValid && !vale 
                                ? "Envie os arquivos e selecione se é vale" 
                                : !filesValid 
                                ? "Envie ambos os arquivos" 
                                : "Selecione se é vale ou não"}
                            </span>
                          </div>
                        )}
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
