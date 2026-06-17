"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanLine, BarChart3, ChevronRight, AlertTriangle } from "lucide-react";
import { IControlPageProps, FormField } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";

export const ControlPage: FC<IControlPageProps> = (props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuItems = [
    {
      title: "Registro Ingreso/Salida",
      description: "Monitorea y registra el ingreso o la salida de los chaceros colaboradores en tiempo real.",
      path: "/control/registro",
      icon: ScanLine,
      color: "bg-primary-300/10 text-primary-200",
    },
    {
      title: "Reportes y Estadísticas",
      description: "Genera reportes de asistencia, consolidados de horas trabajadas y estadísticas de cumplimiento.",
      path: "/control/reportes",
      icon: BarChart3,
      color: "bg-purple-100 text-purple-300",
    },
    {
      title: "Registrar Sanciones",
      description: "Aplica y gestiona las penalizaciones o sanciones a las chazas comerciales del campus.",
      action: () => setIsModalOpen(true),
      icon: AlertTriangle,
      color: "bg-red-50 text-red-500",
    },
  ];

  const fieldsConfig: FormField[] = [
    {
      name: "chazaEmail",
      label: "Correo Institucional de la Chaza",
      type: "email",
      placeholder: "chaza@unal.edu.co",
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$"
    },
    {
      name: "sancionTipo",
      label: "Tipo de sanción",
      type: "select",
      required: true,
      options: [
        { label: "Llamado de atención", value: "llamado_atencion" },
        { label: "No ingresa el siguiente jueves", value: "no_ingresa_jueves" },
        { label: "No ingresa una semana", value: "no_ingresa_semana" },
        { label: "Bloqueo indefinido", value: "bloqueo_indefinido" }
      ]
    }
  ];

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const val = data.sancionTipo as string;
      const option = fieldsConfig[1].options?.find(o => o.value === val);
      const sanctionLabel = option ? option.label : val;
      alert(`Sanción registrada exitosamente para la chaza: ${data.chazaEmail}\nTipo: ${sanctionLabel}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al registrar la sanción.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onClick={item.action ? item.action : () => router.push(item.path || "")}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          title="Registrar Sanción"
          subtitle2="Ingrese el correo de la chaza que desea sancionar."
          fields={fieldsConfig}
          submitLabel="Registrar Sanción"
          submitIcon={AlertTriangle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ControlPage;
