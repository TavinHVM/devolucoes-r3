import { ChevronUp, ChevronDown } from "lucide-react";
import { X } from 'lucide-react';

interface OrderBtnProps {
  label: string;
  columnKey: string;
  activeSort: { column: string; direction: "asc" | "desc" }[];
  onSort: (column: string, direction: "asc" | "desc") => void;
  onClearSort: (column: string) => void;
}

export default function OrderBtn({ label, columnKey, activeSort, onSort, onClearSort }: OrderBtnProps) {
  const sortObj = activeSort.find(s => s.column === columnKey);
  const isActive = !!sortObj;

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <span>{label}</span>
      <div className="flex flex-col">
        <ChevronUp
          className={`transition-all ${isActive && sortObj?.direction === "asc" ? "text-blue-400" : "hover:text-blue-500"}`}
          onClick={() => onSort(columnKey, "asc")}
          style={{ width: "15px", height: "15px", strokeWidth: "4px" }}
        />
        <ChevronDown
          className={`transition-all ${isActive && sortObj?.direction === "desc" ? "text-blue-400" : "hover:text-blue-500"}`}
          onClick={() => onSort(columnKey, "desc")}
          style={{ width: "15px", height: "15px", strokeWidth: "4px" }}
        />
        {isActive && (
          <button
            className="text-xs text-red-400 hover:text-red-600"
            onClick={() => onClearSort(columnKey)}
            style={{ fontSize: "10px", marginTop: "2px" }}
            title="Limpar ordenação"
          >
            <X className="cursor-pointer"/>
          </button>
        )}
      </div>
    </div>
  );
}