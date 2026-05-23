export interface City {
  id: string;
  slug: string;
  name: string;
  event_von: string;
  event_bis: string;
  event_datum: string | null;
}

export interface TeamMember {
  id: string;
  city_id: string;
  name: string;
  rolle: string;
  kategorie: string;
  telefon: string;
  email: string;
  status: string;
  whatsapp: boolean;
  notizen: string;
  foto_url: string;
  sort_order: number;
}

export interface ScheduleSlot {
  id: string;
  city_id: string;
  von: string;
  bis: string;
  typ: string;
  track: string;
  speaker: string;
  thema: string;
  sort_order: number;
}

export interface BarcampSlot {
  id: string;
  city_id: string;
  room: number;
  von: string;
  bis: string;
  speaker: string;
  thema: string;
  beschreibung: string;
  sort_order: number;
}

export interface BarcampRoom {
  id: string;
  city_id: string;
  room: number;
  name: string;
}

export const CATS_ALL = [
  'Technik', 'Video', 'Fotograf', 'Catering', 'Security',
  'Helfer', 'Moderation', 'Dekoration', 'Social Media',
];

export const CAT_COLORS: Record<string, { bg: string; dot: string }> = {
  leadership: { bg: '#EEEDFE', dot: '#7F77DD' },
  Technik: { bg: '#FAEEDA', dot: '#EF9F27' },
  Video: { bg: '#E6F1FB', dot: '#378ADD' },
  Fotograf: { bg: '#fce8f3', dot: '#e040a0' },
  Catering: { bg: '#E1F5EE', dot: '#1D9E75' },
  Security: { bg: '#FCEBEB', dot: '#E24B4A' },
  Helfer: { bg: '#F1EFE8', dot: '#888780' },
  Moderation: { bg: '#fce8f3', dot: '#e040a0' },
  Dekoration: { bg: '#FAEEDA', dot: '#BA7517' },
  'Social Media': { bg: '#EEEDFE', dot: '#AFA9EC' },
};

export const SCHEDULE_COLORS: Record<string, { bg: string; fg: string }> = {
  'Begrüßung': { bg: '#D3D1C7', fg: '#2C2C2A' },
  'Speaker': { bg: '#B5D4F4', fg: '#042C53' },
  'Pitch-Block': { bg: '#fce8f3', fg: '#b0307a' },
  'Netzwerk-Pause': { bg: '#9FE1CB', fg: '#04342C' },
  'Workshop': { bg: '#FAEEDA', fg: '#854F0B' },
  'Fotoshooting': { bg: '#fce8f3', fg: '#72243E' },
  'Abschluss': { bg: '#D3D1C7', fg: '#2C2C2A' },
};

export const KATEGORIE_OPTIONS = [
  { value: 'leadership', label: 'Kern-Leitung' },
  { value: 'Technik', label: 'Technik' },
  { value: 'Video', label: 'Video' },
  { value: 'Fotograf', label: 'Fotograf' },
  { value: 'Catering', label: 'Catering' },
  { value: 'Security', label: 'Security' },
  { value: 'Helfer', label: 'Helfer vor Ort' },
  { value: 'Moderation', label: 'Moderation' },
  { value: 'Dekoration', label: 'Dekoration' },
  { value: 'Social Media', label: 'Social Media' },
];

export const TYP_OPTIONS = [
  'Begrüßung', 'Speaker', 'Pitch-Block', 'Netzwerk-Pause',
  'Workshop', 'Fotoshooting', 'Abschluss',
];
