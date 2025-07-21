"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { DialogTrigger } from "@radix-ui/react-dialog";

const formSchema = z.object({
  nome: z.string().min(1, { message: "Nome obrigatório" }),
  codigo_cobranca: z
    .string()
    .min(1, { message: "Código Cobrança obrigatório" }),
});

export default function Usuarios() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [codigoCobranca, setCodigoCobranca] = useState<string>("");
  const [nomeCobranca, setNomeCobranca] = useState<string>("");

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // if (loading) {
  //   return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      codigo_cobranca: "",
    },
  });

  useEffect(() => {
    form.setValue("nome", nomeCobranca);
  }, [nomeCobranca, form]);

  const codCobrancaList: {
    nome: string;
    codigo_cobranca: string;
  }[] = [
    { codigo_cobranca: "1001", nome: "AMAZON" },
    { codigo_cobranca: "1002", nome: "SHOPEE" },
    { codigo_cobranca: "1003", nome: "BOLETO" },
    { codigo_cobranca: "1004", nome: "AMAZON" },
    { codigo_cobranca: "1005", nome: "SHOPEE" },
    { codigo_cobranca: "1006", nome: "BOLETO" },
    { codigo_cobranca: "1007", nome: "AMAZON" },
    { codigo_cobranca: "1008", nome: "SHOPEE" },
    { codigo_cobranca: "1009", nome: "BOLETO" },
    { codigo_cobranca: "1010", nome: "AMAZON" },
    { codigo_cobranca: "1011", nome: "SHOPEE" },
    { codigo_cobranca: "1012", nome: "BOLETO" },
    { codigo_cobranca: "1013", nome: "AMAZON" },
    { codigo_cobranca: "1014", nome: "SHOPEE" },
    { codigo_cobranca: "1015", nome: "BOLETO" },
    { codigo_cobranca: "1016", nome: "AMAZON" },
    { codigo_cobranca: "1017", nome: "SHOPEE" },
    { codigo_cobranca: "1018", nome: "BOLETO" },
    { codigo_cobranca: "1019", nome: "AMAZON" },
    { codigo_cobranca: "1020", nome: "SHOPEE" },
    { codigo_cobranca: "1021", nome: "BOLETO" },
    { codigo_cobranca: "1022", nome: "AMAZON" },
    { codigo_cobranca: "1023", nome: "SHOPEE" },
    { codigo_cobranca: "1024", nome: "BOLETO" },
  ];

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit chamado com os dados:", data); // Debug
    try {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("codigo_cobranca", data.codigo_cobranca);

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
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Header />
        <Card className="bg-slate-700 max-w-[60%] w-full my-auto">
          <CardHeader>
            <CardTitle>
              <div className="flex max-w-full justify-between items-center">
                <span className="text-white font-bold text-2xl">
                  Códigos de Cobrança
                </span>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer"
                    >
                      Cadastrar Código de Cobrança
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card className="bg-slate-600 p-6">
                      <DialogTitle className="text-white font-bold">
                        Cadastrar Código de Cobrança:
                      </DialogTitle>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex flex-col gap-2">
                            <FormField
                              control={form.control}
                              name="nome"
                              render={({ field }) => (
                                <FormItem className="w-full col-span-2 py-4">
                                  <FormLabel className="text-white">
                                    Nome:
                                  </FormLabel>
                                  <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                                    <Input
                                      type="text"
                                      {...field}
                                      className="w-full"
                                      placeholder="Nome da Cobrança"
                                      style={{ textTransform: 'uppercase' }}
                                      value={nomeCobranca}
                                      onChange={(e) => {
                                        const text = e.target.value;
                                        setNomeCobranca(text.toUpperCase());
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="codigo_cobranca"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-white">
                                    Código Cobrança:
                                  </FormLabel>
                                  <FormControl className="bg-slate-700 text-white border-slate-600 placeholder:text-white/40 w-full">
                                    <Input
                                      type="text"
                                      {...field}
                                      className="w-full"
                                      placeholder="Código da Cobrança"
                                      value={codigoCobranca}
                                      maxLength={4}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val))
                                          setCodigoCobranca(val);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                      <Button
                        type="submit"
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer"
                      >
                        Cadastrar Código
                      </Button>
                    </Card>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-white font-bold hover:bg-slate-700">
                    <TableHead className="text-white font-bold w-full flex items-center justify-center">
                      <span className="w-full text-center">Código:</span>
                    </TableHead>
                    <TableHead className="text-white font-bold w-[75%]">
                      <span className="w-full">Nome:</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="max-h-[400px] overflow-y-auto rounded-xl scrollbar-dark">
                  {codCobrancaList.map((cod) => (
                    <TableRow
                      key={cod.codigo_cobranca}
                      className="px-32 w-full bg-slate-600"
                    >
                      <TableCell className="text-center w-[25%] text-md text-white">
                        {cod.codigo_cobranca}
                      </TableCell>
                      <TableCell className="text-md text-white">{cod.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
