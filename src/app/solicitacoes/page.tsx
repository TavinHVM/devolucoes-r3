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
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
  function handleSort(column: string, direction: "asc" | "desc") {
    setSortColumn(column);
    setSortDirection(direction);
  }

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
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="ID"
                          onAscClick={() => handleSort("id", "asc")}
                          onDescClick={() => handleSort("id", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Nome"
                          onAscClick={() => handleSort("nome", "asc")}
                          onDescClick={() => handleSort("nome", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Filial"
                          onAscClick={() => handleSort("filial", "asc")}
                          onDescClick={() => handleSort("filial", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="NºNF"
                          onAscClick={() => handleSort("numero_nf", "asc")}
                          onDescClick={() => handleSort("numero_nf", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Carga"
                          onAscClick={() => handleSort("carga", "asc")}
                          onDescClick={() => handleSort("carga", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Cód. Cobrança"
                          onAscClick={() => handleSort("codigo_cobranca", "asc")}
                          onDescClick={() => handleSort("codigo_cobranca", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Código Cliente"
                          onAscClick={() => handleSort("codigo_cliente", "asc")}
                          onDescClick={() => handleSort("codigo_cliente", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="RCA"
                          onAscClick={() => handleSort("rca", "asc")}
                          onDescClick={() => handleSort("rca", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Motivo da Devolução"
                          onAscClick={() => handleSort("motivo_devolucao", "asc")}
                          onDescClick={() => handleSort("motivo_devolucao", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Vale"
                          onAscClick={() => handleSort("vale", "asc")}
                          onDescClick={() => handleSort("vale", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Tipo de Devolução"
                          onAscClick={() => handleSort("tipo_devolucao", "asc")}
                          onDescClick={() => handleSort("tipo_devolucao", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Data de Criação"
                          onAscClick={() => handleSort("created_at", "asc")}
                          onDescClick={() => handleSort("created_at", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Status"
                          onAscClick={() => handleSort("status", "asc")}
                          onDescClick={() => handleSort("status", "desc")}
                        />
                      </TableHead>
                      <TableHead className="text-white whitespace-nowrap">
                        <OrderBtn
                          label="Anexo"
                          onAscClick={() => handleSort("arquivo_url", "asc")}
                          onDescClick={() => handleSort("arquivo_url", "desc")}
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
                              className={`border-slate-700 cursor-pointer transition-all hover:bg-slate-600 ${idx % 2 === 0 ? "bg-slate-700" : ""
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
        </div>
      </div>
      {/* Modal Aprovar */}
      {modalAprovar.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Aprovar Solicitação</h2>
            <div className="mb-4">
              <label className="block mb-2">Vale?</label>
              <select
                value={aprovacaoVale}
                onChange={(e) => setAprovacaoVale(e.target.value)}
                className="w-full border rounded p-2"
              >
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}