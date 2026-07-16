"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Shield, QrCode } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const QrScannerModal = dynamic(() => import("@/components/QrScannerModal"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-black mb-2">Bienvenido, {userEmail || "Vigilante"}</h2>
            <p className="text-gray-600 text-sm">Selecciona una acción del menú para comenzar el control del campus.</p>
          </div>

          {/* Acceso Rápido QR (Solo visible en móviles) */}
          <div className="block md:hidden w-full border-t border-neutral-100 pt-4 mt-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-200 text-white font-bold rounded-tl-md rounded-tr-xl rounded-br-md rounded-bl-xl hover:bg-primary-200/90 transition shadow-sm"
            >
              <QrCode size={20} />
              Escanear QR de Chaza
            </button>
          </div>
        </div>
      </div>

      <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </main>
  );
}