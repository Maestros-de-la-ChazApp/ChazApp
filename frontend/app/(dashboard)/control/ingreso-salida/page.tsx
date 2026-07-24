"use client";

import { FC, useState, useEffect } from "react";
import { LogIn, LogOut, ArrowLeftRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/types";
import { API_BASE_URL } from "@/constants";

const formatTime = (dateString: string | undefined): string => {
  if (!dateString) return "No disponible";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch (e) {
    return dateString;
  }
};

const getNormalizedTipo = (tipo: string | undefined): string => {
  if (!tipo) return "";
  const upper = tipo.toUpperCase();
  if (upper === "INGRESO" || upper === "ENTRADA") return "ENTRADA";
  if (upper === "SALIDA") return "SALIDA";
  return upper;
};

export const IngresoSalidaPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ingreso" | "salida">("ingreso");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [chazasList, setChazasList] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [emailInput, setEmailInput] = useState("");
  const [filteredChazas, setFilteredChazas] = useState<any[]>([]);
  const [porteria, setPorteria] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchChazas = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/chazas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setChazasList(data);
        }
      }
    } catch (error) {
      console.error("Error fetching chazas:", error);
    }
  };

  const fetchMovimientos = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/movimientos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Sort by date/time descending to show latest first
          const sorted = data.sort(
            (a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
          );
          setMovimientos(sorted);
        }
      }
    } catch (error) {
      console.error("Error fetching movimientos:", error);
    }
  };

  useEffect(() => {
    fetchMovimientos();
    fetchChazas();
  }, [token]);

  useEffect(() => {
    if (!emailInput.trim()) {
      setFilteredChazas([]);
      return;
    }
    const query = emailInput.toLowerCase();
    const matches = chazasList.filter(
      (c) =>
        c.correoChacero?.toLowerCase().includes(query) ||
        c.nombreChaza?.toLowerCase().includes(query)
    );
    setFilteredChazas(matches);
  }, [emailInput, chazasList]);

  const handleOpenModal = (mode: "ingreso" | "salida") => {
    setModalMode(mode);
    setEmailInput("");
    setFilteredChazas([]);
    setPorteria("");
    setIsModalOpen(true);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      alert("Por favor ingrese el correo de la chaza.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        correoChaza: emailInput.trim(),
        tipo: modalMode === "ingreso" ? "ENTRADA" : "SALIDA",
        porteria: porteria
      };

      const response = await fetch(`${API_BASE_URL}/movimientos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Error al registrar movimiento");
      }

      alert(`${modalMode === "ingreso" ? "Ingreso" : "Salida"} registrado exitosamente.`);
      setIsModalOpen(false);
      fetchMovimientos();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al registrar. Verifique el correo de la chaza.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldsConfig: FormField[] = [
    {
      name: "correoChaza",
      label: "Correo Institucional de la Chaza",
      type: "email",
      placeholder: "chaza@unal.edu.co",
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@unal\\.edu\\.co$"
    },
    {
      name: "porteria",
      label: "Portería de registro",
      type: "select",
      required: true,
      options: [
        { label: "Portería Calle 26", value: "Portería Calle 26" },
        { label: "Portería Calle 45", value: "Portería Calle 45" },
        { label: "Portería Carrera 30", value: "Portería Carrera 30" },
        { label: "Portería Calle 53", value: "Portería Calle 53" }
      ]
    }
  ];

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovimientos = movimientos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 w-full text-left">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">
            Registro Ingreso/Salida
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Gestione y visualice el ingreso y salida diario de puestos de comercio.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="primary"
            shape="asymmetric"
            icon={LogIn}
            onClick={() => handleOpenModal("ingreso")}
            className="flex-1 md:flex-initial"
          >
            Registrar ingreso
          </Button>
          <Button
            variant="outline"
            shape="standard"
            icon={LogOut}
            onClick={() => handleOpenModal("salida")}
            className="flex-1 md:flex-initial"
          >
            Registrar salida
          </Button>
        </div>
      </div>

      {/* Daily List */}
      <div className="w-full flex flex-col items-center gap-4">
        <ListContainer>
          {currentMovimientos.length > 0 ? (
            currentMovimientos.map((mov) => {
              const chaza = chazasList.find(
                (c) => c.idChaza === mov.id_chaza || c.idChaza === mov.idChaza
              );
              const nombreChaza = chaza ? chaza.nombreChaza : (mov.nombreChaza || mov.nombre_chaza || `Chaza #${mov.id_chaza}`);
              return (
                <ListItem
                  key={mov.id_movimiento}
                  id={String(mov.id_movimiento)}
                  primaryText={nombreChaza}
                  secondaryText={formatTime(mov.fecha_hora)}
                  tertiaryText={getNormalizedTipo(mov.tipo)}
                  icon={ArrowLeftRight}
                  rightElement={
                    <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-md">
                      {mov.porteria}
                    </span>
                  }
                />
              );
            })
          ) : (
            <div className="w-full py-8 text-center text-sm text-neutral-500 italic bg-white border border-neutral-200 rounded-tl-xl rounded-br-xl shadow-xs">
              No hay registros de movimientos para el día de hoy
            </div>
          )}
        </ListContainer>

        <Pagination
          totalItems={movimientos.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full bg-white px-5 py-6 md:p-8 rounded-tl-[40px] rounded-br-[40px] md:rounded-tl-[60px] md:rounded-br-[60px] rounded-tr-xl rounded-bl-xl max-w-md mx-auto flex flex-col gap-5 relative text-left">
          
          <div className="text-left space-y-0.5">
            <h2 className="text-2xl font-black text-neutral-1000 font-sans tracking-tight leading-tight">
              {modalMode === "ingreso" ? "Registrar Ingreso" : "Registrar Salida"}
            </h2>
            <p className="text-xs font-medium text-neutral-600">
              {modalMode === "ingreso"
                ? "Registre el ingreso del puesto comercial y su infraestructura."
                : "Registre la salida segura del puesto comercial."}
            </p>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 relative">
            
            {/* Autocomplete Email Input */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <Input
                label="Correo de la Chaza"
                type="email"
                placeholder="chaza@unal.edu.co"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              
              {filteredChazas.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 shadow-lg rounded-lg max-h-36 overflow-y-auto">
                  {filteredChazas.map((c) => (
                    <div
                      key={c.idChaza}
                      onClick={() => {
                        setEmailInput(c.correoChacero);
                        setFilteredChazas([]);
                      }}
                      className="px-3 py-2 text-xs text-neutral-1000 hover:bg-primary-300/10 cursor-pointer font-medium border-b border-neutral-100 last:border-none"
                    >
                      <div className="font-bold">{c.nombreChaza}</div>
                      <div className="text-[10px] text-neutral-500">{c.correoChacero}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Select Porteria */}
            <Select
              label="Portería de registro"
              required
              value={porteria}
              onChange={(e) => setPorteria(e.target.value)}
              options={[
                { label: "Portería Calle 26", value: "Portería Calle 26" },
                { label: "Portería Calle 45", value: "Portería Calle 45" },
                { label: "Portería Carrera 30", value: "Portería Carrera 30" },
                { label: "Portería Calle 53", value: "Portería Calle 53" }
              ]}
            />

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-4 w-full">
              <Button
                type="button"
                variant="outline"
                shape="standard"
                icon={X}
                onClick={() => setIsModalOpen(false)}
                className="flex-1! justify-center"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                shape="asymmetric"
                icon={modalMode === "ingreso" ? LogIn : LogOut}
                isLoading={isSubmitting}
                className="flex-1! justify-center"
              >
                {modalMode === "ingreso" ? "Registrar Ingreso" : "Registrar Salida"}
              </Button>
            </div>

          </form>

        </div>
      </Modal>

    </div>
  );
};

export default IngresoSalidaPage;
