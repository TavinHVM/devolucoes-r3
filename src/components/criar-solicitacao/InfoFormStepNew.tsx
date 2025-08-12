import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FileUploadNF } from "@/components/fileUploadNF";
import {
  Search,
  User,
  Package,
  CreditCard,
  ArrowRight,
  Loader2,
  Send
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { KeyboardEvent } from "react";

type FormData = {
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  nome_cobranca: string;
  cod_cobranca: string;
  rca: string;
  cgent: string;
  motivo_devolucao: string;
  tipo_devolucao: string;
  cod_cliente: string;
};

interface InfoFormStepProps {
  form: UseFormReturn<FormData>;
  numeroNF: string;
  setNumeroNF: (value: string) => void;
  nomeClient: string;
  numeroCodigoCliente: string;
  numeroCarga: string;
  codigoRca: string;
  codigoFilial: string;
  numeroCodigoCobranca: string;
  nomeCodigoCobranca: string;
  identificador: string;
  setArquivoNF: (file: File | null) => void;
  onAdvance: () => void;
  onSearchNF: () => void;
  isSearchingNF: boolean;
  nfExists: boolean;
  checkIdentificador: (id: string) => string;
  isButtonEnabled: () => boolean;
}

export function InfoFormStep({
  form,
  numeroNF,
  setNumeroNF,
  nomeClient,
  numeroCodigoCliente,
  numeroCarga,
  codigoRca,
  codigoFilial,
  numeroCodigoCobranca,
  nomeCodigoCobranca,
  identificador,
  setArquivoNF,
  onAdvance,
  onSearchNF,
  isSearchingNF,
  nfExists,
  checkIdentificador,
  isButtonEnabled,
}: InfoFormStepProps) {

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearchingNF && numeroNF.length >= 4) {
      e.preventDefault();
      onSearchNF();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <CardHeader className="flex flex-col w-full p-0 justify-start">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Nota Fiscal
          </CardTitle>
          <CardDescription className="text-slate-400">
            Digite o número da nota fiscal (4-6 dígitos) e pressione Enter ou clique em buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aviso se NF já existe */}
          {nfExists && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="font-medium">Esta nota fiscal já possui solicitações de devolução</span>
              </div>
            </div>
          )}

          <Form {...form}>
            <form className="space-y-6">
              <div className="gap-6">
                {/* Número da NF */}
                <FormField
                  control={form.control}
                  name="numero_nf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Número da Nota Fiscal
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Digite o número da NF"
                            {...field}
                            value={numeroNF}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 6) {
                                setNumeroNF(value);
                                field.onChange(value);
                              }
                            }}
                            onKeyPress={handleKeyPress}
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-12"
                            disabled={isSearchingNF}
                            maxLength={6}
                          />
                          <Button
                            type="button"
                            onClick={onSearchNF}
                            disabled={isSearchingNF || numeroNF.length < 4}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
                          >
                            {isSearchingNF ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Informações do Cliente */}
              <Card className="md:col-span-2 bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Nome do Cliente
                    </label>
                    <Input
                      value={nomeClient}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Código do Cliente
                    </label>
                    <Input
                      value={numeroCodigoCliente}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Número da Carga
                    </label>
                    <Input
                      value={numeroCarga}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      RCA
                    </label>
                    <Input
                      value={codigoRca}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Filial
                    </label>
                    <Input
                      value={codigoFilial}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">
                      Código de Cobrança
                    </label>
                    <Input
                      value={numeroCodigoCobranca}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">
                      Nome da Cobrança
                    </label>
                    <Input
                      value={nomeCodigoCobranca}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">
                      Identificador (CGENT)
                    </label>
                    <Input
                      value={checkIdentificador(identificador)}
                      readOnly
                      className="bg-slate-600 border-slate-500 text-slate-200 mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Informações da Solicitação */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Informações da Solicitação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 mx-4">
                  <FormField
                    control={form.control}
                    name="motivo_devolucao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Motivo da Devolução
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o motivo da devolução..."
                            {...field}
                            className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 resize-none h-24"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Upload de Arquivo */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Anexar Nota Fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent className="mx-4">
                  <FileUploadNF onFileChange={setArquivoNF} />
                </CardContent>
              </Card>

              {/* Botão de Avançar */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={onAdvance}
                  disabled={!isButtonEnabled() || nfExists}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 flex items-center gap-2 disabled:bg-slate-600 disabled:text-slate-400"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
