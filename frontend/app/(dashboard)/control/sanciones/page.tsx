"use client";

import { FC, useState, useEffect } from "react";
import { Plus, AlertTriangle, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { API_BASE_URL } from "@/constants";

const formatTime = (dateString: string | undefined): string => {
  if (!dateString) return "No disponible";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return dateString;
  }
};

export const SancionesPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [situaciones, setSituaciones] = useState<any[]>([]);
  const [chazasList, setChazasList] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Form states
  const [emailInput, setEmailInput] = useState("");
  const [filteredChazas, setFilteredChazas] = useState<any[]>([]);
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gestionRealizada, setGestionRealizada] = useState("");
  const [generoSancion, setGeneroSancion] = useState("false");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchChazas = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/chazas`, {
        headers: { Authorization: `Bearer ${token}` }
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

  const fetchSituaciones = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/situaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
          );
          setSituaciones(sorted);
        }
      }
    } catch (error) {
      console.error("Error fetching situaciones:", error);
    }
  };

  const resolveUserId = async () => {
    if (!token) return;
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const user = data.find((u) => u.email?.toLowerCase() === email.toLowerCase());
          if (user) {
            setCurrentUserId(user.id_usuario);
          }
        }
      }
    } catch (error) {
      console.error("Error resolving user id:", error);
    }
  };

  useEffect(() => {
    fetchChazas();
    fetchSituaciones();
    resolveUserId();
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

  const handleOpenModal = () => {
    setEmailInput("");
    setFilteredChazas([]);
    setLugar("");
    setDescripcion("");
    setGestionRealizada("");
    setGeneroSancion("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chaza = chazasList.find((c) => c.correoChacero === emailInput.trim());
    if (!chaza) {
      alert("Por favor, seleccione una chaza válida del autocompletado.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      id_chaza: chaza.idChaza || chaza.id_chaza,
      fecha_hora: null, // Let backend assign current time to prevent parsing errors
      lugar: lugar.trim(),
      descripcion: descripcion.trim(),
      gestion_realizada: gestionRealizada.trim(),
      genero_sancion: generoSancion === "true",
      id_usuario: currentUserId
    };

    console.log("Submitting situaciones payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/situaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Situación/Sanción registrada exitosamente.");
        setIsModalOpen(false);
        fetchSituaciones();
      } else {
        const errText = await response.text();
        console.error(`Backend error response (status ${response.status}):`, errText);
        let errMsg = `Error al registrar la situación (status ${response.status})`;
        try {
          const errObj = JSON.parse(errText);
          errMsg = errObj.message || errObj.error || errObj.messageStr || errMsg;
        } catch (e) {
          if (errText) errMsg = errText;
        }
        throw new Error(errMsg);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al registrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSituaciones = situaciones.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 w-full text-left">
        <div className="flex flex-col gap-1">
          <Link href="/control" className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-primary-200 transition-colors mb-1 w-fit">
            <ArrowLeft size={14} /> Volver a Control
          </Link>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">
            Sanciones y Reportes
          </h2>
          <p className="text-sm text-neutral-600">
            Visualice el historial de situaciones y aplique nuevas sanciones a los puestos de comercio.
          </p>
        </div>

        <Button
          variant="primary"
          shape="asymmetric"
          icon={Plus}
          onClick={handleOpenModal}
          className="w-full md:w-auto"
        >
          Registrar sanción
        </Button>
      </div>

      {/* Sanciones/Situaciones List */}
      <div className="w-full flex flex-col items-center gap-4">
        <ListContainer>
          {currentSituaciones.length > 0 ? (
            currentSituaciones.map((sit) => {
              const chaza = chazasList.find(
                (c) => c.idChaza === sit.id_chaza || c.idChaza === sit.idChaza
              );
              const nombreChaza = chaza ? chaza.nombreChaza : `Chaza #${sit.id_chaza}`;
              return (
                <ListItem
                  key={sit.id_situacion}
                  id={String(sit.id_situacion)}
                  primaryText={nombreChaza}
                  secondaryText={`${formatTime(sit.fecha_hora)} | Lugar: ${sit.lugar || "No especificado"}`}
                  tertiaryText={sit.genero_sancion ? "SANCIONADO" : "REPORTADO"}
                  icon={AlertTriangle}
                  rightElement={
                    <div className="flex flex-col text-right max-w-md hidden md:block">
                      <span className="text-xs font-semibold text-neutral-800 line-clamp-1">
                        Desc: {sit.descripcion}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium line-clamp-1 mt-0.5">
                        Gestión: {sit.gestion_realizada || "Ninguna"}
                      </span>
                    </div>
                  }
                />
              );
            })
          ) : (
            <div className="w-full py-8 text-center text-sm text-neutral-500 italic bg-white border border-neutral-200 rounded-tl-xl rounded-br-xl shadow-xs">
              No hay situaciones o sanciones registradas
            </div>
          )}
        </ListContainer>

        <Pagination
          totalItems={situaciones.length}
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
              Registrar Situación
            </h2>
            <p className="text-xs font-medium text-neutral-600">
              Reporte una anomalía o sanción relacionada a un puesto de comercio.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 relative">
            
            {/* Chaza Selector Autocomplete */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <Input
                label="Chaza a reportar"
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

            {/* Lugar */}
            <Input
              label="Lugar de la situación"
              type="text"
              placeholder="Ej. Entrada principal, pasillo..."
              required
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />

            {/* Descripcion */}
            <div className="flex flex-col gap-1 w-full text-left">
              <label className="text-xs font-bold text-neutral-800">
                Descripción <span className="text-alert-300">*</span>
              </label>
              <textarea
                placeholder="Describa lo sucedido..."
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-neutral-400 bg-neutral-100/30 px-4 py-2.5 text-sm text-neutral-1000 placeholder-neutral-500 transition-all focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm"
                rows={3}
              />
            </div>

            {/* Gestion realizada */}
            <div className="flex flex-col gap-1 w-full text-left">
              <label className="text-xs font-bold text-neutral-800">
                Gestión Realizada
              </label>
              <textarea
                placeholder="Indique las acciones tomadas..."
                value={gestionRealizada}
                onChange={(e) => setGestionRealizada(e.target.value)}
                className="w-full border border-neutral-400 bg-neutral-100/30 px-4 py-2.5 text-sm text-neutral-1000 placeholder-neutral-500 transition-all focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm"
                rows={2}
              />
            </div>

            {/* Genero Sancion */}
            <Select
              label="¿Generó Sanción?"
              required
              value={generoSancion}
              onChange={(e) => setGeneroSancion(e.target.value)}
              options={[
                { label: "Sí (Sancionar Chaza)", value: "true" },
                { label: "No (Reportar únicamente)", value: "false" }
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
                icon={AlertTriangle}
                isLoading={isSubmitting}
                className="flex-1! justify-center"
              >
                Registrar
              </Button>
            </div>

          </form>
        </div>
      </Modal>

    </div>
  );
};

export default SancionesPage;
