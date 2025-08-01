"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
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
import { Undo2 } from "lucide-react";
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
  nome: z.string().min(1, { message: "" }).max(14, { message: "" }),
  filial: z.string().min(1, { message: "" }),
  numero_nf: z.string().min(1, { message: "" }),
  carga: z.string().min(1, { message: "" }),
  codigo_cobranca: z.string().min(1, { message: "" }),
  rca: z.string().min(1, { message: "" }),
  motivo_devolucao: z.string().min(1, { message: "" }),
  codigo_produto: z.string().min(1, { message: "" }),
  codigo_cliente: z.string().min(1, { message: "" }),
  tipo_devolucao: z.string().min(1, { message: "" }),
  lista_produtos: z.string().min(1, { message: "" }),
  quantidade: z.string().min(1, { message: "" }),
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
      codigo_produto: "",
      codigo_cliente: "",
      tipo_devolucao: "",
      quantidade: "",
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

  // Função nova para salvar no banco, adptar ela em relação à antiga

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit chamado com os dados:", data); // Debug
    try {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("filial", data.filial);
      formData.append("codigo_cliente", data.codigo_cliente);
      formData.append("codigo_cobranca", data.codigo_cobranca);
      formData.append("codigo_produto", data.codigo_produto);
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
    <>
      <Header />
      <div className="flex items-center justify-center h-[90%] w-full bg-slate-900 0-0">
        {/* Toast Overlay */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <Card
          className={`w-full max-w-[90%] lg:max-w-[50%] shadow-2xl bg-slate-800 rounded-lg p-8 gap-0 max-h-full ${statusCobranca2} relative`}
        >
          <Button
            type="button"
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-bold cursor-pointer absolute left-4 top-[0]"
            onClick={() => {
              voltarPagina();
            }}
          >
            <Undo2 />
            Voltar
          </Button>
          <CardHeader className="relative">
            <CardTitle className="text-center text-2xl font-bold text-white p-12">
              Continuar Solicitação
            </CardTitle>
            <div className="flex flex-col py-2 absolute right-2 top-6 gap-1">
                <label className="text-white mb-2">Tipo de Devolução:</label>
                <Select
                  value={tipoDevolucao}
                  onValueChange={(value) => setTipoDevolucao(value)}
                >
                  <SelectTrigger
                    className="text-white border-slate-600 bg-slate-700
                            border rounded-md placeholder:text-white/40"
                  >
                    <SelectValue placeholder="Selecione o tipo de Devolução" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem
                      value="total"
                      className="bg-slate-700 text-white data-[state=checked]:bg-slate-600 hover:!bg-slate-600 hover:!text-white focus:bg-slate-600 focus:text-white"
                    >
                      Total
                    </SelectItem>
                    <SelectItem
                      value="parcial"
                      className="bg-slate-700 text-white data-[state=checked]:bg-slate-600 hover:!bg-slate-600 hover:!text-white focus:bg-slate-600 focus:text-white"
                    >
                      Parcial
                    </SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Card className="bg-slate-600 text-white col-span-3 max-h-80 flex flex-col gap-0 p-0 relative">
            <div className="mb-4 absolute left-2 top-2">
              <Button
                type="button"
                variant="outline"
                className="text-white hover:text-white shadow-none border-slate-500 border-2 hover:bg-slate-800 bg-slate-700 cursor-pointer"
                onClick={() => {
                  if (produtosSelecionados.size === produtos.length) {
                    setProdutosSelecionados(new Set());
                  } else {
                    setProdutosSelecionados(
                      new Set(produtos.map((p) => p.codigo))
                    );
                  }
                }}
              >
                {produtosSelecionados.size === produtos.length
                  ? "Desselecionar Todos"
                  : "Selecionar Todos"}
              </Button>
            </div>
              <CardHeader className="text-center font-bold text-xl py-2">
                PRODUTOS
              </CardHeader>
              <CardContent className="w-full p-0">
                <Table className="bg-slate-700">
                  <TableHeader>
                    <TableRow className="bg-slate-800">
                      <TableHead className="text-white font-bold">
                        Selecionar
                      </TableHead>
                      <TableHead className="text-white font-bold">
                        Código Produto
                      </TableHead>
                      <TableHead className="text-white font-bold">
                        Nome
                      </TableHead>
                      <TableHead className="text-white font-bold">
                        Quantidade
                      </TableHead>
                      <TableHead className="text-white font-bold">
                        Preço Unitário
                      </TableHead>
                      <TableHead className="text-white font-bold">
                        Valor Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(produtos) && produtos.length > 0 ? (
                      produtos.map(
                        (p: {
                          codigo: string;
                          descricao: string;
                          quantidade: string;
                          punit: string;
                        }) => (
                          <TableRow
                            key={p.codigo}
                            className="border-b border-slate-400"
                          >
                            <TableCell className="text-center text-white">
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={produtosSelecionados.has(p.codigo)}
                                  onCheckedChange={(checked) => {
                                    const newSelecionados = new Set(
                                      produtosSelecionados
                                    );
                                    if (checked) {
                                      newSelecionados.add(p.codigo);
                                    } else {
                                      newSelecionados.delete(p.codigo);
                                    }
                                    setProdutosSelecionados(newSelecionados);
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-white">
                              {p.codigo}
                            </TableCell>
                            <TableCell className="text-white">
                              {p.descricao}
                            </TableCell>
                            <TableCell className="text-center text-white">
                              {p.quantidade}
                            </TableCell>
                            <TableCell className="text-center text-white">
                              {formatPrice(Number(p.punit))}
                            </TableCell>
                            <TableCell className="text-center text-white">
                              {formatPrice(
                                Number(p.punit) * Number(p.quantidade)
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-white py-4"
                        >
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="w-full justify-start text-center text-white py-4"
                      >
                        <div className="flex justify-start">
                          <span className="text-white font-bold text-start text-xl pl-10">
                            Total:{" "}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        className="text-center text-white py-4"
                      >
                        <span className="text-white text-xl pr-10">
                          {formatPrice(
                            produtos
                              .filter((p) => produtosSelecionados.has(p.codigo))
                              .reduce(
                                (acc, p) =>
                                  acc + Number(p.punit) * Number(p.quantidade),
                                0
                              )
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card
          className={`w-full max-w-[90%] lg:max-w-[30%] shadow-2xl bg-slate-800 rounded-lg p-0 gap-0 max-h-full ${statusCobranca1}`}
        >
          <CardHeader className="px-8 py-4 m-0 flex items-center justify-center">
            <CardTitle className="text-center text-2xl font-bold text-white">
              Criar Solicitação
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-full px-8 py-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="numero_nf"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-white">NºNF:</FormLabel>
                          <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                            <Input
                              type="text"
                              {...field}
                              className="w-full"
                              placeholder="Número da Nota"
                              value={numeroNF}
                              maxLength={6}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                  setNumeroNF(val);
                                  field.onChange(val); // sincroniza com react-hook-form
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full text-white text-sm col-span-2">
                    <span className="font-bold">Nome do Cliente:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {nomeClient ? nomeClient : "CLIENTE NÃO ENCONTRADO"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Código do Cliente:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {numeroCodigoCliente
                        ? numeroCodigoCliente
                        : "CLIENTE NÃO ENCONTRADO"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Número da Carga:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {numeroCarga ? numeroCarga : "CARGA NÃO ENCONTRADA"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Código da Cobrança:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {numeroCodigoCobranca
                        ? numeroCodigoCobranca
                        : "COBRANÇA NÃO ENCONTRADA"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Nome da Cobrança:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {nomeCodigoCobranca
                        ? nomeCodigoCobranca
                        : "COBRANÇA NÃO ENCONTRADA"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Código RCA:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {codigoRca ? codigoRca : "RCA NÃO ENCONTRADA"}
                    </span>
                  </div>
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Código Filial:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {codigoFilial ? codigoFilial : "COBRANÇA NÃO ENCONTRADA"}
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="motivo_devolucao"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-white">
                        Motivo da Devolução:
                      </FormLabel>
                      <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                        <Textarea
                          {...field}
                          className="w-full resize-none scrollbar-dark"
                          placeholder="Digite o motivo da Devolução:"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lista de produtos adicionados */}
                {produtos.length > 0 && (
                  <div className="w-full mt-4">
                    <Table className="bg-slate-700">
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-bold text-white">
                            Código
                          </TableCell>
                          <TableCell className="font-bold text-white">
                            Nome
                          </TableCell>
                          <TableCell className="font-bold text-white">
                            Quantidade
                          </TableCell>
                        </TableRow>
                        {produtos.map((p, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-white">
                              {p.codigo}
                            </TableCell>
                            <TableCell className="text-white">
                              {p.descricao}
                            </TableCell>
                            <TableCell className="text-white">
                              {p.quantidade}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button
                  type="button"
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer"
                  onClick={() => {
                    avancarPagina();
                  }}
                >
                  Avançar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
