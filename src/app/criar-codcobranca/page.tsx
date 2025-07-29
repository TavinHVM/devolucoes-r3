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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState<CodigoCobranca | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchCodCobranca = async () => {
    try {
      const response = await fetch('/api/codigos-cobranca', {
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
  };

  useEffect(() => {
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

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      codigo_cobranca: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("onSubmit chamado com os dados:", data);
    try {
      const response = await fetch("/api/codigos-cobranca/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          codigo: data.codigo_cobranca,
          nome: data.nome
        }),
        cache: "no-store",
      });

      console.log("Resposta do servidor:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar código de cobrança.");
      }

      const result = await response.json();
      console.log("Código de cobrança criado com sucesso:", result);
      
      // Mostrar toast de sucesso
      setToast({ message: 'Código de cobrança criado com sucesso!', type: 'success' });
      
      // Limpar formulário
      form.reset();
      
      // Fechar modal
      setIsDialogOpen(false);
      
      // Recarregar lista
      fetchCodCobranca();
    } catch (error) {
      console.error("Erro ao criar código de cobrança:", error);
      setToast({ message: error instanceof Error ? error.message : 'Erro ao criar código de cobrança.', type: 'error' });
    }
  }

  const handleRowClick = (codigo: CodigoCobranca) => {
    setSelectedCodigo(codigo);
    editForm.setValue("nome", codigo.nome);
    editForm.setValue("codigo_cobranca", codigo.codigo);
    setIsEditDialogOpen(true);
  };

  async function onEditSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedCodigo) return;
    
    try {
      const response = await fetch("/api/codigos-cobranca/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          id: selectedCodigo.id,
          codigo: data.codigo_cobranca,
          nome: data.nome
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao editar código de cobrança.");
      }

      setToast({ message: 'Código de cobrança editado com sucesso!', type: 'success' });
      setIsEditDialogOpen(false);
      setSelectedCodigo(null);
      fetchCodCobranca();
    } catch (error) {
      console.error("Erro ao editar código de cobrança:", error);
      setToast({ message: error instanceof Error ? error.message : 'Erro ao editar código de cobrança.', type: 'error' });
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  async function handleDeleteConfirm() {
    if (!selectedCodigo) return;
    
    try {
      const response = await fetch("/api/codigos-cobranca/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedCodigo.id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir código de cobrança');
      }

      setToast({ message: 'Código de cobrança excluído com sucesso!', type: 'success' });
      setIsDeleteDialogOpen(false);
      setSelectedCodigo(null);
      fetchCodCobranca();
    } catch (error) {
      console.error("Erro ao excluir código de cobrança:", error);
      setToast({ message: 'Erro ao excluir código de cobrança.', type: 'error' });
    }
  }

  return (
    <>
      {/* Toast Overlay */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Header />
        <Card className="bg-slate-700 max-w-[60%] w-full my-auto">
          <CardHeader>
            <CardTitle>
              <div className="flex max-w-full justify-between items-center">
                <span className="text-white font-bold text-2xl">
                  Códigos de Cobrança
                </span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                      onChange={(e) => {
                                        const text = e.target.value.toUpperCase();
                                        field.onChange(text);
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
                                      maxLength={4}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                          field.onChange(val);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer"
                          >
                            Cadastrar Código
                          </Button>
                        </form>
                      </Form>
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
                      className="w-full bg-slate-600 hover:bg-slate-500 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(cod)}
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

        {/* Modal de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <Card className="bg-slate-600 p-6">
              <DialogTitle className="text-white font-bold">
                Editar Código de Cobrança
              </DialogTitle>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(onEditSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={editForm.control}
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
                              onChange={(e) => {
                                const text = e.target.value.toUpperCase();
                                field.onChange(text);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
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
                              maxLength={4}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                  field.onChange(val);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                    >
                      Salvar Alterações
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDeleteClick}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                    >
                      Excluir
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <Card className="bg-slate-600 p-6">
              <DialogTitle className="text-white font-bold">
                Confirmar Exclusão
              </DialogTitle>
              <div className="py-4">
                <p className="text-white">
                  Tem certeza que deseja excluir o código de cobrança "{selectedCodigo?.codigo}" - "{selectedCodigo?.nome}"?
                </p>
                <p className="text-red-400 text-sm mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
