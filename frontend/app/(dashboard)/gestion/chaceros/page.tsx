"use client";

import { FC, useState, useEffect } from "react";
import { IChacerosPageProps, FormField } from "@/types";
import { Plus, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";

import { FACULTADES_UNAL, ROLES_CHACEROS } from "@/constants";
import { GENERATED_CHACEROS } from "@/constants/mockData";

export const ChacerosPage: FC<IChacerosPageProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const savedPreference = localStorage.getItem("chaceros_items_per_page");
    if (savedPreference) {
      setItemsPerPage(Number(savedPreference));
    }
  }, []);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    localStorage.setItem("chaceros_items_per_page", String(size));
  };

  const handleRegisterSubmit = (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      alert("Chacero/a registrado con éxito.");
    }, 1000);
  };

  const fieldsConfig: FormField[] = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Ej. Juan", required: true },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Ej. Pérez", required: true },
    { name: "cedula", label: "Número de Cédula", type: "text", placeholder: "Documento de identidad", required: true, pattern: "^[0-9]{5,11}$" },
    { name: "email", label: "Correo Institucional", type: "email", placeholder: "usuario@unal.edu.co", required: true, pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$" },
    { name: "celular", label: "Número de Celular", type: "text", placeholder: "3XXXXXXXXX", required: true, pattern: "^3[0-9]{9}$" },
    { name: "facultad", label: "Facultad", type: "select", required: true, options: FACULTADES_UNAL },
    { name: "carrera", label: "Carrera", type: "select", required: true, options: [] },
    { name: "rol", label: "Rol del Chacero", type: "select", required: true, options: ROLES_CHACEROS },
    { name: "chazaEmailId", label: "Correo Institucional de la Chaza", type: "email", placeholder: "chaza@unal.edu.co", required: true, pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$" },
    { name: "amountChazas", label: "Cantidad de chazas en las que trabaja", type: "number", min: 1, max: 6, placeholder: "1-6", required: true }
  ];

  const chaceros = GENERATED_CHACEROS;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChaceros = chaceros.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">Chaceros</h2>
          <p className="text-sm text-neutral-600 mt-1">Administra el personal autorizado en el ecosistema.</p>
        </div>

        <Button variant="info" shape="asymmetric" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Agregar chacero/a
        </Button>
      </div>
        <div className="w-full flex flex-col gap-4">
        <ListContainer>
          {currentChaceros.map((chacero) => (
            <ListItem
              key={chacero.id}
              id={chacero.id}
              primaryText={chacero.nombreCompleto}
              secondaryText={chacero.correo}
              tertiaryText={chacero.rol}
              icon={CircleUserRound}
              onEdit={(id) => console.log(id)}
            />
          ))}
        </ListContainer>

        <Pagination
          totalItems={chaceros.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
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
      </div>      
    </div>
  );
};

export default ChacerosPage;