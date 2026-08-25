"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Shield, QrCode, LogIn, Store, ShieldAlert, TrendingUp, Building } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { API_BASE_URL } from "@/constants";

const QrScannerModal = dynamic(() => import("@/components/QrScannerModal"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Metrics states
  const [ingresosHoyCount, setIngresosHoyCount] = useState<number>(0);
  const [dentroCount, setDentroCount] = useState<number>(0);
  const [sancionadasCount, setSancionadasCount] = useState<number>(0);
  const [totalChazas, setTotalChazas] = useState<number>(0);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  const parseApiDate = (val: any): Date => {
    if (!val) return new Date(0);
    if (Array.isArray(val)) {
      return new Date(val[0], (val[1] || 1) - 1, val[2] || 1, val[3] || 0, val[4] || 0, val[5] || 0);
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la página
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirigir al login si no hay token
      return;
    }
    
    // Extraer el usuario si lo guardaste en el login
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail && storedEmail !== userEmail) {
      setUserEmail(storedEmail);
    }

    // Fetch dashboard metrics
    const fetchMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const [movRes, chazasRes] = await Promise.all([
          fetch(`${API_BASE_URL}/movimientos`, {
            headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" }
          }),
          fetch(`${API_BASE_URL}/chazas`, {
            headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" }
          })
        ]);

        if (chazasRes.ok) {
          const chazasData = await chazasRes.json();
          if (Array.isArray(chazasData)) {
            setTotalChazas(chazasData.length);
            
            // Count suspended or sanctioned chazas
            const sanctioned = chazasData.filter(
              (c: any) => c.suspendida === true || (c.fecha_fin_sancion && parseApiDate(c.fecha_fin_sancion) > new Date())
            );
            setSancionadasCount(sanctioned.length);

            // Count inside chazas if field available
            const inside = chazasData.filter((c: any) => c.dentro === true);
            setDentroCount(inside.length);
          }
        }

        if (movRes.ok) {
          const movData = await movRes.json();
          if (Array.isArray(movData)) {
            const today = new Date();
            const todayIngresos = movData.filter((m: any) => {
              const rawDate = m.fecha_hora || m.fechaHora;
              const movDate = parseApiDate(rawDate);
              const isToday =
                movDate.getFullYear() === today.getFullYear() &&
                movDate.getMonth() === today.getMonth() &&
                movDate.getDate() === today.getDate();
              
              const isEntrada =
                m.tipo?.toUpperCase() === "ENTRADA" ||
                m.tipo?.toUpperCase() === "INGRESO";

              return isToday && isEntrada;
            });

            setIngresosHoyCount(todayIngresos.length);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();

    const handleRefresh = () => fetchMetrics();
    window.addEventListener("movimiento_registrado", handleRefresh);
    return () => window.removeEventListener("movimiento_registrado", handleRefresh);
  }, [router, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const porcentajeIngreso = totalChazas > 0 ? Math.round((ingresosHoyCount / totalChazas) * 100) : 0;

  return (
    <main className="flex min-h-screen w-full mx-auto flex-col items-center p-4">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Welcome Banner */}
        <div className="bg-white p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black text-neutral-1000 font-sans tracking-tight">
              Bienvenido, {userEmail || "Vigilante"}
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              Panel general de control e métricas de ingreso al campus de la Universidad Nacional.
            </p>
          </div>

          {/* Acceso Rápido QR (Solo visible en móviles) */}
          <div className="block md:hidden w-full border-t border-neutral-100 pt-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-200 text-white font-bold rounded-tl-md rounded-tr-xl rounded-br-md rounded-bl-xl hover:bg-primary-200/90 transition shadow-sm"
            >
              <QrCode size={20} />
              Escanear QR de Chaza
            </button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="w-full text-left">
          <h3 className="text-lg font-bold text-neutral-1000 mb-3 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-200" />
            Métricas y Estado de Hoy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Ingresos de Hoy */}
            <div className="p-5 bg-white border-2 border-primary-200/30 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ingresos Hoy</span>
                <div className="p-2 bg-primary-300/10 text-primary-200 rounded-lg">
                  <LogIn size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-neutral-1000 font-sans">
                  {isLoadingMetrics ? "..." : ingresosHoyCount}
                </span>
                <span className="text-xs text-neutral-500 ml-2 font-medium">chazas ingresadas</span>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-primary-200 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(porcentajeIngreso, 100)}%` }}
                />
              </div>
            </div>

            {/* Card 2: En Campus */}
            <div className="p-5 bg-white border border-neutral-200 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Actualmente Dentro</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Store size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-neutral-1000 font-sans">
                  {isLoadingMetrics ? "..." : (dentroCount > 0 ? dentroCount : ingresosHoyCount)}
                </span>
                <span className="text-xs text-neutral-500 ml-2 font-medium">en el campus</span>
              </div>
              <p className="text-[11px] text-green-600 font-bold mt-3">● Estado activo hoy</p>
            </div>

            {/* Card 3: Chazas Sancionadas */}
            <div className="p-5 bg-white border border-neutral-200 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sancionadas</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <ShieldAlert size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-neutral-1000 font-sans">
                  {isLoadingMetrics ? "..." : sancionadasCount}
                </span>
                <span className="text-xs text-neutral-500 ml-2 font-medium">con sanción activa</span>
              </div>
              <p className="text-[11px] text-red-500 font-bold mt-3">Ingreso bloqueado</p>
            </div>

            {/* Card 4: Total Chazas */}
            <div className="p-5 bg-white border border-neutral-200 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Registradas</span>
                <div className="p-2 bg-neutral-100 text-neutral-700 rounded-lg">
                  <Building size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-neutral-1000 font-sans">
                  {isLoadingMetrics ? "..." : totalChazas}
                </span>
                <span className="text-xs text-neutral-500 ml-2 font-medium">en el sistema</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium mt-3">{porcentajeIngreso}% ingresadas hoy</p>
            </div>

          </div>
        </div>

      </div>

      <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </main>
  );
}