"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus, X, Trash2 } from "lucide-react";
import { DynamicFormProps, FormField } from "@/types";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";
import { CARRERAS_POR_FACULTAD } from "@/constants";

interface EnhancedFormProps extends DynamicFormProps {
  onCancel?: () => void;
  initialData?: Record<string, unknown>;
  onDelete?: () => void;
  deleteLabel?: string;
  submitIcon?: any;
}

export const Form = ({
  title,
  subtitle2,
  fields,
  submitLabel,
  onSubmit,
  onCancel,
  initialData,
  onDelete,
  deleteLabel = "Eliminar",
  submitIcon: SubmitIcon = Plus,
  isLoading = false
}: EnhancedFormProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});
  const [dynamicFields, setDynamicFields] = useState<FormField[]>(fields);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.facultad) {
        const facultadSeleccionada = initialData.facultad as string;
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
      } else {
        setDynamicFields(fields);
      }
    } else {
      setFormData({});
      setDynamicFields(fields);
    }
  }, [initialData, fields]);

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
              case "multiselect":
                const selectedValues = (formData[field.name] as string[]) || [];
                return (
                  <div key={field.name} className="flex flex-col gap-1.5 text-left w-full">
                    <label className="text-xs font-bold text-neutral-800">
                      {field.label} {field.required && <span className="text-alert-300">*</span>}
                    </label>
                    <div className="flex flex-col gap-2 bg-neutral-100/30 border border-neutral-400 p-3 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm max-h-40 overflow-y-auto">
                      {field.options?.map((opt) => {
                        const isChecked = selectedValues.includes(String(opt.value));
                        return (
                          <label key={opt.value} className="flex items-center gap-2.5 text-sm text-neutral-1000 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let newValues = [...selectedValues];
                                if (e.target.checked) {
                                  newValues.push(String(opt.value));
                                } else {
                                  newValues = newValues.filter((v) => v !== String(opt.value));
                                }
                                handleChange(field.name, newValues);
                              }}
                              className="w-4 h-4 accent-primary-200 border-neutral-400 rounded focus:ring-primary-200"
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
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

        <div className="flex flex-col gap-3 mt-4 w-full">
          {/* Row 1: Cancel and Submit */}
          <div className="flex items-center gap-3 w-full">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                shape="standard" 
                icon={X} 
                onClick={onCancel}
                className="flex-1! justify-center"
              >
                Cancelar
              </Button>
            )}
            
            <Button 
              type="submit" 
              variant="primary" 
              shape="asymmetric" 
              icon={SubmitIcon} 
              isLoading={isLoading} 
              className={`${onCancel ? "flex-1!" : "w-full!"} justify-center`}
            >
              {submitLabel}
            </Button>
          </div>

          {/* Row 2: Delete */}
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              shape="standard"
              icon={Trash2}
              onClick={onDelete}
              className="w-full! justify-center"
            >
              {deleteLabel}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};