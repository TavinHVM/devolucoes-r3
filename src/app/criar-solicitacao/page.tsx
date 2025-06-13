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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-[90%] lg:max-w-[30%] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Criar Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome:</Label>
                <Input id="nome" {...form.register("nome")} required />
              </div>
              
              {/* numeros */}
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numero_nf">Nº NF:</Label>
                  <Input id="numero_nf" {...form.register("numero_nf")} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="carga">Carga:</Label>
                  <Input id="carga" {...form.register("carga")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo_cobranca">Cód. Cobrança:</Label>
                  <Input id="codigo_cobranca" {...form.register("codigo_cobranca")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rca">RCA:</Label>
                  <Input id="rca" {...form.register("rca")} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="codigo_produto">Código do Produto:</Label>
                <Input id="codigo_produto" {...form.register("codigo_produto")} />
              </div>              
              <div className="flex flex-col gap-2">
                <Label htmlFor="motivo_devolucao">Motivo da Devolução:</Label>
                <Textarea className="resize-none" id="motivo_devolucao" {...form.register("motivo_devolucao")} />
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-2">
                <div className="flex flex-col gap-2 max-w-full lg:max-w-1/2">
                  <Label htmlFor="tipo_devolucao">Tipo de Devolução:</Label>
                  <Select onValueChange={value => form.setValue("tipo_devolucao", value)}>
                    <SelectTrigger className="w-full" id="tipo_devolucao">
                      <SelectValue placeholder="Selecione um tipo de Devolução" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="filial">Filial:</Label>
                  <Select onValueChange={value => form.setValue("filial", value)}>
                    <SelectTrigger className="w-full"id="filial">
                      <SelectValue placeholder="Selecione a Filial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Matriz</SelectItem>
                      <SelectItem value="filial1">Filial 1</SelectItem>
                      <SelectItem value="filial2">Filial 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="arquivo">Anexar Arquivo:</Label>
                <Input 
                  id="arquivo" 
                  type="file" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("arquivo", file as unknown as undefined);
                    }
                  }} 
                />
              </div>
              <Button type="submit" className="w-full mt-4">Criar Solicitação</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 