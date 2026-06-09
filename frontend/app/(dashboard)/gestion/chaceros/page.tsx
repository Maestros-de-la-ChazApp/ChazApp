"use client";

import { FC, useState } from "react";
import { IChacerosPageProps, FormField } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";

import { FACULTADES_UNAL, ROLES_CHACEROS } from "@/constants";

export const ChacerosPage: FC<IChacerosPageProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Matriz con reglas estricta de correspondencia y Regex
  const fieldsConfig: FormField[] = [
    { 
      name: "nombre", 
      label: "Nombre", 
      type: "text", 
      placeholder: "Ej. Juan", 
      required: true 
    },
    { 
      name: "apellido", 
      label: "Apellido", 
      type: "text", 
      placeholder: "Ej. Pérez", 
      required: true 
    },
    { 
      name: "cedula", 
      label: "Número de Cédula", 
      type: "text", // Cambiado a text para soportar la validación exacta de patrón numérico largo
      placeholder: "Documento de identidad", 
      required: true,
      pattern: "^[0-9]{5,11}$", // Cédulas válidas en Colombia (de 5 a 11 dígitos)
      infoTooltip: "Ingrese su número de documento sin puntos, comas ni espacios."
    },
    { 
      name: "email", 
      label: "Correo Institucional", 
      type: "email", 
      placeholder: "usuario@unal.edu.co", 
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$", // Obliga terminación @unal.edu.co
      infoTooltip: "Debe corresponder a una cuenta institucional activa de la Universidad Nacional."
    },
    { 
      name: "celular", 
      label: "Número de Celular", 
      type: "text", 
      placeholder: "3XXXXXXXXX", 
      required: true,
      pattern: "^3[0-9]{9}$", // Estándar celular colombiano: empieza por 3 y tiene 10 dígitos totales
      infoTooltip: "Número de contacto móvil de 10 dígitos (Ej: 3001234567)."
    },
    { 
      name: "facultad", 
      label: "Facultad", 
      type: "select", 
      required: true, 
      options: FACULTADES_UNAL 
    },
    { 
      name: "carrera", 
      label: "Carrera", 
      type: "select", 
      required: true, 
      options: [], // Inicia vacío; el componente Form se encarga de poblarlo reactivamente
      infoTooltip: "Seleccione primero una facultad para visualizar los programas de pregrado disponibles."
    },
    { 
      name: "rol", 
      label: "Rol del Chacero", 
      type: "select", 
      required: true, 
      options: ROLES_CHACEROS 
    },
    { 
      name: "chazaEmailId", 
      label: "Correo Institucional de la Chaza", 
      type: "email", 
      placeholder: "chaza_ejemplo@unal.edu.co", 
      required: true, 
      pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$",
      infoTooltip: "ID único del puesto de comercio registrado en el sistema institucional." 
    },
    { 
      name: "cantidadChazas", 
      label: "Cantidad de chazas en las que trabaja", 
      type: "number", 
      min: 1, 
      max: 6, 
      placeholder: "Rango de 1 a 6", 
      required: true,
      infoTooltip: "Por normatividad, un colaborador solo puede estar asignado a un rango máximo de 6 chazas simultáneamente."
    }
  ];

  const handleRegisterSubmit = (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    
    // Como 'data' usa 'unknown', para leer sus propiedades de forma ultra-estricta en TS 
    // puedes parsearlo o enviarlo directo a la petición JSON
    console.log("Payload seguro para la API de Java:", data);
    
    setTimeout(() => {
        setIsSubmitting(false);
        setIsModalOpen(false);
        alert("Chacero/a guardado correctamente de forma segura.");
    }, 1000);
    };

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">Chaceros</h2>
          <p className="text-sm text-neutral-600 mt-1">Esta es la página de los chaceros</p>
        </div>

        <Button
          variant="info"
          shape="asymmetric"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="shadow-sm"
        >
          Agregar chacero/a
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          title="Registro de Chaceros"
          subtitle2="Ingrese las credenciales del colaborador de la chaza."
          fields={fieldsConfig}
          submitLabel="Registrar"
          onSubmit={handleRegisterSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs min-h-[150px] flex items-center justify-center">
        <p className="text-neutral-500 text-sm font-medium">
          Listado y base de datos de chaceros activa. Presiona el botón superior para agregar un registro.
        </p>
      </div>
    </div>
  );
};

export default ChacerosPage;