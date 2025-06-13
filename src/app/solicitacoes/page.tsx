'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';

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
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [tab, setTab] = useState('vendas');

  useEffect(() => {
    async function fetchSolicitacoes() {
      let query = supabase.from('solicitacoes').select('*');
      if (status !== 'Todos') {
        query = query.eq('status', status);
      }
      const { data } = await query;
      setSolicitacoes(data || []);
    }
    fetchSolicitacoes();
  }, [status]);

  const solicitacoesFiltradas = solicitacoes.filter(s =>
    Object.values(s).join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  // Funções para aprovar, recusar, reenviar, atualizar status, baixar anexo
  async function aprovarSolicitacao(id: number) {
    // Exemplo: abrir modal para VALE e atualizar status
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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Painel de Solicitações</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-6xl mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="logistica">Logística</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        <TabsContent value="vendas">
          {/* Painel de Vendas */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Input
                  placeholder="Pesquise uma solicitação..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  className="max-w-md"
                />
                <div className="flex gap-4 items-center">
                  <span>Filtrar por status:</span>
                  <Select value={status} onValueChange={v => setStatus(v || 'Todos')}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="ml-4">Baixar Relatório</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-100">
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
                    {solicitacoesFiltradas.map((s) => (
                      <tr key={s.id} className="bg-white shadow-sm rounded">
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
                            <Button variant="outline" onClick={() => baixarAnexo(s.arquivo_url)}>
                              Baixar NF
                            </Button>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {s.status === 'Pendente' && (
                            <>
                              <Button onClick={() => aprovarSolicitacao(s.id)} className="mr-2">Aprovar</Button>
                              <Button onClick={() => recusarSolicitacao(s.id, prompt('Motivo da recusa:') || '')} variant="destructive">Recusar</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {solicitacoesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan={16} className="text-center py-8 text-gray-400">Nenhuma solicitação encontrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logistica">
          {/* Painel de Logística */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="font-bold">Ações disponíveis: Reenviar solicitações recusadas</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 text-left">ID</th>
                      <th className="px-2 py-2 text-left">Status</th>
                      <th className="px-2 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoes.filter(s => s.status === 'Rejeitado').map((s) => (
                      <tr key={s.id} className="bg-white shadow-sm rounded">
                        <td className="px-2 py-2">{s.id}</td>
                        <td className="px-2 py-2">{s.status}</td>
                        <td className="px-2 py-2">
                          <Button onClick={() => reenviarSolicitacao(s.id)}>Reenviar</Button>
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
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="font-bold">Ações disponíveis: Atualizar status de solicitações aprovadas</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 text-left">ID</th>
                      <th className="px-2 py-2 text-left">Status</th>
                      <th className="px-2 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoes.filter(s => s.status === 'Aprovado').map((s) => (
                      <tr key={s.id} className="bg-white shadow-sm rounded">
                        <td className="px-2 py-2">{s.id}</td>
                        <td className="px-2 py-2">{s.status}</td>
                        <td className="px-2 py-2">
                          <Button onClick={() => atualizarStatusFinanceiro(s.id, 'DESDOBRADA')}>Desdobrada</Button>
                          <Button onClick={() => atualizarStatusFinanceiro(s.id, 'ABATIDA')}>Abatida</Button>
                          <Button onClick={() => atualizarStatusFinanceiro(s.id, 'FINALIZADA')}>Finalizada</Button>
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
  );
}