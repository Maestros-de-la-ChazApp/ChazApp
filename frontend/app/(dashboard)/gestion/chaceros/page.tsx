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

export const ChacerosPage: FC<IChacerosPageProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedChacero, setSelectedChacero] = useState<any | null>(null);
  const [initialFormData, setInitialFormData] = useState<Record<string, unknown>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [chaceros, setChaceros] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const savedPreference = localStorage.getItem(
      "chaceros_items_per_page"
    );

    if (savedPreference) {
      setItemsPerPage(Number(savedPreference));
    }

    fetch("http://localhost:8080/chaceros", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => setChaceros(data))
      .catch((error) => console.error(error));
  }, [token]);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    localStorage.setItem(
      "chaceros_items_per_page",
      String(size)
    );
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedChacero(null);
    setInitialFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: number) => {
    const target = chaceros.find((c) => c.id_chacero === id);
    if (!target) return;

    setModalMode("edit");
    setSelectedChacero(target);
    setInitialFormData({
      nombre: target.nombre || "",
      apellido: target.apellido || "",
      cedula: target.cedula || "",
      email: target.correoInstitucional || "",
      celular: target.telefono || "",
      facultad: target.facultad || "",
      carrera: target.carrera || "",
      rol: target.rolUniversitario || "",
      chazaEmailId: target.chazaEmailId || "",
      amountChazas: 1
    });
    setIsModalOpen(true);
  };

  const handleDeleteAction = async () => {
    if (!selectedChacero) return;
    const nombreCompleto = `${selectedChacero.nombre} ${selectedChacero.apellido}`;
    if (
      confirm(
        `¿Desea eliminar definitivamente este registro (${nombreCompleto})?`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/chaceros/${selectedChacero.id_chacero}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar chacero");
        }

        const nuevosChaceros = await fetch(
          "http://localhost:8080/chaceros",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const listaActualizada = await nuevosChaceros.json();
        setChaceros(listaActualizada);

        setIsModalOpen(false);
        alert("Registro eliminado permanentemente.");
      } catch (error) {
        console.error(error);
        alert("Error al eliminar el registro.");
      }
    }
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      const payload = {
        nombre: data.nombre,
        apellido: data.apellido,
        cedula: data.cedula,
        correoInstitucional: data.email,
        telefono: data.celular,
        facultad: data.facultad,
        carrera: data.carrera,
        rolUniversitario: data.rol,
        chazaEmailId: data.chazaEmailId
      };

      const url =
        modalMode === "create"
          ? "http://localhost:8080/chaceros"
          : `http://localhost:8080/chaceros/${selectedChacero.id_chacero}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${
            modalMode === "create" ? "registrar" : "actualizar"
          } chacero`
        );
      }

      const nuevosChaceros = await fetch(
        "http://localhost:8080/chaceros",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const listaActualizada = await nuevosChaceros.json();
      setChaceros(listaActualizada);

      setIsModalOpen(false);
      alert(
        modalMode === "create"
          ? "Chacero/a registrado con éxito."
          : "Chacero/a actualizado con éxito."
      );
    } catch (error) {
      console.error(error);
      alert(
        `Error al ${
          modalMode === "create" ? "registrar" : "actualizar"
        } chacero.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      type: "text",
      placeholder: "Documento de identidad",
      required: true,
      pattern: "^[0-9]{5,11}$"
    },
    {
      name: "email",
      label: "Correo Institucional",
      type: "email",
      placeholder: "usuario@unal.edu.co",
      required: true,
      pattern:
        "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$"
    },
    {
      name: "celular",
      label: "Número de Celular",
      type: "text",
      placeholder: "3XXXXXXXXX",
      required: true,
      pattern: "^3[0-9]{9}$"
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
      options: []
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
      placeholder: "chaza@unal.edu.co",
      required: true,
      pattern:
        "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$"
    },
    {
      name: "amountChazas",
      label:
        "Cantidad de chazas en las que trabaja",
      type: "number",
      min: 1,
      max: 6,
      placeholder: "1-6",
      required: true
    }
  ];

  const indexOfLastItem =
    currentPage * itemsPerPage;
  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentChaceros = chaceros.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-3xl font-black text-neutral-1000 font-sans">
              Chaceros
            </h2>

            <p className="text-sm text-neutral-600 mt-1">
              Administra el personal autorizado en
              el ecosistema.
            </p>
          </div>

          <Button
            variant="primary"
            shape="asymmetric"
            icon={Plus}
            onClick={handleOpenCreateModal}
          >
            Agregar chacero/a
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4">
          <ListContainer>
            {currentChaceros.map((chacero) => (
              <ListItem
                key={chacero.id_chacero}
                id={chacero.id_chacero}
                primaryText={`${chacero.nombre} ${chacero.apellido}`}
                secondaryText={
                  chacero.correoInstitucional
                }
                tertiaryText={
                  chacero.rolUniversitario
                }
                icon={CircleUserRound}
                onEdit={(id) => handleOpenEditModal(Number(id))}
              />
            ))}
          </ListContainer>

          <Pagination
            totalItems={chaceros.length}
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
            title={modalMode === "create" ? "Registro de Chaceros" : "Editar Chacero/a"}
            subtitle2={modalMode === "create" ? "Ingrese las credenciales del colaborador de la chaza." : "Modifique los parámetros del registro de personal."}
            fields={fieldsConfig}
            submitLabel={modalMode === "create" ? "Registrar" : "Actualizar"}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            onDelete={modalMode === "edit" ? handleDeleteAction : undefined}
            deleteLabel="Eliminar Registro"
            initialData={initialFormData}
            isLoading={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ChacerosPage;