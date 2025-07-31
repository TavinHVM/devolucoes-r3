"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState, useEffect } from "react";

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

export default function Solicitacao() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [codigo, setCodigo] = useState<string>("");
  const [codigoRca, setCodigoRca] = useState<string>("");
  const [numeroNota, setNumeroNota] = useState<string>("");
  const [nomeProd, setNomeProd] = useState<string>("");
  const [nomeClient, setNomeClient] = useState<string>("");
  const [numeroQuantidade, setNumeroQuantidade] = useState<string>("");
  const [numeroCarga, setNumeroCarga] = useState<string>("");
  const [numeroCodigoCobranca, setNumeroCodigoCobranca] = useState<string>("");
  const [numeroCodigoCliente, setNumeroCodigoCliente] = useState<string>("");
  const [produtos, setProdutos] = useState<
    Array<{ codigo: string; descricao: string; quantidade: string }>
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (codigo.length === 4) {
        const nome_produto = await fetchNameProd(codigo);
        console.log("Nome do produto retornado da API:", nome_produto); // Debug
        if (nome_produto && nome_produto.trim() !== "") {
          setNomeProd(nome_produto);
        } else {
          setNomeProd("");
        }
      } else {
        setNomeProd("");
      }
    };
    fetchProduct();
  }, [codigo]);

  useEffect(() => {
    const fetchClient = async () => {
      if (numeroCodigoCliente.length >= 4 && numeroCodigoCliente.length <= 5) {
        const nome_cliente = await fetchNameClient(numeroCodigoCliente);
        setNomeClient(nome_cliente);
      } else {
        setNomeClient("");
      }
    };
    fetchClient();
  }, [numeroCodigoCliente]);

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

  // Função para adicionar produto à lista
  function adicionarProduto() {
    if (codigo && nomeProd && numeroQuantidade) {
      setProdutos((prev) => [
        ...prev,
        { codigo, descricao: nomeProd, quantidade: numeroQuantidade },
      ]);
      setCodigo("");
      setNomeProd("");
      setNumeroQuantidade("");
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
        <Card className="w-full max-w-[90%] lg:max-w-[30%] shadow-2xl bg-slate-800 rounded-lg p-0 gap-0 max-h-full hidden">
          <CardHeader>
            <CardTitle>Continuar Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="bg-slate-600 text-white col-span-3 max-h-80 flex flex-col gap-0 p-0">
              <CardHeader className="text-center font-bold text-xl py-2">
                PRODUTOS
              </CardHeader>
              <CardContent className="w-full p-0">
                <div className="flex min-w-full bg-slate-800">
                  <div className="w-[25%] py-2 text-lg text-center border-r-2 border-white">
                    <span className="text-white font-bold">Código Produto</span>
                  </div>
                  <div className="w-[50%] py-2 text-lg text-center border-l-2 border-r-2 border-white">
                    <span className="text-white font-bold">Nome</span>
                  </div>
                  <div className="w-[25%] py-2 text-lg text-center border-l-2 border-white">
                    <span className="text-white font-bold">Quantidade</span>
                  </div>
                </div>
                {/* Produtos */}
                <Table className="bg-slate-500 max-h-24 h-10">
                    <TableHeader>
                      Continuar Solicitação
                    </TableHeader>
                  <TableBody className="mx-6 px-32">
                    {Array.isArray(produtos) &&
                      produtos.map(
                        (p: {
                          codigo: string;
                          descricao: string;
                          quantidade: string;
                        }) => (
                          <TableRow key={p.codigo} className="px-32 w-full">
                            <TableCell className="text-center w-[25%] text-lg">
                              {p.codigo}
                            </TableCell>
                            <TableCell className="text-lg">
                              {p.descricao}
                            </TableCell>
                            <TableCell className="pl-8 w-[25%] text-center text-lg">
                              {p.quantidade}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full max-w-[90%] lg:max-w-[30%] shadow-2xl bg-slate-800 rounded-lg p-0 gap-0 max-h-full">
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
                  <FormField
                    control={form.control}
                    name="codigo_cliente"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-white">
                          Código do Cliente:
                        </FormLabel>
                        <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                          <Input
                            type="text"
                            {...field}
                            className="w-full"
                            placeholder="Código do Cliente"
                            value={numeroCodigoCliente}
                            maxLength={5}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setNumeroCodigoCliente(val);
                                field.onChange(val); // sincroniza com react-hook-form
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col w-full text-white text-sm">
                    <span className="font-bold">Nome do Cliente:</span>
                    <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                      {nomeClient ? nomeClient : "CLIENTE NÃO ENCONTRADO"}
                    </span>
                  </div>
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
                            value={numeroNota}
                            maxLength={6}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setNumeroNota(val); // atualiza o estado local
                                field.onChange(val); // atualiza o valor do formulário
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carga"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-white">Carga:</FormLabel>
                        <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                          <Input
                            type="text"
                            {...field}
                            className="w-full"
                            placeholder="Número da carga"
                            value={numeroCarga}
                            maxLength={6}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setNumeroCarga(val); // atualiza o estado local
                                field.onChange(val); // atualiza o valor do formulário
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center w-full col-span-2 gap-2">
                    <FormField
                      control={form.control}
                      name="codigo_cobranca"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-white">
                            Cód. Cobrança:
                          </FormLabel>
                          <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                            <Input
                              type="text"
                              {...field}
                              className="w-full"
                              placeholder="Código da cobrança"
                              value={numeroCodigoCobranca}
                              maxLength={4}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                  setNumeroCodigoCobranca(val); // atualiza o estado local
                                  field.onChange(val); // atualiza o valor do formulário
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rca"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-white">RCA:</FormLabel>
                          <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                            <Input
                              type="text"
                              {...field}
                              className="w-full"
                              placeholder="Código do RCA"
                              value={codigoRca}
                              maxLength={3}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                  setCodigoRca(val); // atualiza o estado local
                                  field.onChange(val); // atualiza o valor do formulário
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                <div className="flex max-w-full gap-2 flex-col xl:flex-row">
                  <FormField
                    control={form.control}
                    name="tipo_devolucao"
                    render={({ field }) => (
                      <FormItem
                        className="w-full flex flex-col py-2
                          "
                      >
                        <FormLabel className="text-white">
                          Tipo de Devolução:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger
                              className="text-white w-full border-slate-600 bg-slate-700
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
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="filial"
                    render={({ field }) => (
                      <FormItem
                        className="w-full flex flex-col py-2
                          "
                      >
                        <FormLabel className="text-white">Filial:</FormLabel>
                        <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger
                              className="text-white w-full border-slate-600 bg-slate-700
                                      border rounded-md placeholder:text-white/40
                                      "
                            >
                              <SelectValue
                                className="text-white placeholder:text-white/40"
                                placeholder="Selecione a Filial"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600 text-white">
                              <SelectItem
                                value="filial1"
                                className="bg-slate-700 text-white data-[state=checked]:bg-slate-600 hover:!bg-slate-600 hover:!text-white focus:bg-slate-600 focus:text-white"
                              >
                                Filial 1
                              </SelectItem>
                              <SelectItem
                                value="filial5"
                                className="bg-slate-700 text-white data-[state=checked]:bg-slate-600 hover:!bg-slate-600 hover:!text-white focus:bg-slate-600 focus:text-white"
                              >
                                Filial 5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 max-w-full">
                  <FormField
                    control={form.control}
                    name="codigo_produto"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-white">
                          Código do Produto:
                        </FormLabel>
                        <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                          <Input
                            type="text"
                            {...field}
                            className="w-full"
                            placeholder="Código do Produto"
                            value={codigo}
                            maxLength={4}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setCodigo(val); // atualiza o estado local
                                field.onChange(val); // atualiza o valor do formulário
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-white">
                          Quantidade:
                        </FormLabel>
                        <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                          <Input
                            type="text"
                            {...field}
                            className="w-full"
                            placeholder="Quantidade"
                            value={numeroQuantidade}
                            maxLength={6}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setNumeroQuantidade(val); // atualiza o estado local
                                field.onChange(val); // atualiza o valor do formulário
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end h-full mt-auto">
                    <Button
                      type="button"
                      onClick={adicionarProduto}
                      className="justify-center bg-slate-500 hover:bg-slate-600 text-white font-bold cursor-pointer"
                    >
                      +
                    </Button>
                  </div>
                </div>
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
                <div className="flex flex-col w-full text-white text-sm">
                  <span className="font-bold">Nome do Produto:</span>
                  <span className="w-full border-1 border-slate-600 bg-slate-700 p-2 rounded-md text-white/60">
                    {nomeProd ? nomeProd : "PRODUTO NÃO ENCONTRADO"}
                  </span>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer"
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
