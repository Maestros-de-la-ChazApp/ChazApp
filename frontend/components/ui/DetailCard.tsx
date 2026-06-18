"use client";

import { X, Pencil } from "lucide-react";
import { Button } from "./Button";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

export interface DetailCardProps {
  title: string;
  subtitle?: string;
  icon?: any;
  fields: DetailField[];
  onClose: () => void;
  onEdit?: () => void;
}

export const DetailCard = ({
  title,
  subtitle,
  icon: Icon,
  fields,
  onClose,
  onEdit
}: DetailCardProps) => {
  return (
    <div className="w-full bg-white px-5 py-6 md:p-8 rounded-tl-[40px] rounded-br-[40px] md:rounded-tl-[60px] md:rounded-br-[60px] rounded-tr-xl rounded-bl-xl max-w-md mx-auto flex flex-col gap-6 relative text-left">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="bg-primary-300/10 text-primary-200 p-2.5 rounded-xl flex-shrink-0">
              <Icon size={24} className="stroke-[2]" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-black text-neutral-1000 font-sans tracking-tight leading-tight truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-semibold text-neutral-500 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-1000 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1 py-1">
        {fields.map((field, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col gap-1 ${field.fullWidth ? "sm:col-span-2" : ""}`}
          >
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-wider">
              {field.label}
            </span>
            <div className="text-sm font-semibold text-neutral-1000 break-words">
              {field.value || <span className="text-neutral-400 italic">No especificado</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 mt-2">
        <Button 
          type="button" 
          variant="outline" 
          shape="standard" 
          icon={X} 
          onClick={onClose}
          className="flex-1! justify-center"
        >
          Cerrar
        </Button>
        {onEdit && (
          <Button 
            type="button" 
            variant="primary" 
            shape="asymmetric" 
            icon={Pencil} 
            onClick={onEdit}
            className="flex-1! justify-center"
          >
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};
