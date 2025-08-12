import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  fetchProdutosNF,
  fetchInfosNF,
  formatProdutos,
  checkIdentificador,
  type ProdutoFormatado,
} from "./utils";

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

export function useSolicitacaoForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [numeroNF, setNumeroNF] = useState<string>("");
  const [codigoRca, setCodigoRca] = useState<string>("");
  const [nomeClient, setNomeClient] = useState<string>("");
  const [numeroCarga, setNumeroCarga] = useState<string>("");
  const [codigoFilial, setCodigoFilial] = useState<string>("");
  const [nomeCodigoCobranca, setNomeCodigoCobranca] = useState<string>("");
  const [numeroCodigoCobranca, setNumeroCodigoCobranca] = useState<string>("");
  const [numeroCodigoCliente, setNumeroCodigoCliente] = useState<string>("");
  const [tipoDevolucao, setTipoDevolucao] = useState<string>("");
  const [identificador, setIdentificador] = useState<string>("");
  const [arquivoNF, setArquivoNF] = useState<File | null>(null);
  const [quantidadesDevolucao, setQuantidadesDevolucao] = useState<
    Record<string, number>
  >({});
  const [todosSelecionados, setTodosSelecionados] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<ProdutoFormatado[]>([]);

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

  // Exibir toast salvo no localStorage após reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toastMsg = localStorage.getItem("solicitacao-toast-message");
      const toastType = localStorage.getItem("solicitacao-toast-type");
      if (toastMsg && toastType) {
        if (toastType === "success") {
          toast.success(toastMsg);
        } else {
          toast.error(toastMsg);
        }
        localStorage.removeItem("solicitacao-toast-message");
        localStorage.removeItem("solicitacao-toast-type");
      }
    }
  }, []);

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

  // Buscar informações da nota fiscal
  useEffect(() => {
    const fetchInfosNota = async () => {
      if (numeroNF.length === 6) {
        console.log("Buscando informações da NF:", numeroNF);
        const infos_nota = await fetchInfosNF(numeroNF);
        console.log("Informações recebidas:", infos_nota);

        if (infos_nota) {
          setNomeClient(infos_nota.cliente);
          setNumeroCodigoCliente(infos_nota.codcli.toString());
          setCodigoRca(infos_nota.codusur.toString());
          setNumeroCodigoCobranca(infos_nota.codcob);
          setNumeroCarga(infos_nota.numcar.toString());
          setNomeCodigoCobranca(infos_nota.cobranca);
          setCodigoFilial(infos_nota.codfilial);
          setIdentificador(infos_nota.cgcent);

          console.log("Estados atualizados:", {
            cliente: infos_nota.cliente,
            codcli: infos_nota.codcli,
            codusur: infos_nota.codusur,
            codcob: infos_nota.codcob,
            numcar: infos_nota.numcar,
            cobranca: infos_nota.cobranca,
            codfilial: infos_nota.codfilial,
            cgcent: infos_nota.cgcent,
          });
        } else {
          console.log("Nenhuma informação encontrada para a NF:", numeroNF);
          setNomeClient("");
          setNumeroCodigoCliente("");
          setCodigoRca("");
          setNumeroCodigoCobranca("");
          setNumeroCarga("");
          setNomeCodigoCobranca("");
          setCodigoFilial("");
          setIdentificador("");
        }
      } else {
        setNomeClient("");
        setNumeroCodigoCliente("");
        setCodigoRca("");
        setNumeroCodigoCobranca("");
        setNumeroCarga("");
        setNomeCodigoCobranca("");
        setCodigoFilial("");
        setIdentificador("");
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

  const isButtonEnabled = (): boolean => {
    const motivoDevolucao = form.getValues("motivo_devolucao");
    return !!(
      numeroNF &&
      numeroNF.length === 6 &&
      motivoDevolucao &&
      motivoDevolucao.trim() !== "" &&
      arquivoNF
    );
  };

  const avancarPagina = async () => {
    const motivoDevolucao = form.getValues("motivo_devolucao");
    if (!motivoDevolucao || motivoDevolucao.trim() === "") {
      setToast({
        message:
          "Por favor, preencha o motivo da devolução antes de continuar.",
        type: "error",
      });
      return;
    }

    if (!arquivoNF) {
      setToast({
        message:
          "Por favor, selecione o arquivo da nota fiscal antes de continuar.",
        type: "error",
      });
      return;
    }

    if (numeroNF) {
      try {
        const produtosNF = await fetchProdutosNF(numeroNF);
        const produtosFormatados = formatProdutos(produtosNF);

        setProdutos(produtosFormatados);

        const quantidadesIniciais: Record<string, number> = {};
        produtosFormatados.forEach((produto) => {
          quantidadesIniciais[produto.codigo] = 0;
        });
        setQuantidadesDevolucao(quantidadesIniciais);
        setCurrentStep(2);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      }
    }
  };

  const voltarPagina = () => {
    setCurrentStep(1);
  };

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
      const quantidadesZeradas: Record<string, number> = {};
      produtos.forEach((produto) => {
        quantidadesZeradas[produto.codigo] = 0;
      });
      setQuantidadesDevolucao(quantidadesZeradas);
    } else {
      const novasQuantidades: Record<string, number> = {};
      produtos.forEach((produto) => {
        novasQuantidades[produto.codigo] = Number(produto.quantidade);
      });
      setQuantidadesDevolucao(novasQuantidades);
    }
  };

  const finalizarSolicitacao = async () => {
    try {
      const formData = new FormData();
      formData.append("nome", nomeClient);
      formData.append("filial", codigoFilial);
      formData.append("numero_nf", numeroNF);
      formData.append("carga", numeroCarga);
      formData.append("nome_cobranca", nomeCodigoCobranca);
      formData.append("cod_cobranca", numeroCodigoCobranca);
      formData.append("rca", codigoRca);
      formData.append("cgent", identificador);
      formData.append("motivo_devolucao", form.getValues("motivo_devolucao"));
      formData.append("tipo_devolucao", tipoDevolucao);
      formData.append("cod_cliente", numeroCodigoCliente);
      formData.append("produtos", JSON.stringify(produtos));
      formData.append(
        "quantidadesDevolucao",
        JSON.stringify(quantidadesDevolucao)
      );

      if (arquivoNF) {
        formData.append("arquivo_nf", arquivoNF);
      }

      const response = await fetch("/api/registerSolicitacao", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        await response.text();
        throw new Error(`Erro ao criar registro: ${response.status}`);
      }

      const result = await response.json();

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
      toast.error(`Erro ao criar solicitação: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`);
    }
  };

  const handleStepChange = (step: 1 | 2) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && numeroNF && numeroNF.length === 6) {
      avancarPagina();
    }
  };

  return {
    // Estados
    currentStep,
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
    arquivoNF,
    setArquivoNF,
    tipoDevolucao,
    produtos,
    quantidadesDevolucao,
    setQuantidadesDevolucao,
    todosSelecionados,
    form,

    // Funções
    checkIdentificador,
    isButtonEnabled,
    avancarPagina,
    voltarPagina,
    aumentarQuantidade,
    diminuirQuantidade,
    alterarQuantidadeInput,
    devolverTudo,
    alternarSelecaoTodos,
    finalizarSolicitacao,
    handleStepChange,
  };
}
function setToast({ message, type }: { message: string; type: string; }) {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
}

