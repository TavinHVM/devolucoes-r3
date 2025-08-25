import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ExcluirSolicitacoes } from "@/utils/solicitacoes/botoesSolicitacoes";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  onRefreshList?: () => void;
  userPermissions: {
    canAprovar: boolean;
    canRecusar: boolean;
    canDesdobrar: boolean;
    canAbater: boolean;
    canFinalizar: boolean;
    canReenviar: boolean;
  canDelete?: boolean;
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
  onRefreshList,
  userPermissions,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const allOnPageSelected =
    currentItems.length > 0 &&
    currentItems.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = Array.from(new Set([...selectedIds, ...currentItems.map((s) => s.id)]));
      setSelectedIds(ids);
    } else {
      const ids = selectedIds.filter((id) => !currentItems.some((s) => s.id === id));
      setSelectedIds(ids);
    }
  };

  const toggleRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((i) => i !== id)
    );
  };

  const handleBulkDelete = async () => {
    try {
      if (!selectedIds.length) return;
      setDeleting(true);
      await ExcluirSolicitacoes(selectedIds);
      setSelectedIds([]);
      toast.success(selectedIds.length === 1 ? "Solicitação excluída com sucesso" : "Solicitações excluídas com sucesso");
      onRefreshList?.();
      setConfirmOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao excluir";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-white">
            Lista de Solicitações ({filteredCount})
          </CardTitle>
          <CardDescription className="text-slate-400">
            {filteredCount} de {totalSolicitacoes} solicitações
          </CardDescription>
        </div>
        {userPermissions.canDelete && (
          <div className="mt-2">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              disabled={!selectedIds.length}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Excluir selecionadas ({selectedIds.length})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Confirm Delete Dialog */}
        {userPermissions.canDelete && (
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Confirmar exclusão"
            description={
              <span>
                Tem certeza que deseja excluir {selectedIds.length} solicitação{selectedIds.length !== 1 ? "(ões)" : ""}? Esta ação não pode ser desfeita.
              </span>
            }
            confirmText={`Excluir${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
            cancelText="Cancelar"
            onConfirm={handleBulkDelete}
            loading={deleting}
          />
        )}
        <div className="overflow-x-auto">
          <Table>
            <SolicitacoesTableHeader
              sortColumns={sortColumns}
              onSort={onSort}
              onClearSort={onClearSort}
              allSelected={allOnPageSelected}
              onToggleSelectAll={toggleSelectAll}
              showSelection={!!userPermissions.canDelete}
            />
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((solicitacao) => (
                  <SolicitacaoTableRow
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    userPermissions={userPermissions}
                    onRefreshList={onRefreshList}
                    selected={selectedIds.includes(solicitacao.id)}
                    onToggleSelected={toggleRow}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={userPermissions.canDelete ? 10 : 9} className="text-center py-8 text-slate-400">
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
                    onClick={() =>
                      onPageChange(Math.min(currentPage + 1, totalPages))
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
