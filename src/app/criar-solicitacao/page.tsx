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
import ProtectedRoute from "../../components/ProtectedRoute";
import CreateSolicitacaoRoute from "../../components/CreateSolicitacaoRoute";
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
  Calculator,
  Plus,
  Minus,
  SquareCheck,
  SquareX,
} from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { FileUploadNF } from "@/components/fileUploadNF";

const formSchema = z.object({
  nome: z.string().min(1, { message: "" }),
  filial: z.string().min(1, { message: "" }),
  numero_nf: z.string().min(1, { message: "" }),
  carga: z.string().min(1, { message: "" }),
  nome_cobranca: z.string().min(1, { message: "" }),
  cod_cobranca: z.string().min(1, { message: "" }),
  rca: z.string().min(1, { message: "" }),
  cgent: z.string().min(1, { message: "" }),
  motivo_devolucao: z.string().min(1, { message: "" }),
  tipo_devolucao: z.string().min(1, { message: "" }),
  cod_cliente: z.string().min(1, { message: "" }),
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
      className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${
        type === "success" ? "bg-green-600" : "bg-red-500"
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
  return (
    <ProtectedRoute>
      <CreateSolicitacaoRoute>
        <SolicitacaoContent />
      </CreateSolicitacaoRoute>
    </ProtectedRoute>
  );
}

function SolicitacaoContent() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // Exibir toast salvo no localStorage após reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toastMsg = localStorage.getItem("solicitacao-toast-message");
      const toastType = localStorage.getItem("solicitacao-toast-type");
      if (toastMsg && toastType) {
        setToast({ message: toastMsg, type: toastType as "success" | "error" });
        localStorage.removeItem("solicitacao-toast-message");
        localStorage.removeItem("solicitacao-toast-type");
      }
    }
  }, []);
  const [numeroNF, setNumeroNF] = useState<string>("");
  const [codigoRca, setCodigoRca] = useState<string>("");
  const [nomeClient, setNomeClient] = useState<string>("");
  const [numeroCarga, setNumeroCarga] = useState<string>("");
  const [codigoFilial, setCodigoFilial] = useState<string>("");
  const [nomeCodigoCobranca, setNomeCodigoCobranca] = useState<string>("");
  const [numeroCodigoCobranca, setNumeroCodigoCobranca] = useState<string>("");
  const [numeroCodigoCliente, setNumeroCodigoCliente] = useState<string>("");
  const [statusCobranca1, setstatusCobranca1] = useState<string>("display");
  const [statusCobranca2, setstatusCobranca2] = useState<string>("hidden");
  const [tipoDevolucao, setTipoDevolucao] = useState<string>("");
  const [identificador, setIdentificador] = useState<string>("");
  const [arquivoNF, setArquivoNF] = useState<File | null>(null);

  // Estado para controlar quantidades de devolução por produto
  const [quantidadesDevolucao, setQuantidadesDevolucao] = useState<
    Record<string, number>
  >({});

  // Estado para controlar se todos os produtos estão selecionados
  const [todosSelecionados, setTodosSelecionados] = useState<boolean>(false);

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
      nome: nomeClient,
      filial: codigoFilial,
      numero_nf: numeroNF,
      carga: numeroCarga,
      nome_cobranca: nomeCodigoCobranca,
      cod_cobranca: numeroCodigoCobranca,
      rca: codigoRca,
      cgent: identificador,
      motivo_devolucao: "",
      tipo_devolucao: tipoDevolucao,
      cod_cliente: numeroCodigoCliente,
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
      const totalQuantidadeDevolucao = Object.values(
        quantidadesDevolucao
      ).reduce((acc, qtd) => acc + qtd, 0);
      const totalQuantidadeNota = produtos.reduce(
        (acc, p) => acc + Number(p.quantidade),
        0
      );

      // Verificar se todos os produtos estão com quantidade máxima selecionada
      const todosComQuantidadeMaxima = produtos.every(
        (produto) =>
          (quantidadesDevolucao[produto.codigo] || 0) ===
          Number(produto.quantidade)
      );
      setTodosSelecionados(todosComQuantidadeMaxima);

      if (
        totalQuantidadeDevolucao === totalQuantidadeNota &&
        totalQuantidadeDevolucao > 0
      ) {
        setTipoDevolucao("total");
      } else if (totalQuantidadeDevolucao > 0) {
        setTipoDevolucao("parcial");
      } else {
        setTipoDevolucao("");
      }
    }
  }, [quantidadesDevolucao, produtos]);

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
          setIdentificador(infos_nota.cgcent);
        } else {
          setNomeClient("");
        }
      } else {
        setNomeClient("");
      }
    };
    fetchInfosNota();
  }, [numeroNF]);

  // Atualizar valores do formulário quando os estados mudarem
  useEffect(() => {
    form.setValue("nome", nomeClient);
    form.setValue("filial", codigoFilial);
    form.setValue("numero_nf", numeroNF);
    form.setValue("carga", numeroCarga);
    form.setValue("nome_cobranca", nomeCodigoCobranca);
    form.setValue("cod_cobranca", numeroCodigoCobranca);
    form.setValue("rca", codigoRca);
    form.setValue("cgent", identificador);
    form.setValue("tipo_devolucao", tipoDevolucao);
    form.setValue("cod_cliente", numeroCodigoCliente);
  }, [
    nomeClient,
    codigoFilial,
    numeroNF,
    numeroCarga,
    nomeCodigoCobranca,
    numeroCodigoCobranca,
    codigoRca,
    identificador,
    tipoDevolucao,
    numeroCodigoCliente,
    form,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("motivo_devolucao"), arquivoNF]);

  const isButtonEnabled = () => {
    const motivoDevolucao = form.getValues("motivo_devolucao");
    return (
      numeroNF &&
      numeroNF.length === 6 &&
      motivoDevolucao &&
      motivoDevolucao.trim() !== "" &&
      arquivoNF
    );
  };

  async function avancarPagina() {
    // Validar se o motivo da devolução está preenchido
    const motivoDevolucao = form.getValues("motivo_devolucao");
    if (!motivoDevolucao || motivoDevolucao.trim() === "") {
      console.log("Motivo da devolução não preenchido");
      setToast({
        message:
          "Por favor, preencha o motivo da devolução antes de continuar.",
        type: "error",
      });
      return;
    }

    // Validar se o arquivo da nota fiscal foi selecionado
    if (!arquivoNF) {
      console.log("Arquivo da nota fiscal não selecionado");
      setToast({
        message:
          "Por favor, selecione o arquivo da nota fiscal antes de continuar.",
        type: "error",
      });
      return;
    }

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

        // Inicializar quantidades de devolução como zero
        const quantidadesIniciais: Record<string, number> = {};
        produtosFormatados.forEach((produto) => {
          quantidadesIniciais[produto.codigo] = 0;
        });
        setQuantidadesDevolucao(quantidadesIniciais);

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
    const cleaned = identificador.replace(/\D/g, "");

    if (cleaned.length > 11) {
      // Formata como CNPJ: 00.000.000/0000-00
      return cleaned.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    } else {
      // Formata como CPF: 000.000.000-00
      return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
  }

  // Funções para manipular quantidades de devolução
  const aumentarQuantidade = (codigoProduto: string) => {
    const produto = produtos.find((p) => p.codigo === codigoProduto);
    if (produto) {
      const quantidadeAtual = quantidadesDevolucao[codigoProduto] || 0;
      const quantidadeMaxima = Number(produto.quantidade);
      if (quantidadeAtual < quantidadeMaxima) {
        setQuantidadesDevolucao((prev) => ({
          ...prev,
          [codigoProduto]: quantidadeAtual + 1,
        }));
      }
    }
  };

  const diminuirQuantidade = (codigoProduto: string) => {
    const quantidadeAtual = quantidadesDevolucao[codigoProduto] || 0;
    if (quantidadeAtual > 0) {
      setQuantidadesDevolucao((prev) => ({
        ...prev,
        [codigoProduto]: quantidadeAtual - 1,
      }));
    }
  };

  const alterarQuantidadeInput = (codigoProduto: string, valor: string) => {
    const produto = produtos.find((p) => p.codigo === codigoProduto);
    if (produto) {
      const novaQuantidade = Math.max(
        0,
        Math.min(Number(valor) || 0, Number(produto.quantidade))
      );
      setQuantidadesDevolucao((prev) => ({
        ...prev,
        [codigoProduto]: novaQuantidade,
      }));
    }
  };

  const devolverTudo = (codigoProduto: string) => {
    const produto = produtos.find((p) => p.codigo === codigoProduto);
    if (produto) {
      setQuantidadesDevolucao((prev) => ({
        ...prev,
        [codigoProduto]: Number(produto.quantidade),
      }));
    }
  };

  const alternarSelecaoTodos = () => {
    if (todosSelecionados) {
      // Desselecionar todos - zerar quantidades
      const quantidadesZeradas: Record<string, number> = {};
      produtos.forEach((produto) => {
        quantidadesZeradas[produto.codigo] = 0;
      });
      setQuantidadesDevolucao(quantidadesZeradas);
    } else {
      // Selecionar todos - quantidade máxima
      const novasQuantidades: Record<string, number> = {};
      produtos.forEach((produto) => {
        novasQuantidades[produto.codigo] = Number(produto.quantidade);
      });
      setQuantidadesDevolucao(novasQuantidades);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit chamado com os dados:", data); // Debug
    try {
      const formData = new FormData();

      // Usar dados do formulário ou valores dos estados se disponíveis
      formData.append("nome", data.nome || nomeClient);
      formData.append("filial", data.filial || codigoFilial);
      formData.append("numero_nf", data.numero_nf || numeroNF);
      formData.append("carga", data.carga || numeroCarga);
      formData.append(
        "nome_cobranca",
        data.nome_cobranca || nomeCodigoCobranca
      );
      formData.append(
        "cod_cobranca",
        data.cod_cobranca || numeroCodigoCobranca
      );
      formData.append("rca", data.rca || codigoRca);
      formData.append("cgent", data.cgent || identificador);
      formData.append(
        "motivo_devolucao",
        data.motivo_devolucao || "Devolução solicitada"
      );
      formData.append("tipo_devolucao", data.tipo_devolucao || tipoDevolucao);
      formData.append("cod_cliente", data.cod_cliente || numeroCodigoCliente);

      // Adicionar dados dos produtos
      formData.append("produtos", JSON.stringify(produtos));
      formData.append(
        "quantidadesDevolucao",
        JSON.stringify(quantidadesDevolucao)
      );

      // Adicionar arquivo da nota fiscal se existir
      if (arquivoNF) {
        formData.append("arquivo_nf", arquivoNF);
      }

      console.log("Dados sendo enviados:", {
        nome: formData.get("nome"),
        filial: formData.get("filial"),
        numero_nf: formData.get("numero_nf"),
        produtos: formData.get("produtos"),
        quantidadesDevolucao: formData.get("quantidadesDevolucao"),
      });

      const response = await fetch("/api/registerSolicitacao", {
        method: "POST",
        body: formData,
        headers: {
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      });

      console.log("Resposta do servidor:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", errorText);
        throw new Error(`Erro ao criar registro: ${response.status}`);
      }

      const result = await response.json();
      console.log("Registro realizado com sucesso:", result);

      // Salvar mensagem do toast no localStorage antes do reload
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "solicitacao-toast-message",
          `Solicitação criada com sucesso! ${result.totalProdutosNota} produtos da nota salvos, ${result.produtosParaDevolucao} selecionados para devolução.`
        );
        localStorage.setItem("solicitacao-toast-type", "success");
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar registro:", error);
      setToast({
        message: `Erro ao criar solicitação: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        type: "error",
      });
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
              <h1 className="text-3xl font-bold text-white">
                Nova Solicitação de Devolução
              </h1>
              <p className="text-slate-400">
                Crie uma nova solicitação de devolução de produtos
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/10 ${
                statusCobranca1 === "display"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-700 text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => {
                setstatusCobranca1("display");
                setstatusCobranca2("hidden");
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  statusCobranca1 === "display"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-600 text-slate-400"
                }`}
              >
                1
              </div>
              <span className="font-medium">Informações da NF</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/10 ${
                statusCobranca2 === "display"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-700 text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => {
                // Só permite avançar se tiver NF válida
                if (numeroNF && numeroNF.length === 6) {
                  avancarPagina();
                }
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  statusCobranca2 === "display"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-600 text-slate-400"
                }`}
              >
                2
              </div>
              <span className="font-medium">Seleção de Produtos</span>
            </div>
          </div>
        </div>

        {/* Etapa 1: Informações da NF */}
        {statusCobranca1 === "display" && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <CardHeader className="flex flex-col w-full p-0 justify-start">
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
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="numero_nf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">
                                Número da Nota Fiscal
                              </FormLabel>
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
                            <label className="text-sm font-medium text-slate-300">
                              Nome do Cliente
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {nomeClient || "CLIENTE NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">
                              Código do Cliente
                            </label>
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
                            <label className="text-sm font-medium text-slate-300">
                              Número da Carga
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {numeroCarga || "CARGA NÃO ENCONTRADA"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">
                              Código RCA
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {codigoRca || "RCA NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">
                              Código Filial
                            </label>
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
                            <label className="text-sm font-medium text-slate-300">
                              Código da Cobrança
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {numeroCodigoCobranca ||
                                  "CÓDIGO NÃO ENCONTRADO"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">
                              Nome da Cobrança
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {nomeCodigoCobranca ||
                                  "COBRANÇA NÃO ENCONTRADA"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300">
                              Identificador da Cobrança
                            </label>
                            <div className="mt-1 p-3 bg-slate-600 rounded-lg border border-slate-500">
                              <span className="text-white">
                                {checkIdentificador(identificador) ||
                                  "IDENTIFICADOR NÃO ENCONTRADO"}
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
                              <FormLabel className="text-slate-300">
                                Motivo da Devolução
                              </FormLabel>
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

                    {/* Upload da Nota Fiscal */}
                    <div className="mt-6">
                      <FileUploadNF
                        onFileChange={(file) => setArquivoNF(file)}
                        onValidationChange={(isValid) => {
                          // Opcional: você pode usar esta validação se quiser
                          console.log("Arquivo NF válido:", isValid);
                        }}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={avancarPagina}
                        disabled={!isButtonEnabled()}
                        className={`px-8 ${
                          !isButtonEnabled()
                            ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        }`}
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
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 cursor-pointer hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Badge
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                NF: {numeroNF}
              </Badge>
              <Badge
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
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
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                    tipoDevolucao === "total"
                      ? "bg-green-500/20 border-green-500/30"
                      : tipoDevolucao === "parcial"
                      ? "bg-orange-500/20 border-orange-500/30"
                      : "bg-slate-700/50 border-slate-600"
                  }`}
                >
                  {tipoDevolucao === "total" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <div>
                        <span className="text-white font-medium">
                          Devolução Total
                        </span>
                        <p className="text-sm text-slate-400 mt-1">
                          Todos os produtos foram selecionados para devolução
                        </p>
                      </div>
                    </>
                  ) : tipoDevolucao === "parcial" ? (
                    <>
                      <XCircle className="h-5 w-5 text-orange-400" />
                      <div>
                        <span className="text-white font-medium">
                          Devolução Parcial
                        </span>
                        <p className="text-sm text-slate-400 mt-1">
                          Alguns produtos foram selecionados para devolução
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-slate-400" />
                      <div>
                        <span className="text-slate-400 font-medium">
                          Nenhum produto selecionado
                        </span>
                        <p className="text-sm text-slate-500 mt-1">
                          Selecione produtos para determinar o tipo de devolução
                        </p>
                      </div>
                    </>
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
                      Defina as quantidades dos produtos que deseja devolver
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={alternarSelecaoTodos}
                      className={
                        todosSelecionados
                          ? "text-white/90 hover:text-white/60 border-yellow-500/50 hover:bg-yellow-600/50 bg-yellow-500/50"
                          : "text-white/90 hover:text-white/60 border-green-500/50 hover:bg-green-600/50 bg-green-500/50"
                      }
                    >
                      {todosSelecionados ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Desselecionar Tudo
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Selecionar Tudo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300 text-center">
                        Código
                      </TableHead>
                      <TableHead className="text-slate-300">Produto</TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Qtd. Total
                      </TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Qtd. a Devolver
                      </TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Ações
                      </TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Preço Unit.
                      </TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Valor Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(produtos) && produtos.length > 0 ? (
                      produtos.map((p) => {
                        const qtdSelecionada =
                          quantidadesDevolucao[p.codigo] || 0;
                        const qtdTotal = Number(p.quantidade);
                        const isCompleto =
                          qtdSelecionada === qtdTotal && qtdSelecionada > 0;
                        const isParcial =
                          qtdSelecionada > 0 && qtdSelecionada < qtdTotal;
                        const isVazio = qtdSelecionada === 0;

                        return (
                          <TableRow
                            key={p.codigo}
                            className={`border-slate-700 transition-all duration-200 ${
                              isCompleto
                                ? "bg-green-500/10 hover:bg-green-500/20 border-green-500/30"
                                : isParcial
                                ? "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30"
                                : "hover:bg-slate-700/50"
                            }`}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isCompleto && (
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                )}
                                {isParcial && (
                                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                )}
                                {isVazio && (
                                  <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                )}
                                <Badge
                                  variant="outline"
                                  className={`text-slate-300 border-slate-600 ${
                                    isCompleto
                                      ? "border-green-500/50 text-green-300"
                                      : isParcial
                                      ? "border-orange-500/50 text-orange-300"
                                      : ""
                                  }`}
                                >
                                  {p.codigo}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-medium">
                              {p.descricao}
                            </TableCell>
                            <TableCell className="text-center text-slate-300">
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-500/50"
                              >
                                {p.quantidade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => diminuirQuantidade(p.codigo)}
                                  disabled={qtdSelecionada <= 0}
                                  className={`h-8 w-8 p-0 rounded-l-lg transition-all duration-200 rounded-r-none ${
                                    qtdSelecionada <= 0
                                      ? "border-slate-600 bg-slate-700/50 text-slate-500 cursor-not-allowed"
                                      : "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:border-red-400/70 hover:text-red-300 active:scale-95"
                                  }`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min="0"
                                  max={p.quantidade}
                                  value={qtdSelecionada}
                                  onChange={(e) =>
                                    alterarQuantidadeInput(
                                      p.codigo,
                                      e.target.value
                                    )
                                  }
                                  className={`w-16 h-8 text-center rounded-none text-white no-spinner font-medium transition-all duration-200 ${
                                    isCompleto
                                      ? "bg-green-600/20 border-green-500/50 text-green-200 focus:border-green-400/70 focus:bg-green-600/30"
                                      : isParcial
                                      ? "bg-orange-600/20 border-orange-500/50 text-orange-200 focus:border-orange-400/70 focus:bg-orange-600/30"
                                      : "bg-slate-700 border-slate-600 focus:border-blue-500/50 focus:bg-slate-600"
                                  }`}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => aumentarQuantidade(p.codigo)}
                                  disabled={qtdSelecionada >= qtdTotal}
                                  className={`h-8 w-8 p-0 rounded-r-lg transition-all duration-200 rounded-l-none ${
                                    qtdSelecionada >= qtdTotal
                                      ? "border-slate-600 bg-slate-700/50 text-slate-500 cursor-not-allowed"
                                      : "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/25 hover:border-green-400/70 hover:text-green-300 active:scale-95"
                                  }`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex gap-1 justify-center">
                                <div className="group relative">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => devolverTudo(p.codigo)}
                                    disabled={isCompleto}
                                    className={`text-xs transition-all duration-200 ${
                                      isCompleto
                                        ? "bg-green-600/30 text-green-300 border-green-500/50 cursor-not-allowed opacity-50"
                                        : "bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600/40 hover:text-green-300 hover:border-green-400/70"
                                    }`}
                                  >
                                    <SquareCheck className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="group relative">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setQuantidadesDevolucao((prev) => ({
                                        ...prev,
                                        [p.codigo]: 0,
                                      }));
                                    }}
                                    disabled={isVazio}
                                    className={`text-xs transition-all duration-200 ${
                                      isVazio
                                        ? "bg-red-600/30 text-red-300 border-red-500/50 cursor-not-allowed opacity-50"
                                        : "bg-red-600/20 text-red-400 border-red-500/50 hover:bg-red-600/40 hover:text-red-300 hover:border-red-400/70"
                                    }`}
                                  >
                                    <SquareX className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-slate-300">
                              {formatPrice(Number(p.punit))}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`text-xl font-bold transition-colors duration-200 ${
                                  isCompleto
                                    ? "text-green-400"
                                    : isParcial
                                    ? "text-orange-400"
                                    : "text-white"
                                }`}
                              >
                                {formatPrice(Number(p.punit) * qtdSelecionada)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow className="hover:bg-slate-700/50">
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-slate-400"
                        >
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-slate-800 hover:bg-slate-700">
                      <TableCell colSpan={6} className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Calculator className="h-4 w-4 text-slate-400" />
                          <span className="text-white font-bold">
                            Total a Devolver:
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center w-[20%]">
                        <span className="text-xl font-bold text-green-400">
                          {formatPrice(
                            produtos.reduce((acc, p) => {
                              const qtdDevolucao =
                                quantidadesDevolucao[p.codigo] || 0;
                              return acc + Number(p.punit) * qtdDevolucao;
                            }, 0)
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
                disabled={
                  Object.values(quantidadesDevolucao).reduce(
                    (acc, qtd) => acc + qtd,
                    0
                  ) === 0 || !tipoDevolucao
                }
                onClick={async () => {
                  console.log("Botão clicado!");
                  console.log(
                    "Total quantidade devolução:",
                    Object.values(quantidadesDevolucao).reduce(
                      (acc, qtd) => acc + qtd,
                      0
                    )
                  );
                  console.log("tipoDevolucao:", tipoDevolucao);
                  console.log("produtos:", produtos);
                  console.log("quantidadesDevolucao:", quantidadesDevolucao);

                  // Verificar erros do formulário
                  const formErrors = form.formState.errors;
                  console.log("Erros do formulário:", formErrors);
                  console.log("Formulário válido:", form.formState.isValid);

                  // Verificar se o formulário é válido antes de tentar
                  if (!form.formState.isValid) {
                    console.log(
                      "Formulário inválido, executando método alternativo diretamente..."
                    );
                  } else {
                    // Tentar primeiro com o formulário
                    try {
                      console.log("Tentando executar form.handleSubmit...");
                      const result = await form.handleSubmit(onSubmit)();
                      console.log("Resultado do handleSubmit:", result);
                      return; // Se chegou aqui, deu certo
                    } catch (error) {
                      console.log(
                        "Erro no formulário, tentando método alternativo:",
                        error
                      );
                    }
                  }

                  // Método alternativo sem validação do formulário
                  try {
                    console.log("Executando método alternativo...");
                    const formData = new FormData();
                    formData.append("nome", nomeClient);
                    formData.append("filial", codigoFilial);
                    formData.append("numero_nf", numeroNF);
                    formData.append("carga", numeroCarga);
                    formData.append("nome_cobranca", nomeCodigoCobranca);
                    formData.append("cod_cobranca", numeroCodigoCobranca);
                    formData.append("rca", codigoRca);
                    formData.append("cgent", identificador);
                    formData.append(
                      "motivo_devolucao",
                      form.getValues("motivo_devolucao")
                    );
                    formData.append("tipo_devolucao", tipoDevolucao);
                    formData.append("cod_cliente", numeroCodigoCliente);
                    formData.append("produtos", JSON.stringify(produtos));
                    formData.append(
                      "quantidadesDevolucao",
                      JSON.stringify(quantidadesDevolucao)
                    );

                    // Adicionar arquivo da nota fiscal se existir
                    if (arquivoNF) {
                      formData.append("arquivo_nf", arquivoNF);
                    }

                    console.log("Fazendo requisição para API...");
                    const response = await fetch("/api/registerSolicitacao", {
                      method: "POST",
                      body: formData,
                    });

                    console.log(
                      "Resposta da API:",
                      response.status,
                      response.statusText
                    );

                    if (!response.ok) {
                      const errorText = await response.text();
                      console.error("Erro na resposta:", errorText);
                      throw new Error(`Erro ${response.status}: ${errorText}`);
                    }

                    const result = await response.json();
                    console.log("Resultado da API:", result);
                    // Salvar mensagem do toast no localStorage antes do reload
                    if (typeof window !== "undefined") {
                      localStorage.setItem(
                        "solicitacao-toast-message",
                        `Solicitação criada com sucesso! ${result.totalProdutosNota} produtos da nota salvos, ${result.produtosParaDevolucao} selecionados para devolução.`
                      );
                      localStorage.setItem("solicitacao-toast-type", "success");
                    }
                    window.location.reload();
                  } catch (altError) {
                    console.error("Erro no método alternativo:", altError);
                    setToast({
                      message: `Erro ao criar solicitação: ${
                        altError instanceof Error
                          ? altError.message
                          : "Erro desconhecido"
                      }`,
                      type: "error",
                    });
                  }
                }}
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
