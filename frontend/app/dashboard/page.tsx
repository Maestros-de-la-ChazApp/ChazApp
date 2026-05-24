"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Shield } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la página
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirigir al login si no hay token
    }
    
    // Extraer el usuario si lo guardaste en el login
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail && storedEmail !== userEmail) {
      setUserEmail(storedEmail);
    }
  }, [router, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <main className="flex min-h-screen w-full mx-auto flex-col items-center">
        
      <header className="flex w-full items-center justify-between bg-primary-200 border-b border-gray-200 pb-4 mb-8">
        <div className="w-full max-w-[1280px] mx-auto items-center flex justify-between py-4">
          <div className="w-[100px] h-[100px] bg-white rounded-b-full absolute top-0 left-[100px] shadow-lg">
              <a href="https://unal.edu.co/" target="_blank" rel="noopener" className="icon-link">
                  <Image src="/assets/logo_unal_circle.png" alt="Escudo de UNAL" width={100} height={100} className="w-full h-full" />
              </a>
          </div>
        <div className="flex items-center gap-2 text-white">
          <Shield size={28} />
          <h1 className="text-xl font-bold font-sans">ChazApp — Menú Principal</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 border border-white text-white rounded-lg hover:bg-red-50 transition-all text-sm font-semibold"
          >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
        </div>
      </header>

      {/* Contenedor Principal */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aquí irán los módulos funcionales del Guardia o Administrador */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-2">Bienvenido, {userEmail || "Vigilante"}</h2>
          <p className="text-gray-600 text-sm">Selecciona una acción del menú para comenzar el control del campus.</p>
        </div>
      </div>
    </main>
  );
}