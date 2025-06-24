'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import Header from '../../components/header';
import { useRouter } from 'next/navigation';
import { gerarRelatorioPDF, gerarRelatorioXLSX, getLogoBase64 } from '../../lib/relatorioUtils';

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
  const [status, setStatus] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [tab, setTab] = useState('vendas');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [profile] = useState<UserProfile | null>(null);
  const [modalAprovar, setModalAprovar] = useState<{ open: boolean, id?: number }>({ open: false });
  const [modalRecusar, setModalRecusar] = useState<{ open: boolean, id?: number }>({ open: false });
  const [aprovacaoVale, setAprovacaoVale] = useState('');
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState<{ open: boolean, solicitacao?: Solicitacao }>({ open: false });
  const [refreshing, setRefreshing] = useState(false);
  const [modalRelatorio, setModalRelatorio] = useState(false);
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Verifica se o usuário está autenticado
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        fetchSolicitacoes();
      }
    }
    checkAuth();
  }, [router]);

  // Função para buscar as solicitações
  async function fetchSolicitacoes(statusParam = status) {
    setRefreshing(true);
    let query = supabase.from('solicitacoes').select('*');
    if (statusParam !== 'Todos') {
      query = query.eq('status', statusParam);
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

  // Função para filtrar as solicitações
  const solicitacoesFiltradas = solicitacoes.filter(s =>
    Object.values(s).join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  // Ordenação das solicitações
  const sortedSolicitacoes = [...solicitacoesFiltradas];
  if (sortColumn && sortDirection) {
    sortedSolicitacoes.sort((a, b) => {
      const aValue = a[sortColumn as keyof Solicitacao] ?? '';
      const bValue = b[sortColumn as keyof Solicitacao] ?? '';
      // Ordenação especial para datas
      if (sortColumn === 'created_at') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue, 'pt-BR', { sensitivity: 'base' })
          : bValue.localeCompare(aValue, 'pt-BR', { sensitivity: 'base' });
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  // Paginação dos dados ordenados
  const totalPages = Math.ceil(sortedSolicitacoes.length / itemsPerPage);
  const paginatedSolicitacoes = sortedSolicitacoes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Função para aprovar uma solicitação
  async function aprovarSolicitacao(id: number) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Aprovado' }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : JSON.stringify(err);
      alert('Erro ao aprovar solicitação: ' + msg);
    }
  }

  // Função para recusar uma solicitação
  async function recusarSolicitacao(id: number, motivo: string) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Rejeitado', motivo_devolucao: motivo }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Rejeitado', motivo_devolucao: motivo } : s));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : JSON.stringify(err);
      alert('Erro ao recusar solicitação: ' + msg);
    }
  }

  // Função para reenviar uma solicitação
  async function reenviarSolicitacao(id: number) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: 'Reenviada' }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Reenviada' } : s));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : JSON.stringify(err);
      alert('Erro ao reenviar solicitação: ' + msg);
    }
  }

  // Função para atualizar o status de uma solicitação
  async function atualizarStatusFinanceiro(id: number, novoStatus: string) {
    try {
      const { error } = await supabase.from('solicitacoes').update({ status: novoStatus }).eq('id', id);
      if (error) throw error;
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: novoStatus } : s));
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : JSON.stringify(err);
      alert('Erro ao atualizar status: ' + msg);
    }
  }

  // Função para baixar o anexo de uma solicitação
  function baixarAnexo(arquivo_url: string | undefined) {
    if (arquivo_url) {
      window.open(`https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${arquivo_url}`, '_blank');
    }
  }

  // Função para obter a classe do status
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
    }
  }

  // Função para ordenar as solicitações
  function handleSort(column: string) {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortColumn(null);
      setSortDirection(null);
    }
  }

  return (
    <>
      <Header />
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
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                      onClick={() => fetchSolicitacoes()}
                      disabled={refreshing}
                    >
                      {refreshing ? 'Atualizando...' : 'Atualizar'}
                    </Button>
                    <div className="flex gap-4 items-center">
                      <span className="text-white">Filtrar por status:</span>
                      <Select value={status} onValueChange={v => { setStatus(v || 'Todos'); fetchSolicitacoes(v || 'Todos'); }}>
                        <SelectTrigger className="w-40 bg-slate-700 text-white border-slate-600 cursor-pointer">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="PENDENTE">Pendente</SelectItem>
                          <SelectItem value="APROVADO">Aprovado</SelectItem>
                          <SelectItem value="REJEITADO">Rejeitado</SelectItem>
                          <SelectItem value="DESDOBRADA">Desdobrada</SelectItem>
                          <SelectItem value="ABATIDA">Abatida</SelectItem>
                          <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="ml-4 bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={() => setModalRelatorio(true)}>
                        Baixar Relatório
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-slate-800 text-white rounded-lg">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300">
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('id')}>ID{sortColumn === 'id' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('nome')}>Nome{sortColumn === 'nome' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('filial')}>Filial{sortColumn === 'filial' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('numero_nf')}>Nº NF{sortColumn === 'numero_nf' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('carga')}>Carga{sortColumn === 'carga' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('codigo_cobranca')}>Cód. Cobrança{sortColumn === 'codigo_cobranca' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('codigo_cliente')}>Código Cliente{sortColumn === 'codigo_cliente' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('rca')}>RCA{sortColumn === 'rca' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th
                            className="px-2 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort('motivo_devolucao')}
                          >
                            Motivo da Devolução
                            {sortColumn === 'motivo_devolucao' && sortDirection && (
                              <span>
                                {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                              </span>
                            )}
                          </th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('vale')}>Vale{sortColumn === 'vale' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('codigo_produto')}>Código do Produto{sortColumn === 'codigo_produto' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('tipo_devolucao')}>Tipo de Devolução{sortColumn === 'tipo_devolucao' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('status')}>Status{sortColumn === 'status' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
                          <th className="px-2 py-2 text-left cursor-pointer" onClick={() => handleSort('created_at')}>Data de Criação{sortColumn === 'created_at' && sortDirection && (<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}</th>
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
                                    className="bg-red-500 hover:bg-red-600 text-white"
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
        </div>
      </div>
      {/* Modal Aprovar */}
      {modalAprovar.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Aprovar Solicitação</h2>
            <div className="mb-4">
              <label className="block mb-2">Vale?</label>
              <select value={aprovacaoVale} onChange={e => setAprovacaoVale(e.target.value)} className="w-full border rounded p-2">
                <option value="">Escolha uma opção</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Recibo:</label>
              <input type="file" className="w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Nota de Devolução:</label>
              <input type="file" className="w-full" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button className="bg-green-600" onClick={async () => {
                await aprovarSolicitacao(modalAprovar.id!);
                setModalAprovar({ open: false });
                setAprovacaoVale('');
              }}>Confirmar</Button>
              <Button className="bg-gray-400" onClick={() => {
                setModalAprovar({ open: false });
                setAprovacaoVale('');
              }}>Cancelar</Button>
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
            </div>
          </div>
        </div>
      )}
      {modalRelatorio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 text-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Download do Relatório</h2>
            <p className="mb-4">Você está prestes a baixar um relatório em PDF ou Excel contendo <b>{solicitacoesFiltradas.length}</b> solicitações filtradas pelo status: <b>{status}</b>.<br />Escolha o formato desejado:</p>
            <div className="flex gap-2 justify-end">
              <Button className="bg-gray-500 hover:bg-gray-600 cursor-pointer" onClick={() => setModalRelatorio(false)}>Cancelar</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={async () => {
                const logoBase64 = await getLogoBase64('/r3logo.png');
                await gerarRelatorioPDF({ solicitacoes: solicitacoesFiltradas, status, logoBase64 });
                setModalRelatorio(false);
              }}>Baixar em PDF</Button>
              <Button className="bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => { gerarRelatorioXLSX({ solicitacoes: solicitacoesFiltradas }); setModalRelatorio(false); }}>Baixar em Excel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}