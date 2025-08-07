import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderBtn from "@/components/orderBtn";
import { SortColumn } from "@/types/solicitacao";

interface SolicitacoesTableHeaderProps {
  sortColumns: SortColumn[];
  onSort: (column: string, direction: "asc" | "desc") => void;
  onClearSort: (column: string) => void;
}

export const SolicitacoesTableHeader: React.FC<SolicitacoesTableHeaderProps> = ({
  sortColumns,
  onSort,
  onClearSort,
}) => {
  return (
    <TableHeader>
      <TableRow className="border-slate-700 hover:bg-slate-700/30">
        <TableHead className="text-slate-300">
          <OrderBtn
            label="ID"
            columnKey="id"
            activeSort={sortColumns}
            onSort={onSort}
            onClearSort={onClearSort}
          />
        </TableHead>
        <TableHead className="text-slate-300">
          <OrderBtn
            label="Nome Cliente"
            columnKey="nome"
            activeSort={sortColumns}
            onSort={onSort}
            onClearSort={onClearSort}
          />
        </TableHead>
        <TableHead className="text-slate-300">
          <OrderBtn
            label="Código Cliente"
            columnKey="cod_cliente"
            activeSort={sortColumns}
            onSort={onSort}
            onClearSort={onClearSort}
          />
        </TableHead>
        <TableHead className="text-slate-300">
          <OrderBtn
            label="NF"
            columnKey="numero_nf"
            activeSort={sortColumns}
            onSort={onSort}
            onClearSort={onClearSort}
          />
        </TableHead>
        <TableHead className="text-slate-300">Código RCA</TableHead>
        <TableHead className="text-slate-300">Tipo</TableHead>
        <TableHead className="text-slate-300">
          <OrderBtn
            label="Data"
            columnKey="created_at"
            activeSort={sortColumns}
            onSort={onSort}
            onClearSort={onClearSort}
          />
        </TableHead>
        <TableHead className="text-slate-300">Status</TableHead>
      </TableRow>
    </TableHeader>
  );
};
