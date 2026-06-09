"use client";

import { InputHTMLAttributes, useState } from "react";
import { HelpCircle } from "lucide-react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  supportingText?: string;
  infoTooltip?: string;
}

export const Input = ({ label, supportingText, infoTooltip, type, className = "", required, ...props }: CustomInputProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full text-left relative">
      <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
        {label} {required && <span className="text-alert-300">*</span>}
      </label>
      
      <div className="relative flex items-center w-full">
        <input
          type={type}
          className={`w-full border border-neutral-400 bg-neutral-100/30 px-4 py-2.5 text-sm text-neutral-1000 placeholder-neutral-500 transition-all focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
          required={required}
          {...props}
        />
        
        {/* Renderizado condicional e inteligente del icono de información */}
        {infoTooltip && (
          <div className="absolute right-3 flex items-center justify-center">
            <HelpCircle 
              size={16} 
              className="text-primary-200 cursor-help transition-colors hover:text-primary-100"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute bottom-6 right-0 z-50 w-48 bg-neutral-1000 text-white text-[10px] p-2 rounded-lg shadow-lg font-normal leading-normal animate-fade-in">
                {infoTooltip}
              </div>
            )}
          </div>
        )}
      </div>
      
      {supportingText && <span className="text-[11px] text-neutral-600 px-1">{supportingText}</span>}
    </div>
  );
};