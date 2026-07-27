import { FormFieldOption } from "@/types";

export const API_BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost"
  ? "http://localhost:8080"
  : "http://3.145.80.179:8080";

export const PRODUCTOS_CHAZA: FormFieldOption[] = [
  { label: "Paquetes, Empanadas, arepas, pasteles", value: "paquetes_fritos" },
  { label: "Almuerzos empacados", value: "almuerzos" },
  { label: "Comida preparada Insitu", value: "comida_insitu" },
  { label: "Postres y frutas", value: "postres_frutas" },
  { label: "Bebidas preparadas o calientes", value: "bebidas" },
];

export const ZONAS_CAMPUS: FormFieldOption[] = [
  { label: "Pasillo 26. Diseño Gráfico y Lingüística hasta Sociología", value: "pasillo_26_diseno" },
  { label: "Posgrados Ciencias Humanas + Manuel Ancízar", value: "posgrados_humanas" },
  { label: "Ciencias Agrarias", value: "ciencias_agrarias" },
  { label: "Veterinaria", value: "veterinaria" },
  { label: "Pasillo entre CYT y Medicina", value: "pasillo_cyt_medicina" },
  { label: "Plaza CYT", value: "plaza_cyt" },
  { label: "Química - Aulas de ingeniería", value: "quimica_aulas" },
  { label: "FEM - Ingeniería", value: "fem_ingenieria" },
  { label: "Nuevo Edificio Derecho y CP", value: "derecho_cp" },
  { label: "Ciencias Económicas", value: "ciencias_economicas" },
  { label: "NEA - SINDU", value: "nea_sindu" },
  { label: "Carrera 30", value: "carrera_30" },
  { label: "Plaza Che", value: "plaza_che" },
  { label: "Andador Peatonal Cubierto (antigua torre enfermería)", value: "andador_enfermeria" },
  { label: "Registro y Matrícula - Whimpy", value: "registro_whimpy" },
  { label: "Pasillo de la 'Y'", value: "pasillo_y" },
  { label: "Derecho", value: "derecho" },
  { label: "Medicina", value: "medicina" },
  { label: "Odontología - Enfermería", value: "odontologia_enfermeria" },
  { label: "Ciencias Humanas", value: "ciencias_humanas" },
  { label: "Pasillo 26", value: "pasillo_26" },
];

export const OPCIONES_COCINA: FormFieldOption[] = [
  { label: "Sí", value: "si" },
  { label: "No", value: "no" },
];

export const FACULTADES_UNAL: FormFieldOption[] = [
  { label: "Artes", value: "artes" },
  { label: "Ciencias", value: "ciencias" },
  { label: "Ciencias Agrarias", value: "ciencias_agrarias" },
  { label: "Ciencias Económicas", value: "ciencias_economicas" },
  { label: "Ciencias Humanas", value: "ciencias_humanas" },
  { label: "Derecho, Ciencias Políticas y Sociales", value: "derecho_politica" },
  { label: "Enfermería", value: "enfermeria" },
  { label: "Ingeniería", value: "ingenieria" },
  { label: "Medicina", value: "medicina" },
  { label: "Medicina Veterinaria y Zootecnia", value: "veterinaria_zootecnia" },
  { label: "Odontología", value: "odontologia" },
];

export const ROLES_CHACEROS: FormFieldOption[] = [
  { label: "Propietario-Titular", value: "propietario_titular" },
  { label: "Socio-Propietario", value: "socio_propietario" },
  { label: "Trabajador", value: "trabajador" },
  { label: "Piloto", value: "piloto" },
];

export const CARRERAS_POR_FACULTAD: Record<string, FormFieldOption[]> = {
  artes: [
    { label: "Arquitectura", value: "arquitectura" },
    { label: "Artes Plásticas", value: "artes_plasticas" },
    { label: "Cine y Televisión", value: "cine_television" },
    { label: "Diseño Gráfico", value: "diseno_grafico" },
    { label: "Diseño Industrial", value: "diseno_industrial" },
    { label: "Música", value: "musica" },
    { label: "Música Instrumental", value: "musica_instrumental" },
  ],
  ciencias: [
    { label: "Biología", value: "biologia" },
    { label: "Ciencias de la Computación", value: "ciencias_computacion" },
    { label: "Estadística", value: "estadistica" },
    { label: "Farmacia", value: "farmacia" },
    { label: "Física", value: "fisica" },
    { label: "Geología", value: "geologia" },
    { label: "Matemáticas", value: "matematicas" },
    { label: "Química", value: "quimica" },
  ],
  ciencias_agrarias: [
    { label: "Ingeniería Agronómica", value: "ingenieria_agronomica" },
  ],
  ciencias_economicas: [
    { label: "Administración de Empresas", value: "administracion_empresas" },
    { label: "Contaduría Pública", value: "contaduria_publica" },
    { label: "Economía", value: "economia" },
  ],
  ciencias_humanas: [
    { label: "Antropología", value: "antropologia" },
    { label: "Español y Filología Clásica", value: "espanol_filologia" },
    { label: "Filología e Idiomas (Alemán, Inglés, Francés)", value: "filologia_idiomas" },
    { label: "Filosofía", value: "filosofia" },
    { label: "Geografía", value: "geografia" },
    { label: "Historia", value: "historia" },
    { label: "Lingüística", value: "linguistica" },
    { label: "Psicología", value: "psicologia" },
    { label: "Sociología", value: "sociologia" },
  ],
  derecho_politica: [
    { label: "Ciencia Política", value: "ciencia_politica" },
    { label: "Derecho", value: "derecho" },
  ],
  enfermeria: [
    { label: "Enfermería", value: "enfermeria" },
  ],
  ingenieria: [
    { label: "Ingeniería Agrícola", value: "ingenieria_agricola" },
    { label: "Ingeniería Civil", value: "ingenieria_civil" },
    { label: "Ingeniería de Sistemas y Computación", value: "ingenieria_sistemas" },
    { label: "Ingeniería Eléctrica", value: "ingenieria_electrica" },
    { label: "Ingeniería Electrónica", value: "ingenieria_electronica" },
    { label: "Ingeniería Industrial", value: "ingenieria_industrial" },
    { label: "Ingeniería Mecánica", value: "ingenieria_mecanica" },
    { label: "Ingeniería Mecatrónica", value: "ingenieria_mecatronica" },
    { label: "Ingeniería Química", value: "ingenieria_quimica" },
  ],
  medicina: [
    { label: "Fisioterapia", value: "fisioterapia" },
    { label: "Fonoaudiología", value: "fonoaudiologia" },
    { label: "Medicina", value: "medicina" },
    { label: "Nutrición y Dietética", value: "nutricion_dietetica" },
    { label: "Terapia Ocupacional", value: "terapia_occupacional" },
  ],
  veterinaria_zootecnia: [
    { label: "Medicina Veterinaria", value: "medicina_veterinaria" },
    { label: "Zootecnia", value: "zootecnia" },
  ],
  odontologia: [
    { label: "Odontología", value: "odontologia" },
  ],
};