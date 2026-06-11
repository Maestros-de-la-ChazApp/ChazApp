// src/components/ui/Pagination.tsx
"use client";

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { PaginationProps } from "@/types";

export const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const options = [20, 50, 100, 200];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 select-none">
      <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
        <span>Mostrar</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-neutral-300 bg-white px-2 py-1 text-xs font-bold text-neutral-800 rounded-md focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>filas por página</span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft size={16} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} className="stroke-[2.5]" />
          </button>

        <span className="text-xs font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-md min-w-[80px] text-center">
          {currentPage} de {totalPages}
        </span>
        
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};