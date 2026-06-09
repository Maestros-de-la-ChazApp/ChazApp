"use client";

import { useEffect } from "react";
import { ModalProps } from "@/types";

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 md:p-4 animate-fade-in">
      {/* Contenedor adaptivo estilizado */}
      <div className="relative bg-white w-full max-w-lg rounded-tl-[40px] rounded-br-[40px] md:rounded-tl-[60px] md:rounded-br-[60px] rounded-tr-xl rounded-bl-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-1">
          {children}
        </div>
      </div>
    </div>
  );
};