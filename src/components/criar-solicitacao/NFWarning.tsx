import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Clock, CheckCircle, XCircle } from "lucide-react";

interface SolicitacaoExistente {
  id: number;
  numero_nf: string;
  status: string;
  created_at: string;
  nome: string;
  cod_cliente: string;
}

interface NFWarningProps {
  solicitacoes: SolicitacaoExistente[];
  onDismiss: () => void;
  onContinue?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'aprovada':
    case 'finalizada':
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'rejeitada':
    case 'cancelada':
      return <XCircle className="h-4 w-4 text-red-400" />;
    case 'pendente':
    case 'em_analise':
      return <Clock className="h-4 w-4 text-yellow-400" />;
    default:
      return <Clock className="h-4 w-4 text-blue-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'aprovada':
    case 'finalizada':
      return 'text-green-400';
    case 'rejeitada':
    case 'cancelada':
      return 'text-red-400';
    case 'pendente':
    case 'em_analise':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};

export function NFWarning({ solicitacoes, onDismiss, onContinue }: NFWarningProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Alert className="border-orange-500/50 bg-orange-500/10 mb-4">
      <AlertTriangle className="h-4 w-4 text-orange-400" />
      <AlertDescription>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-orange-300 font-medium mb-2">
              ⚠️ Atenção: Já existem {solicitacoes.length} solicitação(ões) para esta Nota Fiscal
            </p>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {solicitacoes.map((solicitacao) => (
                <div 
                  key={solicitacao.id} 
                  className="bg-slate-700/50 rounded p-2 text-xs border border-slate-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(solicitacao.status)}
                      <span className={`font-medium ${getStatusColor(solicitacao.status)}`}>
                        {solicitacao.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      #{solicitacao.id}
                    </span>
                  </div>
                  <div className="mt-1 text-slate-300">
                    <p><strong>Cliente:</strong> {solicitacao.nome}</p>
                    <p><strong>Código:</strong> {solicitacao.cod_cliente}</p>
                    <p><strong>Criada em:</strong> {formatDate(solicitacao.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-orange-200 text-sm mt-2">
              Você pode continuar criando uma nova solicitação ou verificar as existentes na página de solicitações.
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {onContinue && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onContinue}
              className="border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
            >
              Continuar Mesmo Assim
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
