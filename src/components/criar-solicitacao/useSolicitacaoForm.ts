import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  const [isSearchingNF, setIsSearchingNF] = useState<boolean>(false);
  const [nfExists, setNfExists] = useState<boolean>(false);
  const [solicitacoesExistentes, setSolicitacoesExistentes] = useState<{
    id: number;
    numero_nf: string;
    status: string;
    created_at: string;
    nome: string;
    cod_cliente: string;
  }[]>([]);
  
  // Product filtering and sorting states
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [productSortBy, setProductSortBy] = useState<string>("codigo-asc");
  const [productSortColumns, setProductSortColumns] = useState<{
    column: string;
    direction: "asc" | "desc";
  }[]>([]);

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = produtos.filter(produto => 
      produto.codigo.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(productSearchTerm.toLowerCase())
    );

    // Apply sorting from productSortBy (from dropdown)
    if (productSortBy && productSortBy !== "selecionados") {
      const [field, direction] = productSortBy.split("-") as [string, "asc" | "desc"];
      filtered = filtered.sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";

        switch (field) {
          case "codigo":
            aVal = a.codigo;
            bVal = b.codigo;
            break;
          case "descricao":
            aVal = a.descricao;
            bVal = b.descricao;
            break;
          case "quantidade":
            aVal = Number(a.quantidade);
            bVal = Number(b.quantidade);
            break;
          case "preco":
            aVal = Number(a.punit);
            bVal = Number(b.punit);
            break;
          default:
            return 0;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return direction === "asc" 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        } else {
          return direction === "asc" 
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
        }
      });
    } else if (productSortBy === "selecionados") {
      // Sort by selected items first
      filtered = filtered.sort((a, b) => {
        const qtdA = quantidadesDevolucao[a.codigo] || 0;
        const qtdB = quantidadesDevolucao[b.codigo] || 0;
        if (qtdA > 0 && qtdB === 0) return -1;
        if (qtdB > 0 && qtdA === 0) return 1;
        return a.codigo.localeCompare(b.codigo);
      });
    }

    // Apply additional sorting from table headers (productSortColumns)
    if (productSortColumns.length > 0) {
      filtered = filtered.sort((a, b) => {
        for (const sort of productSortColumns) {
          let aVal: string | number = "";
          let bVal: string | number = "";

          switch (sort.column) {
            case "codigo":
              aVal = a.codigo;
              bVal = b.codigo;
              break;
            case "descricao":
              aVal = a.descricao;
              bVal = b.descricao;
              break;
            case "quantidade":
              aVal = Number(a.quantidade);
              bVal = Number(b.quantidade);
              break;
            case "punit":
              aVal = Number(a.punit);
              bVal = Number(b.punit);
              break;
            default:
              continue;
          }

          let comparison = 0;
          if (typeof aVal === "string" && typeof bVal === "string") {
            comparison = aVal.localeCompare(bVal);
          } else {
            comparison = (aVal as number) - (bVal as number);
          }

          if (comparison !== 0) {
            return sort.direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [produtos, productSearchTerm, productSortBy, productSortColumns, quantidadesDevolucao]);

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

  // Buscar informações da nota fiscal manualmente
  const searchNF = async () => {
    if (!numeroNF || numeroNF.length < 4) {
      toast.error("Digite pelo menos 4 dígitos da nota fiscal");
      return;
    }

    setIsSearchingNF(true);
    
    try {
      // Primeiro verificar se já existe solicitação com esta NF
      const existingResponse = await fetch(`/api/checkSolicitacao/${numeroNF}`);
      if (existingResponse.ok) {
        const checkResult = await existingResponse.json();
        if (checkResult.existe && checkResult.total > 0) {
          setNfExists(true);
          setSolicitacoesExistentes(checkResult.solicitacoes || []);
          toast.error(`Esta nota fiscal já possui ${checkResult.total} solicitação(ões) de devolução`);
          setIsSearchingNF(false);
          return;
        }
      }

      // Buscar informações da NF
      const infos_nota = await fetchInfosNF(numeroNF);
      if (infos_nota) {
        setNfExists(false);
        setNomeClient(infos_nota.cliente);
        setNumeroCodigoCliente(infos_nota.codcli.toString());
        setCodigoRca(infos_nota.codusur.toString());
        setNumeroCodigoCobranca(infos_nota.codcob);
        setNumeroCarga(infos_nota.numcar.toString());
        setNomeCodigoCobranca(infos_nota.cobranca);
        setCodigoFilial(infos_nota.codfilial);
        setIdentificador(infos_nota.cgcent);
        
        toast.success("Informações da nota fiscal carregadas com sucesso!");
      } else {
        toast.error("Nota fiscal não encontrada no sistema");
        // Limpar campos se NF não encontrada
        setNomeClient("");
        setNumeroCodigoCliente("");
        setCodigoRca("");
        setNumeroCodigoCobranca("");
        setNumeroCarga("");
        setNomeCodigoCobranca("");
        setCodigoFilial("");
        setIdentificador("");
      }
    } catch (error) {
      console.error("Erro ao buscar informações da NF:", error);
      toast.error("Erro ao buscar informações da nota fiscal");
    } finally {
      setIsSearchingNF(false);
    }
  };

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

  const dismissWarning = () => {
    setNfExists(false);
    setSolicitacoesExistentes([]);
  };

  // Watch the motivo_devolucao field for changes
  const motivoDevolucao = useWatch({
    control: form.control,
    name: "motivo_devolucao",
  });

  // Compute button enabled state reactively
  const isButtonEnabled = useMemo((): boolean => {
    return !!(
      numeroNF &&
      numeroNF.length === 6 &&
      motivoDevolucao &&
      motivoDevolucao.trim() !== "" &&
      arquivoNF
    );
  }, [numeroNF, motivoDevolucao, arquivoNF]);

  const avancarPagina = async () => {
    if (!motivoDevolucao || motivoDevolucao.trim() === "") {
      toast.error("Por favor, preencha o motivo da devolução antes de continuar.");
      return;
    }

    if (!arquivoNF) {
      toast.error("Por favor, selecione o arquivo da nota fiscal antes de continuar.");
      return;
    }

    // Verificar se NF existe antes de continuar
    if (nfExists) {
      toast.error("Não é possível criar solicitação para uma nota fiscal que já possui solicitações");
      return;
    }

    if (!nomeClient) {
      toast.error("É necessário buscar as informações da nota fiscal antes de continuar");
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
        toast.error("Erro ao buscar produtos da nota fiscal");
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
      formData.append("motivo_devolucao", motivoDevolucao || "");
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

  // Product sorting handlers
  const handleProductSort = (column: string, direction: "asc" | "desc") => {
    setProductSortColumns([{ column, direction }]);
  };

  const handleProductClearSort = (column: string) => {
    setProductSortColumns(prev => prev.filter(s => s.column !== column));
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
    isSearchingNF,
    nfExists,
    solicitacoesExistentes,

    // Product filtering and sorting states
    productSearchTerm,
    setProductSearchTerm,
    productSortBy,
    setProductSortBy,
    productSortColumns,
    filteredAndSortedProducts,

    // Funções
    searchNF,
    dismissWarning,
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
    handleProductSort,
    handleProductClearSort,
  };
}

