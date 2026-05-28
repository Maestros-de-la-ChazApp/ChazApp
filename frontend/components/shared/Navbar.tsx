"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, ScanLine, Database, Menu, ChevronLeft, LogOut, Settings, Store } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: "Inicio", path: "/dashboard", icon: LayoutDashboard },
    { name: "Control", path: "/control", icon: Store },
    { name: "Gestión", path: "/gestion", icon: Database },
    { name: "Ajustes", path: "/ajustes", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-gray-200 bg-primary-100 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive ? "text-primary-1000 font-bold" : "text-white hover:text-gray-900"
              }`}
            >
              <Icon size={22} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
      <aside
        className={`fixed bottom-0 top-0 left-0 z-50 hidden border-r border-gray-200 bg-white transition-all duration-300 md:flex flex-col ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Encabezado de la barra lateral */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          {isSidebarOpen && (
            <span className="text-lg font-bold text-black font-sans tracking-wide">ChazApp</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 mx-auto md:mx-0"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Elementos de Navegación */}
        <div className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary-300/10 text-primary-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon size={22} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
                {isSidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Botón de Salida */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Espaciador dinámico para el contenedor de las páginas en Desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isSidebarOpen ? "pl-64" : "pl-20"
        }`}
      />
    </>
  );
};