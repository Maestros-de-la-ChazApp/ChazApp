import { FormFieldOption } from "@/types";

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