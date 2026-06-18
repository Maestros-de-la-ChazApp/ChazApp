"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { ScanLine, ChevronRight, AlertTriangle } from "lucide-react";
import { IControlPageProps } from "@/types";

export const ControlPage: FC<IControlPageProps> = (props) => {
  const router = useRouter();

  const menuItems = [
    {
      title: "Registro Ingreso/Salida",
      description: "Monitorea y registra el ingreso o la salida de los chaceros colaboradores en tiempo real.",
      path: "/control/ingreso-salida",
      icon: ScanLine,
      color: "bg-primary-300/10 text-primary-200",
    },
    {
      title: "Registrar Sanciones",
      description: "Aplica y gestiona las penalizaciones o sanciones a las chazas comerciales del campus.",
      path: "/control/sanciones",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-500",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 w-full max-w-5xl mx-auto text-left">
      <div className="border-b border-neutral-200 pb-4 w-full">
        <h2 className="text-3xl font-black text-neutral-1000 font-sans tracking-tight">
          Panel de Control
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Supervisa las operaciones comerciales y el control de asistencia del ecosistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
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

export default ControlPage;
