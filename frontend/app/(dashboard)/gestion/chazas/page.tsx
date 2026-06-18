"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/types";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";
import { DetailCard } from "@/components/ui/DetailCard";

import {
  PRODUCTOS_CHAZA,
  ZONAS_CAMPUS,
  OPCIONES_COCINA
} from "@/constants";

const getSanctionLabel = (sancion: string | undefined, id: number): string => {
  if (sancion) {
    switch (sancion.toLowerCase()) {
      case "llamado_atencion":
      case "llamado de atención":
        return "Llamado de atención";
      case "no_ingresa_jueves":
      case "no ingresa el siguiente jueves":
        return "No ingresa el siguiente jueves";
      case "no_ingresa_semana":
      case "no ingresa una semana":
        return "No ingresa una semana";
      case "bloqueo_indefinido":
      case "bloqueo indefinido":
        return "Bloqueo indefinido";
      default:
        return "Ok";
    }
  }
  const mockLabels = [
    "Ok",
    "Llamado de atención",
    "No ingresa el siguiente jueves",
    "No ingresa una semana",
    "Bloqueo indefinido"
  ];
  return mockLabels[id % mockLabels.length];
};

const getSanctionColor = (label: string): string => {
  switch (label) {
    case "Llamado de atención":
      return "bg-warning-200";
    case "No ingresa el siguiente jueves":
      return "bg-warning-300";
    case "No ingresa una semana":
      return "bg-alert-200";
    case "Bloqueo indefinido":
      return "bg-neutral-1000";
    default:
      return "bg-primary-300";
  }
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "No disponible";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch (e) {
    return dateString;
  }
};

export const ChazasPage: FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedChaza, setSelectedChaza] = useState<any | null>(null);
  const [initialFormData, setInitialFormData] = useState<Record<string, unknown>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [chazas, setChazas] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (viewId && chazas.length > 0) {
      const targetId = Number(viewId);
      if (!isNaN(targetId)) {
        handleOpenDetailModal(targetId);
      }
    }
  }, [viewId, chazas]);

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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching chazas: Status ${response.status} (${response.statusText})`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setChazas(data);
        } else {
          console.error("Data is not an array:", data);
          setChazas([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setChazas([]);
      });
  }, [token]);

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);

    localStorage.setItem(
      "chazas_items_per_page",
      String(size)
    );
  };

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailChaza, setDetailChaza] = useState<any | null>(null);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedChaza(null);
    setInitialFormData({});
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/chazas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener la chaza");
      const chaza = await response.json();

      const listTarget = chazas.find(c => c.idChaza === id);
      const ownerEmail = listTarget?.correoChacero || "";

      // Fetch all chaceros to filter the ones working in this chaza
      const chacerosResponse = await fetch("http://localhost:8080/chaceros", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let trabajadores: any[] = [];
      if (chacerosResponse.ok) {
        const chacerosList = await chacerosResponse.json();
        trabajadores = chacerosList.filter(
          (c: any) => c.chazaEmailId === ownerEmail && c.rolUniversitario?.toLowerCase() === "trabajador"
        );
      }

      setDetailChaza({
        ...chaza,
        nombreChacero: listTarget?.nombreChacero || "",
        correoChacero: ownerEmail,
        sancion: listTarget?.sancion || listTarget?.sancionTipo || listTarget?.estadoSancion,
        trabajadores: trabajadores
      });
      setIsDetailOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los detalles de la chaza.");
    }
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

  const currentChazas = Array.isArray(chazas)
    ? chazas.slice(indexOfFirstItem, indexOfLastItem)
    : [];

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
              primaryText={chaza.nombreChaza}
              secondaryText={
                chaza.nombreChacero
              }
              tertiaryText={chaza.ubicacion}
              icon={Store}
              onView={(id) => handleOpenDetailModal(Number(id))}
              rightElement={
                (() => {
                  const label = getSanctionLabel(chaza.sancion || chaza.sancionTipo || chaza.estadoSancion, chaza.idChaza);
                  return (
                    <div 
                      className={`w-3.5 h-3.5 rounded-full ${getSanctionColor(label)}`}
                      title={label}
                    />
                  );
                })()
              }
            />
          ))}
        </ListContainer>

        <Pagination
          totalItems={Array.isArray(chazas) ? chazas.length : 0}
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

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      >
        <DetailCard
          title={detailChaza?.nombre_chaza || "Detalles de la Chaza"}
          subtitle="Información completa del puesto comercial"
          icon={Store}
          onClose={() => setIsDetailOpen(false)}
          onEdit={detailChaza ? () => {
            setIsDetailOpen(false);
            handleOpenEditModal(detailChaza.id_chaza || detailChaza.idChaza);
          } : undefined}
          fields={detailChaza ? [
            { label: "Nombre de la chaza", value: detailChaza.nombre_chaza || detailChaza.nombreChaza, fullWidth: true },
            { label: "Estudiante Propietario", value: detailChaza.nombreChacero || "No especificado" },
            { label: "Correo Propietario", value: detailChaza.correoChacero || "No especificado" },
            { label: "Tipo de Producto", value: detailChaza.producto },
            { label: "Ubicación", value: detailChaza.ubicacion },
            { label: "Cantidad de Carpas", value: detailChaza.num_carpas || detailChaza.numCarpas },
            { label: "Cocina en el Campus", value: detailChaza.tiene_cocina || detailChaza.tieneCocina ? "Sí" : "No" },
            { 
              label: "Estado de Sanción", 
              value: (() => {
                const label = getSanctionLabel(detailChaza.sancion || detailChaza.sancionTipo || detailChaza.estadoSancion, detailChaza.idChaza || detailChaza.id_chaza);
                return (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3.5 h-3.5 rounded-full ${getSanctionColor(label)}`} />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                );
              })(),
              fullWidth: true
            },
            { 
              label: "Fecha de Registro", 
              value: formatDate(detailChaza.fecha_registro || detailChaza.fechaRegistro),
              fullWidth: true 
            },
            {
              label: "Chaceros que trabajan aquí",
              value: detailChaza.trabajadores && detailChaza.trabajadores.length > 0 ? (
                <div className="flex flex-col gap-1.5 mt-1.5 w-full">
                  {detailChaza.trabajadores.map((t: any) => (
                    <Link
                      key={t.id_chacero}
                      href={`/gestion/chaceros?view=${t.id_chacero}`}
                      className="flex items-center gap-2 bg-neutral-100/60 px-3 py-2 rounded-lg border border-neutral-200 hover:bg-primary-300/10 hover:border-primary-200 transition-all text-left w-full cursor-pointer group/worker"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary-200 group-hover/worker:bg-primary-300 transition-all" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-1000 group-hover/worker:text-primary-200 transition-all">{t.nombre} {t.apellido}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">{t.correoInstitucional}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-neutral-400 italic">No hay trabajadores asociados</span>
              ),
              fullWidth: true
            },
            { label: "Observaciones", value: detailChaza.observaciones, fullWidth: true }
          ] : []}
        />
      </Modal>
    </div>
  );
};

export default ChazasPage;