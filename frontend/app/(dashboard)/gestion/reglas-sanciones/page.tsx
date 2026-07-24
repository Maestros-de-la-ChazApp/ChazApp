"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Plus, Trash2, Check, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isAdmin } from "@/utils/auth";
import {
  getScheduleRules,
  saveScheduleRules,
  ScheduleRules,
  CustomSanctionRule,
  DEFAULT_CUSTOM_SANCTIONS
} from "@/utils/scheduleConfig";

export const ReglasSancionesPage: FC = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [scheduleRules, setScheduleRules] = useState<ScheduleRules>({
    entryStartHour: 6,
    entryEndHour: 9,
    exitMaxHour: 22,
    defaultSanctionDays: 7,
    entrySanctionType: "una_semana",
    exitSanctionType: "siguiente_jueves",
    unclosedSessionSanctionType: "una_semana",
    customSanctions: DEFAULT_CUSTOM_SANCTIONS
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for creating custom sanction
  const [customTitle, setCustomTitle] = useState("");
  const [customType, setCustomType] = useState<"days" | "weekday">("days");
  const [customDays, setCustomDays] = useState(3);
  const [customWeekday, setCustomWeekday] = useState(1); // 1 = Mon

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    setAdmin(true);
    setScheduleRules(getScheduleRules());
  }, [router]);

  const handleSaveConfig = () => {
    setIsSaving(true);
    saveScheduleRules(scheduleRules);
    setTimeout(() => {
      setIsSaving(false);
      alert("Reglas de sanciones actualizadas con éxito.");
    }, 600);
  };

  const handleAddCustomSanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      alert("Por favor ingrese el título de la sanción personalizada.");
      return;
    }

    const newRule: CustomSanctionRule = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      type: customType,
      daysCount: customType === "days" ? Number(customDays) : undefined,
      weekdayTarget: customType === "weekday" ? Number(customWeekday) : undefined
    };

    const updated = {
      ...scheduleRules,
      customSanctions: [...scheduleRules.customSanctions, newRule]
    };

    setScheduleRules(updated);
    saveScheduleRules(updated);
    setIsModalOpen(false);
    setCustomTitle("");
    setCustomDays(3);
    alert("Sanción personalizada creada exitosamente.");
  };

  const handleDeleteCustomSanction = (id: string) => {
    if (confirm("¿Desea eliminar esta regla de sanción personalizada?")) {
      const updated = {
        ...scheduleRules,
        customSanctions: scheduleRules.customSanctions.filter((c) => c.id !== id)
      };
      setScheduleRules(updated);
      saveScheduleRules(updated);
    }
  };

  const sanctionOptions = [
    { label: "🟢 Llamado de atención (Sin bloqueo)", value: "llamado_atencion" },
    { label: "🟡 Bloqueo del siguiente jueves", value: "siguiente_jueves" },
    { label: "🟠 Sanción de una semana (7 días)", value: "una_semana" },
    { label: "🔴 Bloqueo permanente", value: "permanente" },
    ...scheduleRules.customSanctions.map((c) => ({
      label: `⚙️ ${c.title} (${c.type === "days" ? `${c.daysCount} días` : `Próximo ${["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][ (c.weekdayTarget ?? 1) - 1]}`})`,
      value: c.id
    }))
  ];

  if (!admin) return null;

  return (
    <div className="flex flex-col gap-8 p-4 w-full max-w-5xl mx-auto text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 mb-1">
            <Link href="/gestion" className="hover:text-primary-200 flex items-center gap-1">
              <ArrowLeft size={14} /> Panel de Gestión
            </Link>
          </div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans tracking-tight">
            Gestión de Reglas de Sanciones
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Configura el semáforo de sanciones automáticas y gestiona penalizaciones personalizadas.
          </p>
        </div>

        <Button
          variant="primary"
          shape="asymmetric"
          icon={Check}
          isLoading={isSaving}
          onClick={handleSaveConfig}
        >
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semáforo de Sanciones (Left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card 1: Traffic Light Rules Info */}
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShieldAlert size={22} className="text-red-500" />
              <h3 className="text-base font-bold text-neutral-1000">Semáforo de Escala de Sanciones</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-green-900">Llamado de Atención</h4>
                  <p className="text-[11px] text-green-700 mt-0.5">Notificación formal sin bloqueo de ingreso al campus.</p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-yellow-900">Bloqueo Siguiente Jueves</h4>
                  <p className="text-[11px] text-yellow-700 mt-0.5">Se prohíbe el ingreso específicamente el próximo jueves.</p>
                </div>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-orange-900">Sanción de 1 Semana</h4>
                  <p className="text-[11px] text-orange-700 mt-0.5">Bloqueo por 7 días seguidos desde el día siguiente a la infracción.</p>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-red-900">Bloqueo Permanente</h4>
                  <p className="text-[11px] text-red-700 mt-0.5">Suspensión indefinida. Requiere levantamiento manual por Admin.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Schedule Configuration */}
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Clock size={20} className="text-primary-200" />
              <h3 className="text-base font-bold text-neutral-1000">Configuración de Horarios</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Hora Inicio de Ingreso (0-23 hrs)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={scheduleRules.entryStartHour}
                  onChange={(e) => setScheduleRules({ ...scheduleRules, entryStartHour: Number(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <p className="text-[10px] text-neutral-500">Ejemplo: 6 equivale a las 06:00 AM</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Hora Fin de Ingreso (0-23 hrs)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={scheduleRules.entryEndHour}
                  onChange={(e) => setScheduleRules({ ...scheduleRules, entryEndHour: Number(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <p className="text-[10px] text-neutral-500">Ejemplo: 9 equivale a las 09:00 AM</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Hora Límite de Salida (0-23 hrs)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={scheduleRules.exitMaxHour}
                  onChange={(e) => setScheduleRules({ ...scheduleRules, exitMaxHour: Number(e.target.value) })}
                  className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <p className="text-[10px] text-neutral-500">Ejemplo: 22 equivale a las 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Card 3: Automatic Infracction Mapping */}
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShieldAlert size={20} className="text-primary-200" />
              <h3 className="text-base font-bold text-neutral-1000">Asignación de Sanción para Infracciones Automáticas</h3>
            </div>

            <div className="space-y-4">
              <Select
                label="Sanción por Ingreso Fuera de Horario (Fuera de 6 a 9 AM)"
                value={scheduleRules.entrySanctionType}
                onChange={(e) => setScheduleRules({ ...scheduleRules, entrySanctionType: e.target.value })}
                options={sanctionOptions}
              />

              <Select
                label="Sanción por Salida Tardía (Pasadas las 10 PM)"
                value={scheduleRules.exitSanctionType}
                onChange={(e) => setScheduleRules({ ...scheduleRules, exitSanctionType: e.target.value })}
                options={sanctionOptions}
              />

              <Select
                label="Sanción por No Registrar Salida del Día Anterior"
                value={scheduleRules.unclosedSessionSanctionType}
                onChange={(e) => setScheduleRules({ ...scheduleRules, unclosedSessionSanctionType: e.target.value })}
                options={sanctionOptions}
              />
            </div>
          </div>
        </div>

        {/* Custom Sanctions List (Right 1 col) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-1000">Sanciones Personalizadas</h3>
              <Button
                variant="primary"
                shape="asymmetric"
                icon={Plus}
                onClick={() => setIsModalOpen(true)}
                className="text-xs! px-2.5! py-1!"
              >
                Nueva
              </Button>
            </div>

            <div className="flex flex-col gap-2.5">
              {scheduleRules.customSanctions.length > 0 ? (
                scheduleRules.customSanctions.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-900">{rule.title}</span>
                      <span className="text-[10px] font-medium text-neutral-500">
                        {rule.type === "days"
                          ? `Duración: ${rule.daysCount} días`
                          : `Bloqueo el próximo ${["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][(rule.weekdayTarget ?? 1) - 1]}`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCustomSanction(rule.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 italic text-center py-4">
                  No hay sanciones personalizadas creadas.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating Custom Sanction */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full bg-white p-6 rounded-2xl max-w-md mx-auto flex flex-col gap-4 text-left">
          <div className="space-y-1 border-b border-neutral-100 pb-3">
            <h3 className="text-xl font-bold text-neutral-1000">Crear Sanción Personalizada</h3>
            <p className="text-xs text-neutral-500">Define una regla de penalización a la medida para las chazas.</p>
          </div>

          <form onSubmit={handleAddCustomSanction} className="flex flex-col gap-4">
            <Input
              label="Título de la Sanción"
              placeholder="Ej: Infracción por Ruido Excesivo"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />

            <Select
              label="Modalidad de Duración"
              required
              value={customType}
              onChange={(e) => setCustomType(e.target.value as "days" | "weekday")}
              options={[
                { label: "Por número de días de suspensión", value: "days" },
                { label: "Por día de la semana específico (ej. Próximo Lunes)", value: "weekday" }
              ]}
            />

            {customType === "days" ? (
              <Input
                label="Cantidad de días de suspensión"
                type="number"
                min="1"
                max="365"
                required
                value={String(customDays)}
                onChange={(e) => setCustomDays(Number(e.target.value))}
              />
            ) : (
              <Select
                label="Día de la semana de bloqueo"
                required
                value={String(customWeekday)}
                onChange={(e) => setCustomWeekday(Number(e.target.value))}
                options={[
                  { label: "Próximo Lunes", value: "1" },
                  { label: "Próximo Martes", value: "2" },
                  { label: "Próximo Miércoles", value: "3" },
                  { label: "Próximo Jueves", value: "4" },
                  { label: "Próximo Viernes", value: "5" }
                ]}
              />
            )}

            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                shape="standard"
                onClick={() => setIsModalOpen(false)}
                className="flex-1! justify-center"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                shape="asymmetric"
                className="flex-1! justify-center"
              >
                Crear Sanción
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ReglasSancionesPage;
