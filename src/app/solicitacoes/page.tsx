'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
};

export default function VisualizacaoSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState('Todos');
  const [busca, setBusca] = useState('');

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Visualização de Solicitações</h1>
      <Card className="w-full max-w-6xl mb-8">
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
              <Select value={status} onValueChange={setStatus}>
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
                  </tr>
                ))}
                {solicitacoesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={14} className="text-center py-8 text-gray-400">Nenhuma solicitação encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 