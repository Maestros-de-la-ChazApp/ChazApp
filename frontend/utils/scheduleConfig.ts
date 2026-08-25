import { API_BASE_URL } from "@/constants";

export interface CustomSanctionRule {
  id: string;
  title: string;
  type: "days" | "weekday";
  daysCount?: number;
  weekdayTarget?: number; // 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday
}

export interface ScheduleRules {
  entryStartHour: number; // e.g. 6 (06:00 AM)
  entryEndHour: number;   // e.g. 9 (09:00 AM)
  exitMaxHour: number;    // e.g. 22 (10:00 PM)
  defaultSanctionDays: number; // e.g. 7
  entrySanctionType: string; // e.g. "una_semana"
  exitSanctionType: string;  // e.g. "siguiente_jueves"
  unclosedSessionSanctionType: string; // e.g. "una_semana"
  customSanctions: CustomSanctionRule[];
}

export const DEFAULT_CUSTOM_SANCTIONS: CustomSanctionRule[] = [
  { id: "custom-1", title: "Suspensión de 3 días por ruido", type: "days", daysCount: 3 },
  { id: "custom-2", title: "Bloqueo del próximo Lunes", type: "weekday", weekdayTarget: 1 }
];

export const DEFAULT_SCHEDULE_RULES: ScheduleRules = {
  entryStartHour: 6,
  entryEndHour: 9,
  exitMaxHour: 22,
  defaultSanctionDays: 7,
  entrySanctionType: "una_semana",
  exitSanctionType: "siguiente_jueves",
  unclosedSessionSanctionType: "una_semana",
  customSanctions: DEFAULT_CUSTOM_SANCTIONS
};

export const getScheduleRules = (): ScheduleRules => {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE_RULES;
  try {
    const saved = localStorage.getItem("schedule_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        entryStartHour: parsed.entryStartHour ?? DEFAULT_SCHEDULE_RULES.entryStartHour,
        entryEndHour: parsed.entryEndHour ?? DEFAULT_SCHEDULE_RULES.entryEndHour,
        exitMaxHour: parsed.exitMaxHour ?? DEFAULT_SCHEDULE_RULES.exitMaxHour,
        defaultSanctionDays: parsed.defaultSanctionDays ?? DEFAULT_SCHEDULE_RULES.defaultSanctionDays,
        entrySanctionType: parsed.entrySanctionType ?? DEFAULT_SCHEDULE_RULES.entrySanctionType,
        exitSanctionType: parsed.exitSanctionType ?? DEFAULT_SCHEDULE_RULES.exitSanctionType,
        unclosedSessionSanctionType: parsed.unclosedSessionSanctionType ?? DEFAULT_SCHEDULE_RULES.unclosedSessionSanctionType,
        customSanctions: parsed.customSanctions ?? DEFAULT_SCHEDULE_RULES.customSanctions
      };
    }
  } catch (e) {
    console.error("Error reading schedule config:", e);
  }
  return DEFAULT_SCHEDULE_RULES;
};

export const saveScheduleRules = (rules: ScheduleRules): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("schedule_config", JSON.stringify(rules));
};

export const fetchScheduleRulesFromApi = async (token?: string | null): Promise<ScheduleRules | null> => {
  try {
    const headers: Record<string, string> = { "ngrok-skip-browser-warning": "true" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/configuracion-horarios`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const config = data[0];
        const localRules = getScheduleRules();
        const updatedRules: ScheduleRules = {
          ...localRules,
          entryStartHour: config.horaInicioIngreso ?? localRules.entryStartHour,
          entryEndHour: config.horaFinIngreso ?? localRules.entryEndHour,
          exitMaxHour: config.horaLimiteSalida ?? localRules.exitMaxHour,
        };
        saveScheduleRules(updatedRules);
        return updatedRules;
      }
    }
  } catch (e) {
    console.error("Error fetching schedule rules from API:", e);
  }
  return null;
};

export const saveScheduleRulesToApi = async (rules: ScheduleRules, token?: string | null): Promise<boolean> => {
  saveScheduleRules(rules);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/configuracion-horarios`, { headers });
    let existingId: number | null = null;
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        existingId = data[0].idConfiguracion;
      }
    }

    const payload = {
      horaInicioIngreso: rules.entryStartHour,
      horaFinIngreso: rules.entryEndHour,
      horaLimiteSalida: rules.exitMaxHour,
    };

    if (existingId) {
      await fetch(`${API_BASE_URL}/configuracion-horarios/${existingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ idConfiguracion: existingId, ...payload }),
      });
    } else {
      await fetch(`${API_BASE_URL}/configuracion-horarios`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    }
    return true;
  } catch (e) {
    console.error("Error saving schedule rules to API:", e);
    return false;
  }
};

export interface ValidationResult {
  isValid: boolean;
  requiresSanction: boolean;
  reason?: string;
  sanctionDescription?: string;
}

/**
 * Calculates end date for a given sanction type
 */
export const calculateSanctionEndDate = (
  sanctionType: string,
  customRules: CustomSanctionRule[] = [],
  fromDate: Date = new Date()
): Date | null => {
  const normalized = sanctionType.toLowerCase();

  if (normalized === "ninguna" || normalized === "llamado_atencion" || normalized === "llamado de atención") {
    return null; // Warning only, no block
  }

  if (normalized === "permanente" || normalized === "bloqueo_indefinido" || normalized === "bloqueo indefinido") {
    return new Date("2099-12-31T23:59:59");
  }

  if (normalized === "una_semana" || normalized === "sanción de una semana") {
    // 7 days starting tomorrow
    const endDate = new Date(fromDate);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }

  if (normalized === "siguiente_jueves" || normalized === "no ingresa el siguiente jueves") {
    const endDate = new Date(fromDate);
    const currentDay = endDate.getDay(); // 0 = Sunday, 4 = Thursday
    let daysUntilThursday = (4 - currentDay + 7) % 7;
    if (daysUntilThursday === 0) daysUntilThursday = 7; // If today is Thursday, block next Thursday
    endDate.setDate(endDate.getDate() + daysUntilThursday);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }

  // Check custom sanction rules
  const custom = customRules.find((c) => c.id === sanctionType || c.title.toLowerCase() === normalized);
  if (custom) {
    if (custom.type === "days" && custom.daysCount) {
      const endDate = new Date(fromDate);
      endDate.setDate(endDate.getDate() + custom.daysCount);
      endDate.setHours(23, 59, 59, 999);
      return endDate;
    }
    if (custom.type === "weekday" && custom.weekdayTarget !== undefined) {
      const endDate = new Date(fromDate);
      const currentDay = endDate.getDay();
      let target = custom.weekdayTarget; // 1 = Mon, 2 = Tue, ...
      let diff = (target - currentDay + 7) % 7;
      if (diff === 0) diff = 7;
      endDate.setDate(endDate.getDate() + diff);
      endDate.setHours(23, 59, 59, 999);
      return endDate;
    }
  }

  // Default fallback: 7 days
  const endDate = new Date(fromDate);
  endDate.setDate(endDate.getDate() + 7);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

/**
 * Validates entry movement time against configured schedule
 */
export const validateEntrySchedule = (now: Date = new Date()): ValidationResult => {
  const rules = getScheduleRules();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const timeInDecimal = currentHour + currentMinutes / 60;

  if (timeInDecimal < rules.entryStartHour || timeInDecimal > rules.entryEndHour) {
    const formatHour = (h: number) => `${String(h).padStart(2, '0')}:00`;
    return {
      isValid: false,
      requiresSanction: true,
      reason: `Ingreso fuera del horario permitido (${formatHour(rules.entryStartHour)} - ${formatHour(rules.entryEndHour)}).`,
      sanctionDescription: `Ingreso fuera de horario registrado a las ${now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}.`
    };
  }

  return { isValid: true, requiresSanction: false };
};

/**
 * Validates exit movement time against configured schedule
 */
export const validateExitSchedule = (now: Date = new Date()): ValidationResult => {
  const rules = getScheduleRules();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const timeInDecimal = currentHour + currentMinutes / 60;

  if (timeInDecimal > rules.exitMaxHour) {
    const formatHour = (h: number) => `${String(h).padStart(2, '0')}:00`;
    return {
      isValid: false,
      requiresSanction: true,
      reason: `Salida fuera del horario permitido (máximo hasta las ${formatHour(rules.exitMaxHour)}).`,
      sanctionDescription: `Salida extemporánea registrada pasadas las ${formatHour(rules.exitMaxHour)} (${now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}).`
    };
  }

  return { isValid: true, requiresSanction: false };
};
