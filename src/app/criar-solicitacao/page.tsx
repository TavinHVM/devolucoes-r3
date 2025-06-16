'use client';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Form } from "../../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useForm } from "react-hook-form";

type FormData = {
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  codigo_cobranca: string;
  rca: string;
  motivo_devolucao: string;
  codigo_produto: string;
  tipo_devolucao: string;
  arquivo?: File;
};

export default function Solicitacao() {
  const form = useForm({
    defaultValues: {
      nome: "",
      filial: "",
      numero_nf: "",
      carga: "",
      codigo_cobranca: "",
      rca: "",
      motivo_devolucao: "",
      codigo_produto: "",
      tipo_devolucao: "",
      arquivo: undefined,
    },
  });

  function onSubmit(data: FormData) {
    // Aqui você pode lidar com o envio dos dados
    console.log(data);
  }

  return (
    <div className="flex items-center justify-center h-full min-h-screen w-full bg-gray-900">
      <Card className="w-full max-w-[90%] lg:max-w-[30%] shadow-2xl bg-slate-800 border-none">
        <CardHeader className="bg-gray-800 rounded-t-xl px-8 py-6">
          <CardTitle className="text-center text-2xl font-bold text-white">Criar Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-full px-8 py-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome" className="text-white">Nome:</Label>
                <Input
                  id="nome"
                  {...form.register("nome")}
                  required
                  className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numero_nf" className="text-white">Nº NF:</Label>
                  <Input
                    id="numero_nf"
                    {...form.register("numero_nf")}
                    required
                    className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="carga" className="text-white">Carga:</Label>
                  <Input
                    id="carga"
                    {...form.register("carga")}
                    className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo_cobranca" className="text-white">Cód. Cobrança:</Label>
                  <Input
                    id="codigo_cobranca"
                    {...form.register("codigo_cobranca")}
                    className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rca" className="text-white">RCA:</Label>
                  <Input
                    id="rca"
                    {...form.register("rca")}
                    className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="codigo_produto" className="text-white">Código do Produto:</Label>
                <Input
                  id="codigo_produto"
                  {...form.register("codigo_produto")}
                  className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="motivo_devolucao" className="text-white">Motivo da Devolução:</Label>
                <Textarea
                  className="resize-none bg-slate-700 text-white border-slate-600 placeholder:text-white"
                  id="motivo_devolucao"
                  {...form.register("motivo_devolucao")}
                />
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="tipo_devolucao" className="text-white">Tipo de Devolução:</Label>
                  <Select onValueChange={value => form.setValue("tipo_devolucao", value)}>
                    <SelectTrigger className="w-full bg-slate-700 text-white border-slate-600 placeholder:text-white" id="tipo_devolucao">
                      <SelectValue placeholder="Selecione um tipo de Devolução" className="placeholder:text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="filial" className="text-white">Filial:</Label>
                  <Select onValueChange={value => form.setValue("filial", value)}>
                    <SelectTrigger className="w-full bg-slate-700 text-white border-slate-600 placeholder:text-white" id="filial">
                      <SelectValue placeholder="Selecione a Filial" className="placeholder:text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filial1">Filial 1</SelectItem>
                      <SelectItem value="filial5">Filial 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="arquivo" className="text-white">Anexar Arquivo:</Label>
                <Input
                  id="arquivo"
                  type="file"
                  className="bg-slate-700 text-white border-slate-600 file:bg-slate-700 file:text-white placeholder:text-white"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("arquivo", file as unknown as undefined);
                    }
                  }}
                />
              </div>
              <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer">
                Criar Solicitação
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}