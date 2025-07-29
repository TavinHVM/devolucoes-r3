"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
// import { useRouter } from "next/navigation";
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

type CodigoCobranca = {
  id: number;
  codigo: string;
  nome: string;
};

export default function CodCobranca() {
  const [codCobrancaList, setCodCobrancaList] = useState<CodigoCobranca[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [codigoCobranca, setCodigoCobranca] = useState<string>("");
  const [nomeCobranca, setNomeCobranca] = useState<string>("");

  useEffect(() => {
    const fetchCodCobranca = async () => {
      try {

        const response = await fetch('/api/getCodCobranca', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
          // cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar os Códigos de cobrança.');
        }
        const data = await response.json();
        setCodCobrancaList(data);
      } catch (error) {
        console.error('Erro ao buscar os Códigos de cobrança:', error);
      }
    }

    fetchCodCobranca();
  }, []);

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
                    <div className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer px-4 py-2 rounded-md transition-all">
                      <span>Cadastrar Código de Cobrança</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <Card className="bg-slate-600 p-6">
                      <DialogTitle></DialogTitle>
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
            <CardContent className="max-h-[400px] h-[400px] overflow-y-auto scrollbar-dark">
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
                <TableBody className="max-h-[400px] h-[400px] overflow-y-auto scrollbar-dark">
                  {codCobrancaList.map((cod) => (
                    <TableRow
                      key={cod.codigo}
                      className="w-full bg-slate-600"
                    >
                      <TableCell className="text-center w-[25%] text-md text-white">
                        {cod.codigo}
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
