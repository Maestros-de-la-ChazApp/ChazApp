"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus, X } from "lucide-react";
import { DynamicFormProps, FormField } from "@/types";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";
import { CARRERAS_POR_FACULTAD } from "@/constants";

interface EnhancedFormProps extends DynamicFormProps {
  onCancel?: () => void;
}

export const Form = ({
  title,
  subtitle2,
  fields,
  submitLabel,
  onSubmit,
  onCancel,
  isLoading = false
}: EnhancedFormProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [dynamicFields, setDynamicFields] = useState<FormField[]>(fields);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      if (name === "facultad") {
        updated["carrera"] = ""; 
        const facultadSeleccionada = value as string;
        
        setDynamicFields(
          fields.map((field) => {
            if (field.name === "carrera") {
              return {
                ...field,
                options: CARRERAS_POR_FACULTAD[facultadSeleccionada] || [],
              };
            }
            return field;
          })
        );
      }
      return updated;
    });
  };

  const checkScrollLimits = () => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowScrollUp(scrollTop > 2);
    setShowScrollDown(scrollTop + clientHeight < scrollHeight - 2);
  };

  useEffect(() => {
    setTimeout(checkScrollLimits, 100);
    window.addEventListener("resize", checkScrollLimits);
    return () => window.removeEventListener("resize", checkScrollLimits);
  }, [dynamicFields]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const formElement = e.currentTarget as HTMLFormElement;
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full bg-white px-5 py-6 md:p-8 rounded-tl-[40px] rounded-br-[40px] md:rounded-tl-[60px] md:rounded-br-[60px] rounded-tr-xl rounded-bl-xl max-w-md mx-auto flex flex-col gap-5 relative">
      
      <div className="text-left space-y-0.5">
        <h2 className="text-2xl font-black text-neutral-1000 font-sans tracking-tight leading-tight">{title}</h2>
        {subtitle2 && <p className="text-xs font-medium text-neutral-600">{subtitle2}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative" noValidate={false}>
        
        {showScrollUp && (
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-neutral-500/90 text-white rounded-full p-1 shadow-md">
              <ChevronUp size={16} />
            </div>
          </div>
        )}

        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollLimits}
          className="space-y-4 max-h-[55vh] overflow-y-auto px-1 py-2 scroll-smooth border-y border-neutral-100"
        >
          {dynamicFields.map((field) => {
            switch (field.type) {
              case "select":
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    options={field.options || []}
                    required={field.required}
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                );
              case "checkbox":
                return (
                  <Checkbox
                    key={field.name}
                    label={field.label}
                    checked={!!formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                  />
                );
              default:
                return (
                  <Input
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    pattern={field.pattern}
                    supportingText={field.supportingText}
                    infoTooltip={field.infoTooltip}
                    value={(formData[field.name] as string | number) || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                );
            }
          })}
        </div>

        {showScrollDown && (
          <div className="absolute bottom-14 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-neutral-500/90 text-white rounded-full p-1 shadow-md">
              <ChevronDown size={16} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-2 w-full">
          {onCancel && (
            <Button 
              type="button" 
              variant="danger" 
              shape="standard" 
              icon={X} 
              onClick={onCancel}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            shape="asymmetric" 
            icon={Plus} 
            isLoading={isLoading} 
            className="px-5 py-2"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};