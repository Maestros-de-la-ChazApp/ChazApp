"use client";

import { FC, useState, useEffect } from "react";
import { FormField } from "@/types";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";

import { PRODUCTOS_CHAZA, ZONAS_CAMPUS, OPCIONES_COCINA } from "@/constants";
import { GENERATED_CHAZAS } from "@/constants/mockChazas";

export const ChazasPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const savedPreference = localStorage.getItem("chazas_items_per_page");
    if (savedPreference) {
      setItemsPerPage(Number(savedPreference));
    }
  }, []);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    localStorage.setItem("chazas_items_per_page", String(size));
  };

  const handleRegisterSubmit = (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      alert("Chaza registrada con éxito en el sistema.");
    }, 1000);
  };

  const fieldsConfig: FormField[] = [
    { 
      name: "nombreChaza", 
      label: "Nombre de la chaza", 
      type: "text", 
      placeholder: "Ej. Chaza El Informático", 
      required: true 
    },
    { 
      name: "emailPropietario", 
      label: "Correo del estudiante propietario", 
      type: "email", 
      placeholder: "propietario@unal.edu.co", 
      required: true, 
      pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$" 
    },
    { 
      name: "tipoProducto", 
      label: "¿Qué tipo de producto vende la chaza?", 
      type: "select", 
      required: true, 
      options: PRODUCTOS_CHAZA 
    },
    { 
      name: "zonaCampus", 
      label: "¿En qué zona del Campus se encuentra la chaza?", 
      type: "select", 
      required: true, 
      options: ZONAS_CAMPUS 
    },
    { 
      name: "cantidadCarpas", 
      label: "¿Cuántas carpas tiene el puesto?", 
      type: "number", 
      min: 1, 
      max: 4, 
      placeholder: "Ej. 1", 
      required: true 
    },
    { 
      name: "cocinaCampus", 
      label: "¿La chaza cocina dentro del campus?", 
      type: "select", 
      required: true, 
      options: OPCIONES_COCINA 
    },
    { 
      name: "observaciones", 
      label: "Notas u observaciones de la chaza", 
      type: "textarea", 
      placeholder: "Detalles adicionales sobre infraestructura o restricciones de horarios...", 
      required: false 
    }
  ];

  const chazas = GENERATED_CHAZAS;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChazas = chazas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 w-full text-left">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">Chazas</h2>
          <p className="text-sm text-neutral-600 mt-1">Administra los puestos de comercio autorizados dentro del campus.</p>
        </div>

        <Button variant="info" shape="asymmetric" icon={Plus} onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
          Agregar chaza
        </Button>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <ListContainer>
          {currentChazas.map((chaza) => (
            <ListItem
              key={chaza.id}
              id={chaza.id}
              primaryText={chaza.nombre}
              secondaryText={chaza.propietarioCorreo}
              tertiaryText={chaza.ubicacionLabel}
              icon={Store}
              onEdit={(id) => console.log("Editar chaza:", id)}
            />
          ))}
        </ListContainer>

        <Pagination
          totalItems={chazas.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          title="Registro de Chazas"
          subtitle2="Establezca la ubicación, dimensiones y ofertas comerciales del punto de venta."
          fields={fieldsConfig}
          submitLabel="Registrar punto"
          onSubmit={handleRegisterSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ChazasPage;