"use client";

import { InputHTMLAttributes } from "react";

interface CustomCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = ({ label, className = "", ...props }: CustomCheckboxProps) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none text-left py-1">
      <input
        type="checkbox"
        className={`h-5 w-5 rounded border-neutral-400 text-primary-200 focus:ring-primary-200 accent-primary-200 ${className}`}
        {...props}
      />
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
    </label>
  );
};