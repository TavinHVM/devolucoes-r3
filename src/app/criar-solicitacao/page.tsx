'use client';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Form } from "../../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import Header from '../../components/header';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';

type FormData = {
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  codigo_cobranca: string;
  rca: string;
  motivo_devolucao: string;
  codigo_produto: string;
  codigo_cliente: string;
  tipo_devolucao: string;
};

// Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  return (
    <div className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
      role="alert">
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg leading-none">×</button>
      </div>
    </div>
  );
}

export default function Solicitacao() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const form = useForm<FormData>({
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
    },
  });

  async function onSubmit(data: FormData) {
    setToast(null);
    const dadosParaSalvar = data;
    const { error } = await supabase.from('solicitacoes').insert([dadosParaSalvar]);
    if (error) {
      setToast({ message: 'Erro ao salvar solicitação: ' + error.message, type: 'error' });
    } else {
      setToast({ message: 'Solicitação criada com sucesso!', type: 'success' });
      form.reset();
    }
  }

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-full min-h-screen w-full bg-gray-900">
        {/* Toast Overlay */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <Card className="w-full max-w-[90%] lg:max-w-[30%] shadow-2xl bg-slate-800 border-none">
          <CardHeader className="bg-slate-800 rounded-t-xl px-8 py-6">
            <CardTitle className="text-center text-2xl font-bold text-white">Criar Solicitação</CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-full px-8 py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome" className="text-white">Nome:</Label>
                  <Controller
                    name="nome"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="nome"
                        {...field}
                        required
                        className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="numero_nf" className="text-white">Nº NF:</Label>
                    <Controller
                      name="numero_nf"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="numero_nf"
                          {...field}
                          required
                          className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="carga" className="text-white">Carga:</Label>
                    <Controller
                      name="carga"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="carga"
                          {...field}
                          className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="codigo_cobranca" className="text-white">Cód. Cobrança:</Label>
                    <Controller
                      name="codigo_cobranca"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="codigo_cobranca"
                          {...field}
                          className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="rca" className="text-white">RCA:</Label>
                    <Controller
                      name="rca"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="rca"
                          {...field}
                          className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo_produto" className="text-white">Código do Produto:</Label>
                  <Controller
                    name="codigo_produto"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="codigo_produto"
                        {...field}
                        className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo_cliente" className="text-white">Código do Cliente:</Label>
                  <Controller
                    name="codigo_cliente"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="codigo_cliente"
                        {...field}
                        className="bg-slate-700 text-white border-slate-600 placeholder:text-white"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="motivo_devolucao" className="text-white">Motivo da Devolução:</Label>
                  <Controller
                    name="motivo_devolucao"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        className="resize-none bg-slate-700 text-white border-slate-600 placeholder:text-white"
                        id="motivo_devolucao"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col lg:flex-row justify-between gap-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="tipo_devolucao" className="text-white">Tipo de Devolução:</Label>
                    <Controller
                      name="tipo_devolucao"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full bg-slate-700 text-white border-slate-600 placeholder:text-white" id="tipo_devolucao">
                            <SelectValue placeholder="Selecione um tipo de Devolução" className="placeholder:text-white" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="total">Total</SelectItem>
                            <SelectItem value="parcial">Parcial</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="filial" className="text-white">Filial:</Label>
                    <Controller
                      name="filial"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full bg-slate-700 text-white border-slate-600 placeholder:text-white" id="filial">
                            <SelectValue placeholder="Selecione a Filial" className="placeholder:text-white" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="filial1">Filial 1</SelectItem>
                            <SelectItem value="filial5">Filial 5</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer">
                  Criar Solicitação
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}