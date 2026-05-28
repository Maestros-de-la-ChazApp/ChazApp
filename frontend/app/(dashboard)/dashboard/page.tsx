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
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-2">Bienvenido, {userEmail || "Vigilante"}</h2>
          <p className="text-gray-600 text-sm">Selecciona una acción del menú para comenzar el control del campus.</p>
        </div>
      </div>
    </main>
  );
}