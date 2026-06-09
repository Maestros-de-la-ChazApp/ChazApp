"use client";

import { SelectHTMLAttributes } from "react";
import { FormFieldOption } from "@/types";

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: FormFieldOption[];
}

export const Select = ({ label, options, className = "", required, ...props }: CustomSelectProps) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <label className="text-xs font-bold text-neutral-800">
        {label} {required && <span className="text-alert-300">*</span>}
      </label>
      <select
        className={`w-full border border-neutral-400 bg-neutral-100/30 px-4 py-2.5 text-sm text-neutral-1000 transition-all focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm appearance-none ${className}`}
        required={required}
        {...props}
      >
        <option value="" disabled hidden>Seleccione una opción...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};