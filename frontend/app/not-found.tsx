"use client";

import { useRouter } from "next/navigation";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white border border-neutral-200 p-8 md:p-12 max-w-md w-full shadow-lg rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl flex flex-col items-center gap-6 transition-all hover:shadow-xl">
        
        {/* Visual Graphic */}
        <div className="bg-primary-300/10 text-primary-200 p-5 rounded-full animate-bounce">
          <Compass size={48} className="stroke-[2]" />
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-neutral-1000 font-sans tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-neutral-800 font-sans">
            Página No Encontrada
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-xs mx-auto">
            La chaza o el recurso al que intentas acceder no está disponible o ha cambiado de ubicación en el campus.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
          <Button
            variant="outline"
            shape="standard"
            icon={ArrowLeft}
            onClick={() => router.back()}
            className="w-full sm:w-auto px-5 py-2.5"
          >
            Regresar
          </Button>
          
          <Button
            variant="primary"
            shape="asymmetric"
            icon={Home}
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto px-6 py-2.5"
          >
            Ir al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
