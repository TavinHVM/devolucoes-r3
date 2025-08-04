"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { useForm } from "react-hook-form";
import Header from "../../components/header";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Package,
  User,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingCart,
  Calculator
} from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  nome: z.string().min(1, { message: "" }),
  filial: z.string().min(1, { message: "" }),
  numero_nf: z.string().min(1, { message: "" }),
  carga: z.string().min(1, { message: "" }),
  codigo_cobranca: z.string().min(1, { message: "" }),
  rca: z.string().min(1, { message: "" }),
  motivo_devolucao: z.string().min(1, { message: "" }),
  codigo_cliente: z.string().min(1, { message: "" }),
  tipo_devolucao: z.string().min(1, { message: "" }),
  lista_produtos: z.string().min(1, { message: "" }),
});

// Toast Component
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${type === "success" ? "bg-green-600" : "bg-red-500"
        }`}
      role="alert"
    >
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg leading-none">
          ×
        </button>
      </div>
    </div>
  );
}

export async function fetchNameProd(cod: string): Promise<string> {
  const res = await fetch(`/api/produto/${cod}`);
  const data = await res.json();
  return data.nameProd || "";
}

export async function fetchNameClient(cod: string): Promise<string> {
  const res = await fetch(`/api/nomeCliente/${cod}`);
  const data = await res.json();
  return data.nameClient || "";
}

interface Produto {
  codprod: string;
  descricao: string;
  qt: number;
  punit: number;
}

interface InfosNF {
  codcli: string;
  numcar: string;
  codusur: string;
  codcob: string;
  cobranca: string;
  cliente: string;
  codfilial: string;
  cgcent: string;
}

export async function fetchProdutosNF(numnota: string): Promise<Produto[]> {
  try {
    console.log("Fazendo requisição para:", `/api/getProdutosNF/${numnota}`);
    const res = await fetch(`/api/getProdutosNF/${numnota}`);
    console.log("Status da resposta:", res.status);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Dados recebidos da API:", data);

    return data.produtos || [];
  } catch (error) {
    console.error("Erro na função fetchProdutosNF:", error);
    return [];
  }
}

export async function fetchInfosNF(numnota: string): Promise<InfosNF | null> {
  const res = await fetch(`/api/getInfosNF/${numnota}`);
  if (!res.ok) {
    console.error("Erro na requisição:", res.status, res.statusText);
    return null;
  }
  const data = await res.json();
  return data;
}

export default function Solicitacao() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [numeroNF, setNumeroNF] = useState<string>("");
  const [codigoRca, setCodigoRca] = useState<string>("");
  const [nomeClient, setNomeClient] = useState<string>("");
  const [numeroCarga, setNumeroCarga] = useState<string>("");
  const [codigoFilial, setCodigoFilial] = useState<string>("");
  const [nomeCodigoCobranca, setNomeCodigoCobranca] = useState<string>("");
  const [numeroCodigoCobranca, setNumeroCodigoCobranca] = useState<string>("");
  const [numeroCodigoCliente, setNumeroCodigoCliente] = useState<string>("");
  const [statusCobranca1, setstatusCobranca1] = useState<string>("hidden");
  const [statusCobranca2, setstatusCobranca2] = useState<string>("display");
  const [tipoDevolucao, setTipoDevolucao] = useState<string>("");
  const [identificador, setIdentificador] = useState<string>("");
  const [produtosSelecionados, setProdutosSelecionados] = useState<Set<string>>(
    new Set()
  );
  const [produtos, setProdutos] = useState<
    Array<{
      codigo: string;
      descricao: string;
      quantidade: string;
      punit: string;
    }>
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      filial: "",
      numero_nf: "",
      carga: "",
      codigo_cobranca: "",
      rca: "",
      motivo_devolucao: "",
      codigo_cliente: "",
      tipo_devolucao: "",
    },
  });

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }

    //  Adicionar o log de erros de validação aqui
    const { errors } = form.formState;
    console.log("Erros do formulário:", errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // Monitorar mudanças nos produtos
  useEffect(() => {
    console.log("Estado dos produtos atualizado:", produtos);
  }, [produtos]);

  // Controlar automaticamente o tipo de devolução baseado na seleção
  useEffect(() => {
    if (produtos.length > 0) {
      if (produtosSelecionados.size === produtos.length && produtosSelecionados.size > 0) {
        setTipoDevolucao("total");
      } else if (produtosSelecionados.size > 0) {
        setTipoDevolucao("parcial");
      } else {
        setTipoDevolucao("");
      }
    }
  }, [produtosSelecionados, produtos]);

  useEffect(() => {
    const fetchInfosNota = async () => {
      if (numeroNF.length == 6) {
        const infos_nota = await fetchInfosNF(numeroNF);
        if (infos_nota) {
          setNomeClient(infos_nota.cliente);
          setNumeroCodigoCliente(infos_nota.codcli);
          setCodigoRca(infos_nota.codusur);
          setNumeroCodigoCobranca(infos_nota.codcob);
          setNumeroCarga(infos_nota.numcar);
          setNomeCodigoCobranca(infos_nota.cobranca);
          setCodigoFilial(infos_nota.codfilial);
          setIdentificador(infos_nota.cgcent)
        } else {
          setNomeClient("");
        }
      } else {
        setNomeClient("");
      }
    };
    fetchInfosNota();
  }, [numeroNF]);

  async function avancarPagina() {
    // Buscar produtos da NF
    if (numeroNF) {
      try {
        console.log("Buscando produtos para NF:", numeroNF);
        const produtosNF = await fetchProdutosNF(numeroNF);
        console.log("Produtos recebidos da API:", produtosNF);

        const produtosFormatados = produtosNF.map((produto) => ({
          codigo: produto.codprod,
          descricao: produto.descricao,
          quantidade: produto.qt.toString(),
          punit: produto.punit.toString(),
        }));

        console.log("Produtos formatados:", produtosFormatados);
        setProdutos(produtosFormatados);
        setstatusCobranca1("hidden");
        setstatusCobranca2("display");
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      }
    } else {
      console.log("Número da NF não informado");
    }
  }

  function voltarPagina() {
    setstatusCobranca1("display");
    setstatusCobranca2("hidden");
  }

  function checkIdentificador(identificador: string): string {
    // Remove qualquer caractere que não seja número
    const cleaned = identificador.replace(/\D/g, '');

    if (cleaned.length > 11) {
      // Formata como CNPJ: 00.000.000/0000-00
      return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    } else {
      // Formata como CPF: 000.000.000-00
      return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
  }


  // Função nova para salvar no banco, adptar ela em relação à antiga

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit chamado com os dados:", data); // Debug
    try {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("filial", data.filial);
      formData.append("codigo_cliente", data.codigo_cliente);
      formData.append("codigo_cobranca", data.codigo_cobranca);
      formData.append("motivo_devolucao", data.motivo_devolucao);
      formData.append("rca", data.rca);
      formData.append("tipo_devolucao", data.tipo_devolucao);
      formData.append("carga", data.carga);
      formData.append("numero_nf", data.numero_nf);
      formData.append("numero_nf", data.lista_produtos);

      const response = await fetch("/api/registerAdm", {
        method: "POST",
        body: formData,
        headers: {
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      });

      console.log("Resposta do servidor:", response);

      if (!response.ok) {
        throw new Error("Erro ao criar registro.");
      }

      const result = await response.json();
      console.log("Registro realizado com sucesso:", result);
    } catch (error) {
      console.error("Erro ao criar registro:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      {/* Toast Overlay */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Nova Solicitação de Devolução</h1>
              <p className="text-slate-400">Crie uma nova solicitação de devolução de produtos</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/10 ${statusCobranca1 === "display" ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              onClick={() => {
                setstatusCobranca1("display");
                setstatusCobranca2("hidden");
              }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusCobranca1 === "display" ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-400"
                }`}>1</div>
              <span className="font-medium">Informações da NF</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/10 ${statusCobranca2 === "display" ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              onClick={() => {
                // Só permite avançar se tiver NF válida
                if (numeroNF && numeroNF.length === 6) {
                  avancarPagina();
                }
              }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusCobranca2 === "display" ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-400"
                }`}>2</div>
              <span className="font-medium">Seleção de Produtos</span>
            </div>
          </div>
        </div>

        {/* Etapa 1: Informações da NF */}
        {statusCobranca1 === "display" && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Nota Fiscal
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Digite o número da nota fiscal para buscar as informações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="numero_nf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">Número da Nota Fiscal</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  placeholder="Digite o número da NF (6 dígitos) ou (4 dígitos)"
                                  value={numeroNF}
                                  maxLength={6}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                      setNumeroNF(val);
                                      field.onChange(val);
                                    }
                                  }}
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                />
                              </FormControl>
                              <FormMessage />
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
                            <label className="text-sm font-medium text-slate-300">Nome do Cliente</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {nomeClient || "CLIENTE NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">Código do Cliente</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {numeroCodigoCliente || "CÓDIGO NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Informações da Carga e Cobrança */}
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Informações da Carga
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 mx-4">
                          <div>
                            <label className="text-sm font-medium text-slate-300">Número da Carga</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {numeroCarga || "CARGA NÃO ENCONTRADA"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">Código RCA</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {codigoRca || "RCA NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">Código Filial</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {codigoFilial || "FILIAL NÃO ENCONTRADA"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Informações de Cobrança
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4">
                          <div>
                            <label className="text-sm font-medium text-slate-300">Código da Cobrança</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {numeroCodigoCobranca || "CÓDIGO NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">Nome da Cobrança</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {nomeCodigoCobranca || "COBRANÇA NÃO ENCONTRADA"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">Identificador da Cobrança</label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {checkIdentificador(identificador) || "IDENTIFICADOR NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="motivo_devolucao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">Motivo da Devolução</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Descreva o motivo da devolução..."
                                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={avancarPagina}
                        disabled={!numeroNF || numeroNF.length !== 6}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                      >
                        Avançar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Etapa 2: Seleção de Produtos */}
        {statusCobranca2 === "display" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={voltarPagina}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                NF: {numeroNF}
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                Cliente: {nomeClient}
              </Badge>
            </div>

            {/* Controles do Tipo de Devolução */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Tipo de Devolução
                </CardTitle>
              </CardHeader>
              <CardContent className="mx-6 min-h-[120px]">
                <Select value={tipoDevolucao} disabled>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white opacity-100 cursor-not-allowed">
                    <SelectValue placeholder="Selecione produtos para determinar o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="total" className="text-white">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Devolução Total
                      </div>
                    </SelectItem>
                    <SelectItem value="parcial" className="text-white">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-orange-400" />
                        Devolução Parcial
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 h-6 flex items-center">
                  {tipoDevolucao && (
                    <p className="text-sm text-slate-400">
                      {tipoDevolucao === "total" 
                        ? "Todos os produtos foram selecionados para devolução" 
                        : "Alguns produtos foram selecionados para devolução"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Produtos */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Produtos da Nota Fiscal
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Selecione os produtos que deseja devolver
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (produtosSelecionados.size === produtos.length) {
                        setProdutosSelecionados(new Set());
                      } else {
                        setProdutosSelecionados(new Set(produtos.map((p) => p.codigo)));
                      }
                    }}
                    className={`border-slate-600 hover:bg-slate-600 transition-colors ${
                      produtosSelecionados.size === produtos.length && produtos.length > 0
                        ? "bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600/30"
                        : produtosSelecionados.size > 0
                        ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-600/30"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {produtosSelecionados.size === produtos.length && produtos.length > 0
                      ? "Desselecionar Todos"
                      : "Selecionar Todos"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Selecionar</TableHead>
                      <TableHead className="text-slate-300">Código</TableHead>
                      <TableHead className="text-slate-300">Produto</TableHead>
                      <TableHead className="text-slate-300 text-center">Quantidade</TableHead>
                      <TableHead className="text-slate-300 text-center">Preço Unit.</TableHead>
                      <TableHead className="text-slate-300 text-center">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(produtos) && produtos.length > 0 ? (
                      produtos.map((p) => (
                        <TableRow
                          key={p.codigo}
                          className="border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                          onClick={() => {
                            const newSelecionados = new Set(produtosSelecionados);
                            if (produtosSelecionados.has(p.codigo)) {
                              newSelecionados.delete(p.codigo);
                            } else {
                              newSelecionados.add(p.codigo);
                            }
                            setProdutosSelecionados(newSelecionados);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Checkbox
                                className="data-[state=checked]:bg-amber-400 border-slate-500"
                                checked={produtosSelecionados.has(p.codigo)}
                                onCheckedChange={(checked) => {
                                  const newSelecionados = new Set(produtosSelecionados);
                                  if (checked) {
                                    newSelecionados.add(p.codigo);
                                  } else {
                                    newSelecionados.delete(p.codigo);
                                  }
                                  setProdutosSelecionados(newSelecionados);
                                }}
                                onClick={(e) => e.stopPropagation()} // Previne duplo toggle quando clica na checkbox
                                className={`h-4 w-4 ${
                                  produtos.length > 0 && produtosSelecionados.size === produtos.length && produtosSelecionados.size > 0
                                    ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    : "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                                }`}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              {p.codigo}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium">{p.descricao}</TableCell>
                          <TableCell className="text-center text-slate-300">{p.quantidade}</TableCell>
                          <TableCell className="text-center text-slate-300">
                            {formatPrice(Number(p.punit))}
                          </TableCell>
                          <TableCell className="text-center text-white font-medium">
                            {formatPrice(Number(p.punit) * Number(p.quantidade))}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:bg-slate-700/50">
                        <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-slate-800 hover:bg-slate-700">
                      <TableCell colSpan={5} className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Calculator className="h-4 w-4 text-slate-400" />
                          <span className="text-white font-bold">Total Selecionado:</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xl font-bold text-green-400">
                          {formatPrice(
                            produtos
                              .filter((p) => produtosSelecionados.has(p.codigo))
                              .reduce((acc, p) => acc + Number(p.punit) * Number(p.quantidade), 0)
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                disabled={produtosSelecionados.size === 0 || !tipoDevolucao}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Finalizar Solicitação
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
