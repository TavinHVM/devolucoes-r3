import { useState, useEffect } from "react";
import { Solicitacao, SortColumn } from "@/types/solicitacao";
import { filterTableHeader } from "@/utils/filters/filterTableHeader";
import { filterBySearch } from "@/utils/filters/filterBySearch";
import { filterByStatus } from "@/utils/filters/filterByStatus";
import { filterByDateRange } from "@/utils/filters/filterByDateRange";

export const useSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const itemsPerPage = 15;

  // Fetch solicitações
  const fetchSolicitacoes = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/getSolicitacoes", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      
      if (!response.ok) {
        throw new Error("Erro ao buscar os Solicitações.");
      }
      
      const data = await response.json();
      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro ao buscar os Solicitações:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  // Sorting functions
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumns((prev) => {
      const filtered = prev.filter((s) => s.column !== column);
      return [{ column, direction }, ...filtered];
    });
  };

  const handleClearSort = (column: string) => {
    setSortColumns((prev) => prev.filter((s) => s.column !== column));
  };

  // Apply sorting and filtering
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

  const dateFilteredSolicitacoes = filterByDateRange(filteredSolicitacoes, startDate, endDate);
  const finalSolicitacoes = filterByStatus(dateFilteredSolicitacoes, status);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = finalSolicitacoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(finalSolicitacoes.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - 7);
  const endPage = Math.min(totalPages, startPage + 14);

  return {
    // Data
    solicitacoes,
    currentItems,
    finalSolicitacoes,
    
    // Filter states
    status,
    setStatus,
    busca,
    setBusca,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    startPage,
    endPage,
    itemsPerPage,
    
    // Sorting
    sortColumns,
    handleSort,
    handleClearSort,
    
    // Loading
    refreshing,
    fetchSolicitacoes,
  };
};
