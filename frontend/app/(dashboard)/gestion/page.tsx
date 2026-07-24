"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Users, Store, ChevronRight, UserCheck, ShieldAlert } from "lucide-react";
import { IGestionPageProps } from "@/types";

import { isAdmin } from "@/utils/auth";
import { useEffect, useState } from "react";

export const GestionPage: FC<IGestionPageProps> = (props) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const menuItems = [
    {
      title: "Gestión de Chaceros",
      description: "Administra el personal, sus roles, facultades, y vinculación a los puntos de venta.",
      path: "/gestion/chaceros",
      icon: Users,
      color: "bg-primary-300/10 text-primary-200",
    },
    {
      title: "Gestión de Chazas",
      description: "Administra los locales comerciales, ubicaciones en el campus, carpas y permisos de cocina.",
      path: "/gestion/chazas",
      icon: Store,
      color: "bg-info-100 text-info-300",
    },
    {
      title: "Gestión de Reglas de Sanción",
      description: "Configura las reglas del semáforo de sanciones, duraciones y sanciones personalizadas.",
      path: "/gestion/reglas-sanciones",
      icon: ShieldAlert,
      color: "bg-red-100 text-red-500",
      adminOnly: true
    },
    {
      title: "Gestión de Usuarios",
      description: "Administra los usuarios del sistema, sus roles (Admin, Seguridad, Celador) y sus accesos.",
      path: "/gestion/usuarios",
      icon: UserCheck,
      color: "bg-purple-100 text-purple-300",
      adminOnly: true
    },
  ].filter((item) => !item.adminOnly || admin);

  return (
    <div className="flex flex-col gap-8 p-4 w-full max-w-5xl mx-auto text-left">
      <div>
        <h2 className="text-3xl font-black text-neutral-1000 font-sans tracking-tight">
          Panel de Gestión
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Selecciona una de las áreas de administración del ecosistema comercial.
        </p>
      </div>

      <div className={`grid grid-cols-1 ${admin ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"} gap-6 mt-2`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="group flex flex-col justify-between p-6 bg-white border border-neutral-200 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl flex-shrink-0 ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={28} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-1000 font-sans group-hover:text-primary-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end w-full mt-6 text-primary-200 font-semibold text-sm gap-1">
                <span>Ingresar</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GestionPage;
