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
  const [modalAprovar, setModalAprovar] = useState<{open: boolean, id?: number}>({open: false});
  const [modalRecusar, setModalRecusar] = useState<{open: boolean, id?: number}>({open: false});
  const [aprovacaoVale, setAprovacaoVale] = useState('');
  const [aprovacaoRecibo, setAprovacaoRecibo] = useState<File|null>(null);
  const [aprovacaoNF, setAprovacaoNF] = useState<File|null>(null);
  const [motivoRecusa, setMotivoRecusa] = useState('');

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
    await supabase.from('solicitacoes').update({ status: 'Aprovado' }).eq('id', id);
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
  }
  async function recusarSolicitacao(id: number, motivo: string) {
    await supabase.from('solicitacoes').update({ status: 'Rejeitado', motivo_devolucao: motivo }).eq('id', id);
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Rejeitado', motivo_devolucao: motivo } : s));
  }
  async function reenviarSolicitacao(id: number) {
    await supabase.from('solicitacoes').update({ status: 'Reenviada' }).eq('id', id);
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Reenviada' } : s));
  }
  async function atualizarStatusFinanceiro(id: number, novoStatus: string) {
    await supabase.from('solicitacoes').update({ status: novoStatus }).eq('id', id);
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: novoStatus } : s));
  }
  function baixarAnexo(arquivo_url: string | undefined) {
    if (arquivo_url) {
      window.open(`https://<sua-url-supabase-storage>/${arquivo_url}`, '_blank');
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8" style={{ minHeight: '100vh' }}>
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Painel de Solicitações</h1>
        <div className="w-full max-w-7xl mx-auto">
          <Tabs value={tab} onValueChange={setTab} className="w-full mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="logistica">Logística</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>
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
                          <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                            <td className="px-2 py-2">{s.id}</td>
                            <td className="px-2 py-2">{s.nome}</td>
                            <td className="px-2 py-2">{s.filial}</td>
                            <td className="px-2 py-2">{s.numero_nf}</td>
                            <td className="px-2 py-2">{s.carga}</td>
                            <td className="px-2 py-2">{s.codigo_cobranca}</td>
                            <td className="px-2 py-2">{s.codigo_cliente}</td>
                            <td className="px-2 py-2">{s.rca}</td>
                            <td className="px-2 py-2">{s.motivo_devolucao}</td>
                            <td className="px-2 py-2">{s.vale}</td>
                            <td className="px-2 py-2">{s.codigo_produto}</td>
                            <td className="px-2 py-2">{s.tipo_devolucao}</td>
                            <td className="px-2 py-2">{s.status}</td>
                            <td className="px-2 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
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
                                  <Button onClick={() => setModalAprovar({open: true, id: s.id})} className="bg-green-600 hover:bg-green-700 text-white">Aprovar</Button>
                                  <Button
                                    onClick={() => setModalRecusar({open: true, id: s.id})}
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
                        {solicitacoes.filter(s => s.status === 'Rejeitado').map((s) => (
                          <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                            <td className="px-2 py-2">{s.id}</td>
                            <td className="px-2 py-2">{s.status}</td>
                            <td className="px-2 py-2">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => reenviarSolicitacao(s.id)}>Reenviar</Button>
                            </td>
                          </tr>
                        ))}
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
                        </tr>
                      </thead>
                      <tbody>
                        {solicitacoes.filter(s => s.status === 'Aprovado').map((s) => (
                          <tr key={s.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                            <td className="px-2 py-2">{s.id}</td>
                            <td className="px-2 py-2">{s.status}</td>
                            <td className="px-2 py-2 flex gap-2">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'DESDOBRADA')}>Desdobrada</Button>
                              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'ABATIDA')}>Abatida</Button>
                              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => atualizarStatusFinanceiro(s.id, 'FINALIZADA')}>Finalizada</Button>
                            </td>
                          </tr>
                        ))}
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
                setModalAprovar({open: false});
                setAprovacaoVale(''); setAprovacaoRecibo(null); setAprovacaoNF(null);
              }}>Confirmar</Button>
              <Button className="bg-gray-400" onClick={() => {setModalAprovar({open: false}); setAprovacaoVale(''); setAprovacaoRecibo(null); setAprovacaoNF(null);}}>Cancelar</Button>
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
                setModalRecusar({open: false}); setMotivoRecusa('');
              }}>Confirmar</Button>
              <Button className="bg-gray-400" onClick={() => {setModalRecusar({open: false}); setMotivoRecusa('');}}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}