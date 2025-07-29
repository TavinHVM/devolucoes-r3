"use client";
import { useEffect, useState } from "react";
import { truncateText } from "../../utils/truncateText";
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
// import { useRouter } from "next/navigation";
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
import { AprovarSolicitacao, RecusarSolicitacao, ReenviarSolicitacao, DesdobrarSolicitacao, AbaterSolicitacao, FinalizarSolicitacao } from "@/utils/solicitacoes/botoesSolicitacoes";

type Solicitacao = {
  id: number;
  nome: string;
  filial: string;
  numero_nf: string;
  carga: string;
  cod_cobranca: string;
  cod_cliente: string;
  rca: string;
  motivo_devolucao: string;
  vale?: string;
  tipo_devolucao: string;
  status: string;
  created_at: string;
  arquivo_url?: string;
  products_list: JSON; 
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [refreshing, setRefreshing] = useState(false);
  const [sortColumns, setSortColumns] = useState<{ column: string; direction: "asc" | "desc" }[]>([]);



  // Função para buscar as solicitações
  useEffect(() => {
    const fetchSolicitacoes = async () => {
        try {
            setRefreshing(true);

            const response = await fetch('/api/getSolicitacoes', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                },
                // cache: 'no-store',
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar os Solicitações.');
            }
            const data = await response.json();
            setSolicitacoes(data);
        } catch (error) {
            console.error('Erro ao buscar os Solicitações:', error);
        }
        // setLoading(false);
        setRefreshing(false);
    }

    fetchSolicitacoes();
  }, []);

// Função para ordenar/adicionar coluna com prioridade da esquerda para a direita
function handleSort(column: string, direction: "asc" | "desc") {
  setSortColumns(prev => {
    // Remove a coluna se já existir
    const filtered = prev.filter(s => s.column !== column);
    // Adiciona no início (maior prioridade)
    return [{ column, direction }, ...filtered];
  });
}

// Função para remover ordenação de uma coluna
function handleClearSort(column: string) {
  setSortColumns(prev => prev.filter(s => s.column !== column));
}

// Ordenação multi-coluna
const sortedSolicitacoes = [...solicitacoes];
if (sortColumns.length > 0) {
  sortedSolicitacoes.sort((a, b) => {
    for (const sort of sortColumns) {
      const aValue = a[sort.column as keyof Solicitacao] ?? "";
      const bValue = b[sort.column as keyof Solicitacao] ?? "";
      if (sort.column === "created_at") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        if (aDate.getTime() !== bDate.getTime()) {
          return sort.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        if (aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" }) !== 0) {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" })
            : bValue.localeCompare(aValue, "pt-BR", { sensitivity: "base" });
        }
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue !== bValue) {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
      }
    }
    return 0;
  });
}

// Função para filtrar solicitações com base na busca
const filteredSolicitacoes = sortedSolicitacoes.filter((s) => {
  const searchTerm = busca.toLowerCase();
  return (
    s.nome.toLowerCase().includes(searchTerm) ||
    s.filial.toLowerCase().includes(searchTerm) ||
    s.numero_nf.toLowerCase().includes(searchTerm) ||
    s.carga.toLowerCase().includes(searchTerm) ||
    s.cod_cobranca.toLowerCase().includes(searchTerm) ||
    s.cod_cliente.toLowerCase().includes(searchTerm) ||
    s.rca.toLowerCase().includes(searchTerm) ||
    s.motivo_devolucao.toLowerCase().includes(searchTerm) ||
    (s.vale?.toLowerCase().includes(searchTerm) ?? false) ||
    s.tipo_devolucao.toLowerCase().includes(searchTerm) ||
    s.status.toLowerCase().includes(searchTerm)
  );
});

  // Função para obter a classe do status
  function getStatusClass(status: string) {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return "min-w-32 max-w-32 w-full bg-green-600 text-white font-bold px-1 py-4 rounded flex justify-center h-full";
      case "RECUSADA":
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSolicitacoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitacoes.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - 7); // Começa 7 páginas antes do número atual
  const endPage = Math.min(totalPages, startPage + 14); // Termina 15 páginas após o início

  return (
    <>
      <Header />
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
                  // onClick={() => fetchSolicitacoes()}
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
                        value="APROVADA"
                      >
                        Aprovado
                      </SelectItem>
                      <SelectItem
                        className="bg-red-600 text-white font-bold px-1 py-2 rounded flex justify-center h-full cursor-pointer transition-all"
                        value="RECUSADA"
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
                        value="REENVIADA"
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
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="ID"
                          columnKey="id"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Nome"
                          columnKey="nome"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />

                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Filial"
                          columnKey="filial"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="NºNF"
                          columnKey="numero_nf"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Carga"
                          columnKey="carga"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Cód. Cobrança"
                          columnKey="codigo_cobranca"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Código Cliente"
                          columnKey="codigo_cliente"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="RCA"
                          columnKey="rca"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Motivo da Devolução"
                          columnKey="motivo_devolucao"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Vale"
                          columnKey="vale"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Tipo de Devolução"
                          columnKey="tipo_devolucao"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Data de Criação"
                          columnKey="created_at"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Status"
                          columnKey="status"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Anexo"
                          columnKey="arquivo_url"
                          activeSort={sortColumns}
                          onSort={handleSort}
                          onClearSort={handleClearSort}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((s, idx) => (
                        <Dialog key={s.id}>
                          <DialogTrigger asChild>
                            <TableRow
                              className={`border-slate-700 cursor-pointer transition-all hover:bg-slate-600 ${idx % 2 === 0 ? "bg-slate-700" : ""
                                }`}
                            >
                              <TableCell className="pl-6">{s.id}</TableCell>
                              <TableCell>{truncateText(s.nome, 15)}</TableCell>
                              <TableCell className="pl-8">{s.filial}</TableCell>
                              <TableCell>{s.numero_nf}</TableCell>
                              <TableCell>{s.carga}</TableCell>
                              <TableCell className="text-center max-w-[70px]">
                                {s.cod_cobranca}
                              </TableCell>
                              <TableCell className="text-center max-w-2">
                                {s.cod_cliente}
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
                                    // onClick={() => baixarAnexo(s.arquivo_url)}
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
                              <DialogClose className="absolute right-0" />
                                <DialogClose className="absolute right-0">
                                  <Button className="cursor-pointer p-0 py-2 w-8 h-auto m-0 bg-red-500 hover:bg-red-700 transition-all flex items-center justify-center shadow-transparent">
                                    <X className="items-center p-0" style={{
                                      width: "18px",
                                      height: "18px",
                                      strokeWidth: "5px"
                                    }} />
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
                                  <span>{s.cod_cobranca}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="font-bold bg-slate-700 p-1 rounded-md">
                                    Cód. Cliente:
                                  </span>
                                  <span>{s.cod_cliente}</span>
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
                                      {Array.isArray(s.products_list) && s.products_list.map((p: { codigo: number, descricao: string, quantidade: number }) => (
                                        <TableRow
                                          key={p.codigo}
                                          className="px-32 w-full"
                                        >
                                          <TableCell className="text-center w-[25%] text-lg">
                                            {p.codigo}
                                          </TableCell>
                                          <TableCell className="text-lg">{p.descricao}</TableCell>
                                          <TableCell className="pl-8 w-[25%] text-center text-lg">
                                            {p.quantidade}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Card>
                                <div className="grid grid-cols-3 gap-2 col-span-3 w-full justify-between px-8">
                                  <Button className="bg-green-600 cursor-pointer transition-all"
                                    onClick={() => AprovarSolicitacao(s.id)}>
                                    Aprovar
                                  </Button>
                                  <Button className="bg-blue-700 cursor-pointer transition-all"
                                    onClick={() => DesdobrarSolicitacao(s.id)}>
                                    Desdobrar
                                  </Button>
                                  <Button className="bg-yellow-600 cursor-pointer transition-all"
                                    onClick={() => AbaterSolicitacao(s.id)}>
                                    Abater
                                  </Button>
                                  <Button className="bg-lime-500 cursor-pointer transition-all"
                                    onClick={() => FinalizarSolicitacao(s.id)}>
                                    Finalizar
                                  </Button>
                                  <Button className="bg-red-600 cursor-pointer transition-all"
                                    onClick={() => RecusarSolicitacao(s.id)}>
                                    Recusar
                                  </Button>
                                  <Button className="bg-yellow-400 cursor-pointer transition-all"
                                    onClick={() => ReenviarSolicitacao(s.id)}>
                                    Reenviar
                                  </Button>
                                </div>
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
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious namePrevious="Primeira Página" href="#" onClick={() => setCurrentPage(1)} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious namePrevious="Anterior" href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                    </PaginationItem>
                    {[...Array(endPage - startPage + 1)].map((_, i) => (
                      <PaginationItem key={i + startPage}>
                        <PaginationLink className={currentPage === i + startPage ? "bg-slate-600" : ""} href="#" onClick={() => setCurrentPage(i + startPage)}>{i + startPage}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext nameNext="Próxima" href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext nameNext="Última Página" href="#" onClick={() => setCurrentPage(totalPages)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
