"use client";

import { Pencil } from "lucide-react";
import { ListItemProps } from "@/types";

export const ListItem = ({
  id,
  primaryText,
  secondaryText,
  tertiaryText,
  icon: Icon,
  onEdit,
  rightElement
}: ListItemProps) => {
  return (
    <div className="w-full bg-white border border-neutral-200 px-4 py-3 flex items-center justify-between gap-4 transition-all hover:bg-neutral-100/50 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs shadow-xs">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="bg-primary-300/10 text-primary-200 p-2 rounded-lg flex-shrink-0">
            <Icon size={22} className="stroke-[2]" />
          </div>
        )}
        
        <div className="flex-1 min-w-0 text-left flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-neutral-1000 truncate" title={primaryText}>
              {primaryText}
            </h4>
            <p className="text-xs font-medium text-neutral-600 truncate" title={secondaryText}>
              {secondaryText}
            </p>
          </div>
          
          {tertiaryText && (
            <span className="text-[11px] font-bold text-primary-100 bg-primary-500/10 px-2.5 py-0.5 rounded-full w-fit mt-1 md:mt-0 flex-shrink-0 truncate max-w-[150px]">
              {tertiaryText}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {rightElement}
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-200 hover:text-neutral-1000 transition-all"
            title="Editar"
          >
            <Pencil size={18} className="stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};