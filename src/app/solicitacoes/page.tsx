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

  useEffect(() => {
    if (loading) return;
    async function fetchSolicitacoes() {
      let query = supabase.from('solicitacoes').select('*');
      if (status !== 'Todos') {
        query = query.eq('status', status);
      }
      const { data } = await query;
      setSolicitacoes(data || []);
    }
    fetchSolicitacoes();
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
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      case 'REENVIADA': return 'bg-blue-400 text-white font-bold px-1 py-1 rounded';
      case 'DESDOBRADA': return 'bg-blue-700 text-white font-bold px-1 py-1 rounded';
      case 'ABATIDA': return 'bg-stone-400 text-white font-bold px-1 py-1 rounded';
      case 'FINALIZADA': return 'bg-gray-500 text-white font-bold px-1 py-1 rounded';
      default: return 'bg-slate-700 text-white px-2 py-1 rounded';
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
                          <th className="px-2 py-2 text-left">Ações</th>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}