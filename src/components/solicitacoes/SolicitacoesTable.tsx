import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Solicitacao, SortColumn } from "@/types/solicitacao";
import { SolicitacoesTableHeader } from "./SolicitacoesTableHeader";
import { SolicitacaoTableRow } from "./SolicitacaoTableRow";

interface SolicitacoesTableProps {
  currentItems: Solicitacao[];
  totalSolicitacoes: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  sortColumns: SortColumn[];
  onSort: (column: string, direction: "asc" | "desc") => void;
  onClearSort: (column: string) => void;
  onPageChange: (page: number) => void;
  userPermissions: {
    canAprovar: boolean;
    canRecusar: boolean;
    canDesdobrar: boolean;
    canAbater: boolean;
    canFinalizar: boolean;
    canReenviar: boolean;
  };
}

export const SolicitacoesTable: React.FC<SolicitacoesTableProps> = ({
  currentItems,
  totalSolicitacoes,
  filteredCount,
  currentPage,
  totalPages,
  startPage,
  endPage,
  sortColumns,
  onSort,
  onClearSort,
  onPageChange,
  userPermissions,
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">
          Lista de Solicitações ({filteredCount})
        </CardTitle>
        <CardDescription className="text-slate-400">
          {filteredCount} de {totalSolicitacoes} solicitações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <SolicitacoesTableHeader
              sortColumns={sortColumns}
              onSort={onSort}
              onClearSort={onClearSort}
            />
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((solicitacao) => (
                  <SolicitacaoTableRow
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    userPermissions={userPermissions}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-slate-400"
                  >
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
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
                    onClick={() => onPageChange(1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    namePrevious="Anterior"
                    href="#"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                      onClick={() => onPageChange(i + startPage)}
                    >
                      {i + startPage}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    nameNext="Próxima"
                    href="#"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
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
                    onClick={() => onPageChange(totalPages)}
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
  );
};
