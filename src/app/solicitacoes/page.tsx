<<<<<<< HEAD
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import { getCurrentUserProfile } from '../../lib/getCurrentUserProfile';
=======
"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { truncateText } from "../../lib/truncateText";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import Header from "../../components/header";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import OrderBtn from "@/components/orderBtn";
import { X } from 'lucide-react';
import { DialogClose } from "@radix-ui/react-dialog";
import { RefreshCw } from 'lucide-react';
>>>>>>> main

type Solicitacao = {
  id: number;
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  codigo_cobranca: string;
  codigo_cliente: string;
  rca: string;
  motivo_devolucao: string;
  vale?: string;
  codigo_produto: string;
  tipo_devolucao: string;
  status: string;
  created_at: string;
  arquivo_url?: string;
};

<<<<<<< HEAD
export default function VisualizacaoSolicitacoes() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [tab, setTab] = useState('vendas');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [modalAprovar, setModalAprovar] = useState<{ open: boolean, id?: number }>({ open: false });
  const [modalRecusar, setModalRecusar] = useState<{ open: boolean, id?: number }>({ open: false });
  const [aprovacaoVale, setAprovacaoVale] = useState('');
  const [aprovacaoRecibo, setAprovacaoRecibo] = useState<File | null>(null);
  const [aprovacaoNF, setAprovacaoNF] = useState<File | null>(null);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState<{ open: boolean, solicitacao?: Solicitacao }>({ open: false });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
    getCurrentUserProfile().then(setProfile);
  }, [router]);

  async function fetchSolicitacoes() {
    setRefreshing(true);
    let query = supabase.from('solicitacoes').select('*');
    if (status !== 'Todos') {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Erro ao buscar solicitações:', error);
      setSolicitacoes([]);
    } else {
      setSolicitacoes(data || []);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    if (loading) return;
    fetchSolicitacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, loading]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  }

  const solicitacoesFiltradas = solicitacoes.filter(s =>
    Object.values(s).join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  // Paginação dos dados filtrados
  const totalPages = Math.ceil(solicitacoesFiltradas.length / itemsPerPage);
  const paginatedSolicitacoes = solicitacoesFiltradas.slice(
=======
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: string;
  user_level: string;
}

export default function VisualizacaoSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const [modalAprovar, setModalAprovar] = useState<{
    open: boolean;
    id?: number;
  }>({ open: false });
  const [aprovacaoVale, setAprovacaoVale] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Função para buscar as solicitações
  const fetchSolicitacoes = useCallback(
    async (statusParam = status) => {
      setRefreshing(true);
      let query = supabase.from("solicitacoes").select("*");
      if (statusParam !== "Todos") {
        query = query.eq("status", statusParam);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Erro ao buscar solicitações:", error);
        setSolicitacoes([]);
      } else {
        setSolicitacoes(data || []);
      }
      setRefreshing(false);
    },
    [status]
  );

  // Verifica se o usuário está autenticado
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        fetchSolicitacoes();
      }
    }
    checkAuth();
  }, [router, fetchSolicitacoes]);

  // Ordenação das solicitações
  const sortedSolicitacoes = [...solicitacoes];
  if (sortColumn && sortDirection) {
    sortedSolicitacoes.sort((a, b) => {
      const aValue = a[sortColumn as keyof Solicitacao] ?? "";
      const bValue = b[sortColumn as keyof Solicitacao] ?? "";
      // Ordenação especial para datas
      if (sortColumn === "created_at") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" })
          : bValue.localeCompare(aValue, "pt-BR", { sensitivity: "base" });
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  // Paginação dos dados ordenados
  const totalPages = Math.ceil(sortedSolicitacoes.length / itemsPerPage);
  const paginatedSolicitacoes = sortedSolicitacoes.slice(
>>>>>>> main
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

<<<<<<< HEAD
  async function aprovarSolicitacao(id: number) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Aprovado' }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
    } catch (err: any) {
      alert('Erro ao aprovar solicitação: ' + (err?.message || JSON.stringify(err)));
    }
  }
  async function recusarSolicitacao(id: number, motivo: string) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Rejeitado', motivo_devolucao: motivo }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Rejeitado', motivo_devolucao: motivo } : s));
    } catch (err: any) {
      alert('Erro ao recusar solicitação: ' + (err?.message || JSON.stringify(err)));
    }
  }
  async function reenviarSolicitacao(id: number) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Reenviada' }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Reenviada' } : s));
    } catch (err: any) {
      alert('Erro ao reenviar solicitação: ' + (err?.message || JSON.stringify(err)));
    }
  }
  async function atualizarStatusFinanceiro(id: number, novoStatus: string) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: novoStatus }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: novoStatus } : s));
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + (err?.message || JSON.stringify(err)));
    }
  }
  function baixarAnexo(arquivo_url: string | undefined) {
    if (arquivo_url) {
      window.open(`https://<sua-url-supabase-storage>/${arquivo_url}`, '_blank');
    }
  }

  // Função utilitária para cor do status
  function getStatusClass(status: string) {
    switch (status?.toUpperCase()) {
      case 'APROVADO': return 'bg-green-600 text-white font-bold px-1 py-1 rounded';
      case 'REJEITADO': return 'bg-red-600 text-white font-bold px-1 py-1 rounded';
      case 'PENDENTE': return 'bg-slate-400 text-white font-bold px-1 py-1 rounded';
      case 'REENVIADA': return 'bg-yellow-500 text-white font-bold px-1 py-1 rounded';
      case 'DESDOBRADA': return 'bg-blue-700 text-white font-bold px-1 py-1 rounded';
      case 'ABATIDA': return 'bg-stone-400 text-white font-bold px-1 py-1 rounded';
      case 'FINALIZADA': return 'bg-gray-500 text-white font-bold px-1 py-1 rounded';
      default: return 'bg-slate-700 text-white px-2 py-1 rounded';
=======
  const productsList: {
    codigo_produto: string;
    nome: string;
    quantidade: number;
  }[] = [
    { codigo_produto: "1001", nome: "Chamex - Resma", quantidade: 5 },
    { codigo_produto: "1002", nome: "Caneta Azul", quantidade: 12 },
    { codigo_produto: "1003", nome: "Lápis Preto", quantidade: 20 },
    { codigo_produto: "1004", nome: "Borracha Branca", quantidade: 8 },
    { codigo_produto: "1005", nome: "Caderno 200 folhas", quantidade: 3 },
    { codigo_produto: "1006", nome: "Apontador", quantidade: 15 },
    { codigo_produto: "1007", nome: "Marcador de Texto", quantidade: 7 },
    { codigo_produto: "1008", nome: "Régua 30cm", quantidade: 6 },
    { codigo_produto: "1009", nome: "Cola Branca", quantidade: 9 },
    { codigo_produto: "1010", nome: "Pasta Plástica", quantidade: 11 },
    
  ];

  // Função para aprovar uma solicitação
  async function aprovarSolicitacao(id: number) {
    try {
      const { error } = await supabase
        .from("solicitacoes")
        .update({ status: "Aprovado" })
        .eq("id", id);
      if (error) throw error;
      setSolicitacoes(
        solicitacoes.map((s) =>
          s.id === id ? { ...s, status: "Aprovado" } : s
        )
      );
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : JSON.stringify(err);
      alert("Erro ao aprovar solicitação: " + msg);
    }
  }

  // Função para baixar o anexo de uma solicitação
  function baixarAnexo(arquivo_url: string | undefined) {
    if (arquivo_url) {
      window.open(
        `https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${arquivo_url}`,
        "_blank"
      );
    }
  }

  // Função para obter a classe do status
  function getStatusClass(status: string) {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return "min-w-32 max-w-32 w-full bg-green-600 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "REJEITADA":
        return "min-w-32 max-w-32 w-full bg-red-600 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "PENDENTE":
        return "min-w-32 max-w-32 w-full bg-yellow-600 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "REENVIADA":
        return "min-w-32 max-w-32 w-full bg-yellow-400 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "DESDOBRADA":
        return "min-w-32 max-w-32 w-full bg-blue-500 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "ABATIDA":
        return "min-w-32 max-w-32 w-full bg-stone-600 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "FINALIZADA":
        return "min-w-32 max-w-32 w-full bg-gray-500 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      default:
        return "min-w-32 max-w-32 w-full bg-blue-900 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
    }
  }

  // Função para ordenar as solicitações
  function handleSort(column: string) {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortColumn(null);
      setSortDirection(null);
>>>>>>> main
    }
  }

  return (
    <>
      <Header />
<<<<<<< HEAD
      <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8" style={{ minHeight: '100vh' }}>
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Painel de Solicitações</h1>
        <div className="w-full max-w-7xl mx-auto">
          <Tabs value={tab} onValueChange={setTab} className="w-full mb-8">
            <TabsContent value="vendas">
              {/* Painel de Vendas */}
              <Card className="bg-slate-800 border-none">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Input
                      placeholder="Pesquise uma solicitação..."
                      value={busca}
                      onChange={e => setBusca(e.target.value)}
                      className="max-w-md bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                    />
                    <Button
                      className="ml-2 bg-slate-600 hover:bg-slate-700 text-white"
                      onClick={fetchSolicitacoes}
                      disabled={refreshing}
                    >
                      {refreshing ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                    <div className="flex gap-4 items-center">
                      <span className="text-white">Filtrar por status:</span>
                      <Select value={status} onValueChange={v => setStatus(v || 'Todos')}>
                        <SelectTrigger className="w-40 bg-slate-700 text-white border-slate-600">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="ml-4 bg-green-600 hover:bg-green-700 text-white">Baixar Relatório</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-slate-800 text-white rounded-lg">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300">
                          <th className="px-2 py-2 text-left">ID</th>
                          <th className="px-2 py-2 text-left">Nome</th>
                          <th className="px-2 py-2 text-left">Filial</th>
                          <th className="px-2 py-2 text-left">Nº NF</th>
                          <th className="px-2 py-2 text-left">Carga</th>
                          <th className="px-2 py-2 text-left">Cód. Cobrança</th>
                          <th className="px-2 py-2 text-left">Código Cliente</th>
                          <th className="px-2 py-2 text-left">RCA</th>
                          <th className="px-2 py-2 text-left">Motivo da Devolução</th>
                          <th className="px-2 py-2 text-left">Vale</th>
                          <th className="px-2 py-2 text-left">Código do Produto</th>
                          <th className="px-2 py-2 text-left">Tipo de Devolução</th>
                          <th className="px-2 py-2 text-left">Status</th>
                          <th className="px-2 py-2 text-left">Data de Criação</th>
                          <th className="px-2 py-2 text-left">Anexo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSolicitacoes.map((s) => (
                          <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700 hover:bg-slate-700 hover:underline">
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.id}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.nome}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.filial}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.numero_nf}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.carga}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.codigo_cobranca}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.codigo_cliente}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.rca}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.motivo_devolucao}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.vale}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.codigo_produto}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.tipo_devolucao}</td>
                            <td className={"px-2 py-2 cursor-pointer " + getStatusClass(s.status)} onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{s.status}</td>
                            <td className="px-2 py-2 cursor-pointer" onClick={() => setModalDetalhes({ open: true, solicitacao: s })}>{new Date(s.created_at).toLocaleDateString()}</td>
                            <td className="px-2 py-2">
                              {s.arquivo_url && (
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                  variant="secondary" onClick={() => baixarAnexo(s.arquivo_url)}>
                                  Baixar NF
                                </Button>
                              )}
                            </td>
                            <td className="px-2 py-2">
                              {profile?.user_level === 'televendas' && s.status === 'Pendente' && (
                                <div className="flex gap-2">
                                  <Button onClick={() => setModalAprovar({ open: true, id: s.id })} className="bg-green-600 hover:bg-green-700 text-white">Aprovar</Button>
                                  <Button
                                    onClick={() => setModalRecusar({ open: true, id: s.id })}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Recusar
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {paginatedSolicitacoes.length === 0 && (
                          <tr>
                            <td colSpan={16} className="text-center py-8 text-gray-400 bg-slate-800">Nenhuma solicitação encontrada.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Paginação */}
                    {totalPages > 1 && (
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                setPage(p => Math.max(1, p - 1));
                              }}
                              aria-disabled={page === 1}
                              className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                href="#"
                                isActive={page === i + 1}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                  e.preventDefault();
                                  setPage(i + 1);
                                }}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                setPage(p => Math.min(totalPages, p + 1));
                              }}
                              aria-disabled={page === totalPages}
                              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="logistica">
              {/* Painel de Logística */}
              <Card className="bg-slate-800 border-none">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="font-bold text-white">Ações disponíveis: Reenviar solicitações recusadas</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-slate-800 text-white rounded-lg">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300">
                          <th className="px-2 py-2 text-left">ID</th>
                          <th className="px-2 py-2 text-left">Status</th>
                          <th className="px-2 py-2 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile?.user_level === 'logistica' ? (
                          solicitacoes.filter(s => s.status === 'Rejeitado').map((s) => (
                            <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                              <td className="px-2 py-2">{s.id}</td>
                              <td className="px-2 py-2">{s.status}</td>
                              <td className="px-2 py-2">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => reenviarSolicitacao(s.id)}>Reenviar</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="text-center py-8 text-gray-400 bg-slate-800">Apenas usuários de logística podem reenviar solicitações recusadas.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="financeiro">
              {/* Painel de Financeiro */}
              <Card className="bg-slate-800 border-none">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="font-bold text-white">Ações disponíveis: Atualizar status de solicitações aprovadas</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-slate-800 text-white rounded-lg">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300">
                          <th className="px-2 py-2 text-left">ID</th>
                          <th className="px-2 py-2 text-left">Status</th>
                          <th className="px-2 py-2 text-left">Ações</th>
                          <th className="px-2 py-2 text-left">NF</th>
                          <th className="px-2 py-2 text-left">Recibo</th>
                          <th className="px-2 py-2 text-left">NF Devolução</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile?.user_level === 'financeiro' ? (
                          solicitacoes.filter(s => s.status === 'Aprovado').map((s) => (
                            <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                              <td className="px-2 py-2">{s.id}</td>
                              <td className="px-2 py-2">{s.status}</td>
                              <td className="px-2 py-2 flex gap-2">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'DESDOBRADA')}>Desdobrar</Button>
                                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'ABATIDA')}>Abater</Button>
                                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'FINALIZADA')}>Finalizar</Button>
                              </td>
                              <td className="px-2 py-2"><Button className="bg-green-600" onClick={() => baixarAnexo(s.arquivo_url)}>NF</Button></td>
                              <td className="px-2 py-2"><Button className="bg-green-600">Recibo</Button></td>
                              <td className="px-2 py-2"><Button className="bg-green-600">NF Devolução</Button></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={6} className="text-center py-8 text-gray-400 bg-slate-800">Apenas usuários do financeiro podem atualizar status e baixar documentos.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
=======
      <div
        className="flex flex-col items-center min-h-screen bg-gray-900 p-8"
        style={{ minHeight: "100vh" }}
      >
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          Painel de Solicitações
        </h1>
        <div className="w-full max-w-[90%] mx-auto">
          <Card className="bg-slate-800 border-none h-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Input
                  placeholder="Pesquise uma solicitação..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="max-w-md bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                />
                <Button
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  onClick={() => fetchSolicitacoes()}
                  disabled={refreshing}
                >
                  <RefreshCw />
                  {refreshing ? "Atualizando..." : "Atualizar"}
                </Button>
                <div className="flex gap-4 items-center">
                  <span className="text-white">Filtrar por status:</span>
                  <Select
                    value={status}
                    onValueChange={(v) => {
                      setStatus(v || "Todos");
                      fetchSolicitacoes(v || "Todos");
                    }}
                  >
                    <SelectTrigger className="w-40 bg-slate-700 text-white border-slate-600 cursor-pointer">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800">
                      <SelectItem
                        value="Todos"
                        className="bg-slate-600 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer"
                      >
                        Todos
                      </SelectItem>
                      <SelectItem
                        className="bg-slate-400 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="PENDENTE"
                      >
                        Pendente
                      </SelectItem>
                      <SelectItem
                        className="bg-green-600 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="APROVADO"
                      >
                        Aprovado
                      </SelectItem>
                      <SelectItem
                        className="bg-red-600 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="REJEITADO"
                      >
                        Rejeitado
                      </SelectItem>
                      <SelectItem
                        className="bg-blue-700 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="DESDOBRADA"
                      >
                        Desdobrada
                      </SelectItem>
                      <SelectItem
                        className="bg-yellow-400 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="FINALIZADA"
                      >
                        Reenviada
                      </SelectItem>
                      <SelectItem
                        className="bg-yellow-600 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="ABATIDA"
                      >
                        Abatida
                      </SelectItem>
                      <SelectItem
                        className="bg-lime-500 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="FINALIZADA"
                      >
                        Finalizada
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="ml-4 bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                    Baixar Relatório
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <Table className="bg-slate-800 text-white rounded-lg">
                  <TableHeader>
                    <TableRow className="border-slate-700 text-white hover:bg-slate-800 h-20 items-center">
                      <TableHead className="text-white">
                        <OrderBtn
                          label="ID"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Nome"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Filial"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="NºNF"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Carga"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white max-w-8">
                        <OrderBtn
                          label="Cód. Cobrança"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white max-w-20">
                        <OrderBtn
                          label="Código Cliente"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white max-w-">
                        <OrderBtn
                          label="RCA"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Motivo da Devolução"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white max-w-16">
                        <OrderBtn
                          label="Vale"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white text-center max-w-24">
                        <OrderBtn
                          label="Tipo de Devolução"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Data de Criação"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white max-w-28">
                        <OrderBtn
                          label="Status"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                      <TableHead className="text-white">
                        <OrderBtn
                          label="Anexo"
                          onAscClick={() => console.log("Ordem crescente")}
                          onDescClick={() => console.log("Ordem decrescente")}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSolicitacoes.length > 0 ? (
                      paginatedSolicitacoes.map((s, idx) => (
                        <Dialog key={s.id}>
                          <DialogTrigger asChild>
                            <TableRow
                              className={`border-slate-700 cursor-pointer transition-all hover:bg-slate-600 ${
                                idx % 2 === 0 ? "bg-slate-700" : ""
                              }`}
                            >
                              <TableCell className="pl-6">{s.id}</TableCell>
                              <TableCell>{truncateText(s.nome, 15)}</TableCell>
                              <TableCell className="pl-8">{s.filial}</TableCell>
                              <TableCell>{s.numero_nf}</TableCell>
                              <TableCell>{s.carga}</TableCell>
                              <TableCell className="text-center max-w-[70px]">
                                {s.codigo_cobranca}
                              </TableCell>
                              <TableCell className="text-center max-w-2">
                                {s.codigo_cliente}
                              </TableCell>
                              <TableCell className="text-center max-w-2">
                                {s.rca}
                              </TableCell>
                              <TableCell>
                                {truncateText(s.motivo_devolucao, 10)}
                              </TableCell>
                              <TableCell className="text-center max-w-12">
                                {s.vale}
                              </TableCell>
                              <TableCell className="text-center max-w-12">
                                {s.tipo_devolucao}
                              </TableCell>
                              <TableCell className="pl-4">
                                {new Date(s.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className={getStatusClass(s.status)}>
                                {s.status.toUpperCase()}
                              </TableCell>
                              <TableCell>
                                {s.arquivo_url && (
                                  <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                    variant="secondary"
                                    onClick={() => baixarAnexo(s.arquivo_url)}
                                  >
                                    Baixar NF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          </DialogTrigger>

                          {/* Dialog */}
                          <DialogTitle></DialogTitle>
                          <DialogContent className="min-w-[50%] max-h-[95%] overflow-y-auto rounded-xl scrollbar-dark">
                            <div className="grid grid-cols-3 gap-4 p-6 text-white rounded-lg relative">
                            <DialogClose className="absolute right-0">
                                <Button className="cursor-pointer p-0 py-2 w-8 h-auto m-0 bg-red-500 hover:bg-red-700 transition-all flex items-center justify-center shadow-transparent">
                                  <X className="items-center p-0" style={{
                                    width: "18px",
                                    height: "18px",
                                    strokeWidth: "5px"
                                    }}/>
                                </Button>
                              </DialogClose>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Nome:
                                </span>
                                <span>{s.nome}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Filial:
                                </span>
                                <span>{s.filial}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Nº NF:
                                </span>
                                <span>{s.numero_nf}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Carga:
                                </span>
                                <span>{s.numero_nf}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Cód. Cobrança:
                                </span>
                                <span>{s.codigo_cobranca}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Cód. Cliente:
                                </span>
                                <span>{s.codigo_cliente}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  RCA:
                                </span>
                                <span>{s.rca}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="font-bold bg-slate-700 p-1 rounded-md">
                                  Vale:
                                </span>
                                <span>{s.vale}</span>
                              </div>
                              <Card className="flex flex-col items-center justify-center col-span-3 bg-slate-600">
                                <CardHeader className="flex items-center justify-center text-center w-full">
                                  <span className="font-bold bg-slate-00 w-full text-white text-center text-xl">
                                    Motivo da Devolução:
                                  </span>
                                </CardHeader>
                                <CardContent className="w-[96%] p-6 rounded-md h-40 overflow-y-scroll scrollbar-dark">
                                  <span className="text-white text-lg min-h-[100%] max-h-[100%]">
                                    {s.motivo_devolucao}                                    
                                  </span>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-slate-600 text-white col-span-3 max-h-80 flex gap-0 p-0">
                                <span className="text-center font-bold text-xl py-2">
                                  PRODUTOS
                                </span>
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
                                  <TableHeader className="mx-6">
                                    <TableRow className="mx-6">
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="mx-6 px-32">
                                    {productsList.map((p) => (
                                      <TableRow
                                        key={p.codigo_produto}
                                        className="px-32 w-full"
                                      >
                                        <TableCell className="text-center w-[25%] text-lg">
                                          {p.codigo_produto}
                                        </TableCell>
                                        <TableCell className="text-lg">{p.nome}</TableCell>
                                        <TableCell className="pl-8 w-[25%] text-center text-lg">
                                          {p.quantidade}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={15}
                          className="text-center py-8 text-gray-400 bg-slate-800"
                        >
                          Nenhuma solicitação encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Paginação */}
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            setPage((p) => Math.max(1, p - 1));
                          }}
                          aria-disabled={page === 1}
                          className={
                            page === 1 ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            href="#"
                            isActive={page === i + 1}
                            onClick={(
                              e: React.MouseEvent<HTMLAnchorElement>
                            ) => {
                              e.preventDefault();
                              setPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            setPage((p) => Math.min(totalPages, p + 1));
                          }}
                          aria-disabled={page === totalPages}
                          className={
                            page === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>
>>>>>>> main
        </div>
      </div>
      {/* Modal Aprovar */}
      {modalAprovar.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Aprovar Solicitação</h2>
            <div className="mb-4">
              <label className="block mb-2">Vale?</label>
<<<<<<< HEAD
              <select value={aprovacaoVale} onChange={e => setAprovacaoVale(e.target.value)} className="w-full border rounded p-2">
=======
              <select
                value={aprovacaoVale}
                onChange={(e) => setAprovacaoVale(e.target.value)}
                className="w-full border rounded p-2"
              >
>>>>>>> main
                <option value="">Escolha uma opção</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Recibo:</label>
<<<<<<< HEAD
              <input type="file" onChange={e => setAprovacaoRecibo(e.target.files?.[0] || null)} className="w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Nota de Devolução:</label>
              <input type="file" onChange={e => setAprovacaoNF(e.target.files?.[0] || null)} className="w-full" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button className="bg-green-600" onClick={async () => {
                // Aqui você pode fazer upload dos arquivos e atualizar a solicitação
                await aprovarSolicitacao(modalAprovar.id!);
                setModalAprovar({ open: false });
                setAprovacaoVale(''); setAprovacaoRecibo(null); setAprovacaoNF(null);
              }}>Confirmar</Button>
              <Button className="bg-gray-400" onClick={() => { setModalAprovar({ open: false }); setAprovacaoVale(''); setAprovacaoRecibo(null); setAprovacaoNF(null); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Recusar */}
      {modalRecusar.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Motivo da Recusa:</h2>
            <textarea value={motivoRecusa} onChange={e => setMotivoRecusa(e.target.value)} className="w-full border rounded p-2 mb-4" />
            <div className="flex gap-2 justify-end">
              <Button className="bg-green-600" onClick={async () => {
                await recusarSolicitacao(modalRecusar.id!, motivoRecusa);
                setModalRecusar({ open: false }); setMotivoRecusa('');
              }}>Confirmar</Button>
              <Button className="bg-gray-400" onClick={() => { setModalRecusar({ open: false }); setMotivoRecusa(''); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Detalhes/Editar Solicitação */}
      {modalDetalhes.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 text-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalhes da Solicitação</h2>
            {modalDetalhes.solicitacao ? (
              <>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">ID:</b> {modalDetalhes.solicitacao.id}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Nome:</b> {modalDetalhes.solicitacao.nome}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Filial:</b> {modalDetalhes.solicitacao.filial}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Nº NF:</b> {modalDetalhes.solicitacao.numero_nf}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Carga:</b> {modalDetalhes.solicitacao.carga}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Cód. Cobrança:</b> {modalDetalhes.solicitacao.codigo_cobranca}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Código Cliente:</b> {modalDetalhes.solicitacao.codigo_cliente}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">RCA:</b> {modalDetalhes.solicitacao.rca}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Motivo da Devolução:</b> {modalDetalhes.solicitacao.motivo_devolucao}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Vale:</b> {modalDetalhes.solicitacao.vale}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Código do Produto:</b> {modalDetalhes.solicitacao.codigo_produto}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Tipo de Devolução:</b> {modalDetalhes.solicitacao.tipo_devolucao}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Status Atual:</b> {modalDetalhes.solicitacao.status}</div>
                <div className="mb-2"><b className="bg-slate-700 p-1 rounded-md">Data de Criação:</b> {new Date(modalDetalhes.solicitacao.created_at).toLocaleString()}</div>
                <div className="mb-4">
                  <label className="block mb-2 font-bold">Editar Status:</label>
                  <select
                    value={modalDetalhes.solicitacao.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.value;
                      await atualizarStatusFinanceiro(modalDetalhes.solicitacao!.id, novoStatus);
                      setModalDetalhes((prev) => prev.solicitacao ? { ...prev, solicitacao: { ...prev.solicitacao, status: novoStatus } } : prev);
                    }}
                    className="w-full border rounded p-2 bg-slate-700 text-white"
                  >
                    <option value="PENDENTE" className="bg-slate-700 font-bold text-white">Pendente</option>
                    <option value="APROVADO" className="bg-slate-700 font-bold text-green-500">Aprovado</option>
                    <option value="REJEITADO" className="bg-slate-700 font-bold text-red-500">Rejeitado</option>
                    <option value="REENVIADA" className="bg-slate-700 font-bold text-yellow-500">Reenviada</option>
                    <option value="DESDOBRADA" className="bg-slate-700 font-bold text-blue-400">Desdobrada</option>
                    <option value="ABATIDA" className="bg-slate-700 font-bold text-stone-300">Abatida</option>
                    <option value="FINALIZADA" className="bg-slate-700 font-bold text-gray-400">Finalizada</option>
                  </select>
                </div>
              </>
            ) : <div>Selecione uma solicitação para ver detalhes.</div>}
            <div className="flex gap-2 justify-end mt-4">
              <Button className="bg-gray-400" onClick={() => setModalDetalhes({ open: false })}>Fechar</Button>
=======
              <input type="file" className="w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Nota de Devolução:</label>
              <input type="file" className="w-full" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-green-600"
                onClick={async () => {
                  await aprovarSolicitacao(modalAprovar.id!);
                  setModalAprovar({ open: false });
                  setAprovacaoVale("");
                }}
              >
                Confirmar
              </Button>
              <Button
                className="bg-gray-400"
                onClick={() => {
                  setModalAprovar({ open: false });
                  setAprovacaoVale("");
                }}
              >
                Cancelar
              </Button>
>>>>>>> main
            </div>
          </div>
        </div>
      )}
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> main
