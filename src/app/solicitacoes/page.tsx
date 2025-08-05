"use client";
import { useEffect, useState } from "react";
import { truncateText } from "../../utils/truncateText";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
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
import {
  // X,
  RefreshCw,
  Search,
  Filter,
  Download,
  FileText,
  Eye,
  Calendar,
  Package,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
  Target,
  Handshake,
  Wallet,
} from "lucide-react";
// import { DialogClose } from "@radix-ui/react-dialog";
import { filterTableHeader } from "@/utils/filters/filterTableHeader";
import { filterBySearch } from "@/utils/filters/filterBySearch";
import { filterByStatus } from "@/utils/filters/filterByStatus";
import {
  AprovarSolicitacao,
  RecusarSolicitacao,
  ReenviarSolicitacao,
  DesdobrarSolicitacao,
  AbaterSolicitacao,
  FinalizarSolicitacao,
} from "@/utils/solicitacoes/botoesSolicitacoes";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/useAuth";
import { getUserPermissions } from "@/utils/permissions/userPermissions";
import { FileUploadNFDevRecibo } from "@/components/fileUpload_NFDev_Recibo";
import { ProdutosCard } from "@/components/solicitacoesComponent/produtos";

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
  motivo_recusa: string;
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
  const [sortColumns, setSortColumns] = useState<
    { column: string; direction: "asc" | "desc" }[]
  >([]);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<{
    nfDevolucao: File | null;
    recibo: File | null;
  }>({ nfDevolucao: null, recibo: null });
  const [filesValid, setFilesValid] = useState(false);

  // Authentication and permissions
  const { user, isAuthenticated, isLoading } = useAuth();
  const userPermissions = getUserPermissions(user);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return <CheckCircle2 className="h-4 w-4" />;
      case "RECUSADA":
        return <XCircle className="h-4 w-4" />;
      case "PENDENTE":
        return <Clock className="h-4 w-4" />;
      case "REENVIADA":
        return <RotateCcw className="h-4 w-4" />;
      case "DESDOBRADA":
        return <Target className="h-4 w-4" />;
      case "ABATIDA":
        return <AlertTriangle className="h-4 w-4" />;
      case "FINALIZADA":
        return <Zap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Função para obter variante do badge baseada no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return "default";
      case "FINALIZADA":
        return "default";
      case "RECUSADA":
        return "default";
      case "PENDENTE":
        return "default";
      case "REENVIADA":
        return "default";
      case "ABATIDA":
        return "default";
      case "DESDOBRADA":
        return "default";
      default:
        return "secondary";
    }
  };

  // Função para buscar as solicitações
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        setRefreshing(true);

        const response = await fetch("/api/getSolicitacoes", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
          // cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar os Solicitações.");
        }
        const data = await response.json();
        setSolicitacoes(data);
      } catch (error) {
        console.error("Erro ao buscar os Solicitações:", error);
      }
      // setLoading(false);
      setRefreshing(false);
    };

    fetchSolicitacoes();
  }, []);

  // Função para ordenar/adicionar coluna com prioridade da esquerda para a direita
  function handleSort(column: string, direction: "asc" | "desc") {
    setSortColumns((prev) => {
      // Remove a coluna se já existir
      const filtered = prev.filter((s) => s.column !== column);
      // Adiciona no início (maior prioridade)
      return [{ column, direction }, ...filtered];
    });
  }

  // Função para remover ordenação de uma coluna
  function handleClearSort(column: string) {
    setSortColumns((prev) => prev.filter((s) => s.column !== column));
  }

  // Ordenação multi-coluna
  const sortedSolicitacoes = filterTableHeader(solicitacoes, sortColumns);
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
          if (
            aValue.localeCompare(bValue, "pt-BR", { sensitivity: "base" }) !== 0
          ) {
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

  const filteredSolicitacoes = filterBySearch(sortedSolicitacoes, busca, [
    "nome",
    "filial",
    "numero_nf",
    "carga",
    "cod_cobranca",
    "cod_cliente",
    "rca",
    "motivo_devolucao",
    "vale",
    "tipo_devolucao",
    "status",
  ]);

  const finalSolicitacoes = filterByStatus(filteredSolicitacoes, status);

  // Função para obter a classe do status
  function getStatusClass(status: string) {
    switch (status?.toUpperCase()) {
      case "APROVADA":
        return "min-w-32 max-w-32 w-full bg-green-600 hover:bg-green-700 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "RECUSADA":
        return "min-w-32 max-w-32 w-full bg-red-600 hover:bg-red-700 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "PENDENTE":
        return "min-w-32 max-w-32 w-full bg-slate-400 hover:bg-slate-500 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "REENVIADA":
        return "min-w-32 max-w-32 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "DESDOBRADA":
        return "min-w-32 max-w-32 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "ABATIDA":
        return "min-w-32 max-w-32 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      case "FINALIZADA":
        return "min-w-32 max-w-32 w-full bg-lime-500 hover:bg-lime-600 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
      default:
        return "min-w-32 max-w-32 w-full bg-blue-900 hover:bg-blue-950 text-white font-bold px-1 py-[10px] rounded-3xl flex justify-center h-full";
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = finalSolicitacoes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(finalSolicitacoes.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - 7); // Começa 7 páginas antes do número atual
  const endPage = Math.min(totalPages, startPage + 14); // Termina 15 páginas após o início

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Painel de Solicitações
              </h1>
              <p className="text-slate-400">
                Gerencie todas as solicitações de devolução
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">
                    {solicitacoes.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500/20 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Pendentes</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "PENDENTE"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Aprovadas</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "APROVADA"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Recusadas</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "RECUSADA"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Reenviadas</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "REENVIADA"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Desdobradas</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "DESDOBRADA"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lime-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-lime-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Finalizadas</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      solicitacoes.filter(
                        (s) => s.status.toUpperCase() === "FINALIZADA"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-end pl-4">
              <div className="flex-1">
                <label className="text-slate-300 text-sm font-medium">
                  Buscar solicitações
                </label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nome, NF, cliente, RCA..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <label className="text-slate-300 text-sm font-medium">
                  Status
                </label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v || "Todos")}
                >
                  <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white w-full">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Todos" className="text-white">
                      Todos
                    </SelectItem>
                    <SelectItem value="PENDENTE" className="text-white">
                      Pendente
                    </SelectItem>
                    <SelectItem value="APROVADA" className="text-white">
                      Aprovada
                    </SelectItem>
                    <SelectItem value="RECUSADA" className="text-white">
                      Recusada
                    </SelectItem>
                    <SelectItem value="DESDOBRADA" className="text-white">
                      Desdobrada
                    </SelectItem>
                    <SelectItem value="REENVIADA" className="text-white">
                      Reenviada
                    </SelectItem>
                    <SelectItem value="ABATIDA" className="text-white">
                      Abatida
                    </SelectItem>
                    <SelectItem value="FINALIZADA" className="text-white">
                      Finalizada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pr-4">
                <Button
                  onClick={() => {
                    // fetchSolicitacoes()
                  }}
                  disabled={refreshing}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 cursor-pointer"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Atualizando..." : "Atualizar"}
                </Button>

                <Button className="bg-green-600 hover:bg-green-700 text-white h-10 cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Main Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Lista de Solicitações ({finalSolicitacoes.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              {finalSolicitacoes.length} de {solicitacoes.length} solicitações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-slate-300">
                      <OrderBtn
                        label="ID"
                        columnKey="id"
                        activeSort={sortColumns}
                        onSort={handleSort}
                        onClearSort={handleClearSort}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">
                      <OrderBtn
                        label="Nome Cliente"
                        columnKey="nome"
                        activeSort={sortColumns}
                        onSort={handleSort}
                        onClearSort={handleClearSort}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">
                      <OrderBtn
                        label="Código Cliente"
                        columnKey="cod_cliente"
                        activeSort={sortColumns}
                        onSort={handleSort}
                        onClearSort={handleClearSort}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">
                      <OrderBtn
                        label="NF"
                        columnKey="numero_nf"
                        activeSort={sortColumns}
                        onSort={handleSort}
                        onClearSort={handleClearSort}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">Código RCA</TableHead>
                    <TableHead className="text-slate-300">Tipo</TableHead>
                    <TableHead className="text-slate-300">
                      <OrderBtn
                        label="Data"
                        columnKey="created_at"
                        activeSort={sortColumns}
                        onSort={handleSort}
                        onClearSort={handleClearSort}
                      />
                    </TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 pl-7">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((s) => (
                      <TableRow
                        key={s.id}
                        className="border-slate-700 hover:bg-slate-700/30"
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-slate-300 border-slate-600"
                          >
                            #{s.id}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="font-medium text-white">
                                {truncateText(s.nome, 20)}
                              </p>
                              <p className="text-sm text-slate-400">
                                Filial: {s.filial}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Handshake className="h-4 w-4 text-slate-400" />
                            <span className="text-white">{s.cod_cliente}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-white">{s.numero_nf}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-slate-400" />
                            <p className="text-sm text-white">{s.rca}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-white flex justify-center py-2 w-full max-w-16 text-sm capitalize ${
                              s.tipo_devolucao.toUpperCase() === "PARCIAL"
                                ? "bg-amber-500 hover:bg-amber-500"
                                : "bg-emerald-500 hover:bg-emerald-500"
                            }`}
                          >
                            {s.tipo_devolucao}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-white">
                              {new Date(s.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(s.status)}
                            className={`flex items-center gap-1 ${getStatusClass(
                              s.status
                            )}`}
                          >
                            {getStatusIcon(s.status)}
                            {s.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger
                                asChild
                                className="cursor-pointer hover:text-white"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-dark bg-slate-800 border-slate-700 text-white">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-white w-full justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      Detalhes da Solicitação #{s.id}
                                    </div>

                                    <div className="flex items-center justify-end">
                                      <div className="flex items-center gap-2">
                                        <span className="text-md text-white flex items-center gap-2 font-bold">
                                          {getStatusIcon(s.status)}
                                        </span>
                                        <span>Status</span>
                                      </div>
                                      <div className="flex flex-col justify-between h-full">
                                        <div className="flex gap-2 mx-4 h-full">
                                          <div className="flex justify-center h-full">
                                            <Badge
                                              variant={getStatusBadgeVariant(
                                                s.status
                                              )}
                                              className={`flex items-center gap-1 w-fit ${getStatusClass(
                                                s.status
                                              )}`}
                                            >
                                              {getStatusIcon(s.status)}
                                              {s.status.toUpperCase()}
                                            </Badge>
                                          </div>
                                          <div className="flex text-slate-400 justify-end text-sm items-center gap-1">
                                            <span>Criada em:</span>
                                            <span>
                                              {new Date(
                                                s.created_at
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                  {/* Informações Gerais */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <Card className="bg-slate-700/50 border-slate-600 col-span-2">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-md text-white flex items-center gap-2">
                                          <User className="h-4 w-4" />
                                          Cliente
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex flex-col gap-2 mx-4">
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Código do cliente:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.cod_cliente}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Nome do cliente:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.nome}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Identificador do Cliente:
                                            </p>
                                            <p className="text-white font-medium">
                                              {"10.641.901/0001-16"}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Filial:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.filial === "1"
                                                ? "1 - CD APARECIDA"
                                                : "5 - LOJA RIO VERDE"}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-slate-700/50 border-slate-600">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-md text-white flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          Nota Fiscal
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex flex-col gap-2 mx-4">
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Carga:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.carga}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              NF:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.numero_nf}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Cód:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.cod_cliente}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              RCA:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.rca}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-slate-700/50 border-slate-600">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-md text-white flex items-center gap-2">
                                          <Package className="h-4 w-4" />
                                          Devolução
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex flex-col gap-2 mx-4">
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Tipo de Devolução:
                                            </p>
                                            <Badge
                                              variant="secondary"
                                              className={`text-white text-md w-fit capitalize ${
                                                s.tipo_devolucao.toUpperCase() ===
                                                "PARCIAL"
                                                  ? "bg-amber-500 hover:bg-amber-500"
                                                  : "bg-emerald-500 hover:bg-emerald-500"
                                              }`}
                                            >
                                              {s.tipo_devolucao}
                                            </Badge>
                                          </div>
                                          {s.vale && (
                                            <div className="flex gap-2 items-center">
                                              <p className="text-slate-400 text-sm">
                                                Vale:
                                              </p>
                                              <Badge
                                                variant="secondary"
                                                className={`text-white text-md w-fit capitalize ${
                                                  (
                                                    s.vale as string
                                                  ).toUpperCase() === "SIM"
                                                    ? "bg-green-500 hover:bg-green-500"
                                                    : "bg-red-800 hover:bg-red-800"
                                                }`}
                                              >
                                                {s.vale}
                                              </Badge>
                                            </div>
                                          )}
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Código Cobrança:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.cod_cobranca}
                                            </p>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <p className="text-slate-400 text-sm">
                                              Nome Cobrança:
                                            </p>
                                            <p className="text-white font-medium">
                                              {s.cod_cobranca}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Motivo da Devolução */}
                                  <Card className="bg-slate-700/50 border-slate-600">
                                    <CardHeader>
                                      <CardTitle className="text-white">
                                        Motivo da Devolução
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="mx-8">
                                        <p className="text-slate-300">
                                          {s.motivo_devolucao}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Motivo da Recusa */}
                                  {Boolean(
                                    s.motivo_recusa && s.motivo_recusa.trim()
                                  ) && (
                                    <Card className="bg-slate-700/50 border-slate-600">
                                      <CardHeader>
                                        <CardTitle className="text-white">
                                          Motivo da Recusa
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="mx-8">
                                          <p className="text-slate-300">
                                            {s.motivo_recusa}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Produtos */}
                                  <ProdutosCard numeroNF={s.numero_nf} />

                                  {/* Botões de Ação - Centralizados */}
                                  <div className="flex justify-center gap-4 mt-6">
                                    {s.status.toUpperCase() === "PENDENTE" && (
                                      <>
                                        {userPermissions.canAprovar && (
                                          <Dialog>
                                            <DialogTitle></DialogTitle>
                                            <DialogTrigger className="flex items-center justify-center text-sm font-semibold gap-1 bg-green-600 hover:bg-green-700 cursor-pointer py-2 px-4 rounded-md">
                                              <CheckCircle2 className="h-4 w-4 mr-2" />
                                              <span>Aprovar</span>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <Card className="bg-slate-800 border-slate-600 rounded-lg p-6 border-none shadow-none">
                                                <CardHeader>
                                                  <span className="text-lg font-bold text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    Aprovar Solicitação
                                                  </span>
                                                </CardHeader>
                                                <CardContent>
                                                  <form
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      if (
                                                        selectedFiles.nfDevolucao &&
                                                        selectedFiles.recibo
                                                      ) {
                                                        AprovarSolicitacao(
                                                          s.id,
                                                          selectedFiles.nfDevolucao,
                                                          selectedFiles.recibo
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <FileUploadNFDevRecibo
                                                      onFilesChange={(files) =>
                                                        setSelectedFiles(files)
                                                      }
                                                      onValidationChange={(
                                                        isValid
                                                      ) =>
                                                        setFilesValid(isValid)
                                                      }
                                                    />
                                                    <Button
                                                      type="submit"
                                                      className={`w-full font-bold mt-4 ${
                                                        filesValid
                                                          ? "bg-green-600 hover:bg-green-700 text-white"
                                                          : "bg-slate-600 text-slate-400 cursor-not-allowed"
                                                      }`}
                                                      disabled={!filesValid}
                                                    >
                                                      {filesValid
                                                        ? "Aprovar Solicitação"
                                                        : "Selecione ambos os arquivos para aprovar"}
                                                    </Button>
                                                  </form>
                                                </CardContent>
                                              </Card>
                                            </DialogContent>
                                          </Dialog>
                                        )}

                                        {userPermissions.canRecusar && (
                                          <Dialog>
                                            <DialogTrigger className="flex items-center justify-center text-sm font-semibold gap-1 bg-red-600 hover:bg-red-700 cursor-pointer py-2 px-4 rounded-md">
                                              <XCircle className="h-4 w-4 mr-2" />
                                              <span>Recusar</span>
                                            </DialogTrigger>
                                            <DialogHeader>
                                              <DialogTitle></DialogTitle>
                                            </DialogHeader>
                                            <DialogContent>
                                              <Card className="bg-slate-800 border-slate-600 rounded-lg p-6 border-none shadow-none">
                                                <CardHeader>
                                                  <span className="text-lg font-bold text-red-400 flex items-center gap-2">
                                                    <XCircle className="h-5 w-5" />
                                                    Motivo da Recusa
                                                  </span>
                                                </CardHeader>
                                                <CardContent>
                                                  <Label className="text-slate-300 mb-2 block">
                                                    Digite o Motivo da Recusa:
                                                  </Label>
                                                  <Input
                                                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 mb-4"
                                                    placeholder="Descreva o motivo..."
                                                    value={motivoRecusa}
                                                    onChange={(e) =>
                                                      setMotivoRecusa(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <FileUploadNFDevRecibo
                                                    onFilesChange={(files) =>
                                                      setSelectedFiles(files)
                                                    }
                                                    onValidationChange={(
                                                      isValid
                                                    ) => setFilesValid(isValid)}
                                                  />
                                                  <Button
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold w-full mt-2"
                                                    onClick={() =>
                                                      RecusarSolicitacao(
                                                        s.id,
                                                        motivoRecusa
                                                      )
                                                    }
                                                    disabled={
                                                      motivoRecusa.trim() === ""
                                                    }
                                                  >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Recusar
                                                  </Button>
                                                </CardContent>
                                              </Card>
                                            </DialogContent>
                                          </Dialog>
                                        )}
                                      </>
                                    )}

                                    {s.status.toUpperCase() === "APROVADA" &&
                                      userPermissions.canDesdobrar && (
                                        <Button
                                          className="bg-blue-600 hover:bg-blue-700"
                                          onClick={() =>
                                            DesdobrarSolicitacao(s.id)
                                          }
                                        >
                                          <Target className="h-4 w-4 mr-2" />
                                          Desdobrar
                                        </Button>
                                      )}

                                    {s.status.toUpperCase() === "DESDOBRADA" &&
                                      userPermissions.canAbater && (
                                        <Button
                                          className="bg-yellow-600 hover:bg-yellow-700"
                                          onClick={() =>
                                            AbaterSolicitacao(s.id)
                                          }
                                        >
                                          <AlertTriangle className="h-4 w-4 mr-2" />
                                          Abater
                                        </Button>
                                      )}

                                    {s.status.toUpperCase() === "ABATIDA" &&
                                      userPermissions.canFinalizar && (
                                        <Button
                                          className="bg-lime-600 hover:bg-lime-700"
                                          onClick={() =>
                                            FinalizarSolicitacao(s.id)
                                          }
                                        >
                                          <Zap className="h-4 w-4 mr-2" />
                                          Finalizar
                                        </Button>
                                      )}

                                    {s.status.toUpperCase() === "RECUSADA" &&
                                      userPermissions.canReenviar && (
                                        <Button
                                          className="bg-orange-600 hover:bg-orange-700"
                                          onClick={() =>
                                            ReenviarSolicitacao(s.id)
                                          }
                                        >
                                          <RotateCcw className="h-4 w-4 mr-2" />
                                          Reenviar
                                        </Button>
                                      )}
                                  </div>
                                </div>

                                <DialogFooter>
                                  {s.arquivo_url && (
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                      <Download className="h-4 w-4 mr-2" />
                                      Baixar NF
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {s.arquivo_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:text-blue-400 hover:bg-blue-500/30 cursor-pointer"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-slate-400"
                      >
                        Nenhuma solicitação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        namePrevious="Primeira Página"
                        href="#"
                        onClick={() => setCurrentPage(1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        namePrevious="Anterior"
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {[...Array(endPage - startPage + 1)].map((_, i) => (
                      <PaginationItem key={i + startPage}>
                        <PaginationLink
                          className={
                            currentPage === i + startPage ? "bg-slate-400" : ""
                          }
                          href="#"
                          onClick={() => setCurrentPage(i + startPage)}
                        >
                          {i + startPage}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        nameNext="Próxima"
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        nameNext="Última Página"
                        href="#"
                        onClick={() => setCurrentPage(totalPages)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
