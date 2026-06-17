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

import {
  PRODUCTOS_CHAZA,
  ZONAS_CAMPUS,
  OPCIONES_COCINA
} from "@/constants";

export const ChazasPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedChaza, setSelectedChaza] = useState<any | null>(null);
  const [initialFormData, setInitialFormData] = useState<Record<string, unknown>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [chazas, setChazas] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const savedPreference =
      localStorage.getItem("chazas_items_per_page");

    if (savedPreference) {
      setItemsPerPage(Number(savedPreference));
    }

    fetch("http://localhost:8080/chazas", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => setChazas(data))
      .catch((error) => console.error(error));
  }, [token]);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);

    localStorage.setItem(
      "chazas_items_per_page",
      String(size)
    );
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedChaza(null);
    setInitialFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/chazas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener la chaza");
      const chaza = await response.json();

      const listTarget = chazas.find(c => c.idChaza === id);

      setModalMode("edit");
      setSelectedChaza(chaza);
      setInitialFormData({
        nombreChaza: chaza.nombre_chaza || "",
        emailPropietario: listTarget?.correoChacero || "",
        tipoProducto: chaza.producto || "",
        zonaCampus: chaza.ubicacion || "",
        cantidadCarpas: chaza.num_carpas || 1,
        cocinaCampus: chaza.tiene_cocina ? "Sí" : "No",
        observaciones: chaza.observaciones || ""
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los datos de la chaza.");
    }
  };

  const handleDeleteAction = async () => {
    if (!selectedChaza) return;
    const nombreChaza = selectedChaza.nombre_chaza || "esta chaza";
    if (confirm(`¿Desea eliminar definitivamente este registro (${nombreChaza})?`)) {
      try {
        const response = await fetch(
          `http://localhost:8080/chazas/${selectedChaza.id_chaza}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar la chaza");
        }

        const nuevasChazas = await fetch(
          "http://localhost:8080/chazas",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const listaActualizada = await nuevasChazas.json();
        setChazas(listaActualizada);

        setIsModalOpen(false);
        alert("Registro de chaza eliminado permanentemente.");
      } catch (error) {
        console.error(error);
        alert("Error al eliminar la chaza.");
      }
    }
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        const payload = {
          nombreChaza: data.nombreChaza,
          correoChacero: data.emailPropietario,
          producto: data.tipoProducto,
          ubicacion: data.zonaCampus,
          num_carpas: Number(data.cantidadCarpas),
          tiene_cocina: data.cocinaCampus === "Sí",
          observaciones: data.observaciones
        };

        const response = await fetch("http://localhost:8080/chazas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al registrar la chaza");
        }
      } else {
        const payload = {
          id_chaza: selectedChaza.id_chaza,
          id_chacero: selectedChaza.id_chacero,
          nombre_chaza: data.nombreChaza,
          qr_code: selectedChaza.qr_code,
          producto: data.tipoProducto,
          ubicacion: data.zonaCampus,
          num_carpas: Number(data.cantidadCarpas),
          tiene_cocina: data.cocinaCampus === "Sí",
          dentro: selectedChaza.dentro,
          suspendida: selectedChaza.suspendida,
          fecha_fin_sancion: selectedChaza.fecha_fin_sancion,
          observaciones: data.observaciones,
          fecha_registro: selectedChaza.fecha_registro
        };

        const response = await fetch(
          `http://localhost:8080/chazas/${selectedChaza.id_chaza}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar la chaza");
        }
      }

      const nuevasChazas = await fetch(
        "http://localhost:8080/chazas",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const listaActualizada = await nuevasChazas.json();
      setChazas(listaActualizada);

      setIsModalOpen(false);
      alert(
        modalMode === "create"
          ? "Chaza registrada con éxito."
          : "Chaza actualizada con éxito."
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al procesar la chaza."
      );
    } finally {
      setIsSubmitting(false);
    }
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
      pattern:
        "^[a-zA-Z0-9._%+\\-]+@unal\\.edu\\.co$"
    },
    {
      name: "tipoProducto",
      label:
        "¿Qué tipo de producto vende la chaza?",
      type: "select",
      required: true,
      options: PRODUCTOS_CHAZA
    },
    {
      name: "zonaCampus",
      label:
        "¿En qué zona del Campus se encuentra la chaza?",
      type: "select",
      required: true,
      options: ZONAS_CAMPUS
    },
    {
      name: "cantidadCarpas",
      label:
        "¿Cuántas carpas tiene el puesto?",
      type: "number",
      min: 1,
      max: 4,
      placeholder: "Ej. 1",
      required: true
    },
    {
      name: "cocinaCampus",
      label:
        "¿La chaza cocina dentro del campus?",
      type: "select",
      required: true,
      options: OPCIONES_COCINA
    },
    {
      name: "observaciones",
      label:
        "Notas u observaciones de la chaza",
      type: "textarea",
      placeholder:
        "Detalles adicionales sobre infraestructura o restricciones de horarios...",
      required: false
    }
  ];

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentChazas = chazas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 w-full text-left">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">
            Chazas
          </h2>

          <p className="text-sm text-neutral-600 mt-1">
            Administra los puestos de comercio
            autorizados dentro del campus.
          </p>
        </div>

        <Button
          variant="primary"
          shape="asymmetric"
          icon={Plus}
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto"
        >
          Agregar chaza
        </Button>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <ListContainer>
          {currentChazas.map((chaza) => (
            <ListItem
              key={chaza.idChaza}
              id={chaza.idChaza}
              primaryText={chaza.producto}
              secondaryText={
                chaza.nombreChacero
              }
              tertiaryText={chaza.ubicacion}
              icon={Store}
              onEdit={(id) => handleOpenEditModal(Number(id))}
            />
          ))}
        </ListContainer>

        <Pagination
          totalItems={chazas.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={
            handleItemsPerPageChange
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Form
          title={modalMode === "create" ? "Registro de Chazas" : "Editar Chaza"}
          subtitle2={modalMode === "create" ? "Establezca la ubicación, dimensiones y ofertas comerciales." : "Modifique los parámetros del puesto comercial."}
          fields={fieldsConfig}
          submitLabel={modalMode === "create" ? "Registrar punto" : "Actualizar"}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          onDelete={modalMode === "edit" ? handleDeleteAction : undefined}
          deleteLabel="Eliminar Chaza"
          initialData={initialFormData}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ChazasPage;