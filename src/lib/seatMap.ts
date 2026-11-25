import type { Seat, SeatMap, SeatMapPayload, SeatShapeType, SeatStatus, SeatStatusDelta } from '@/types/dashboard';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DraftSection extends Rect {
  key: string;
  label: string;
  ticket_type_id: string | null;
}

export interface DraftSeat extends Rect {
  key: string;
  sectionKey: string | null;
  label: string;
  row_label: string | null;
  seat_number: number | null;
  ticket_type_id: string | null;
  status: 'available' | 'blocked';
}

export interface DraftShape extends Rect {
  key: string;
  type: SeatShapeType;
  label: string;
  rotation: number;
  color: string;
}

export interface SeatMapDraft {
  width: number;
  height: number;
  sections: DraftSection[];
  seats: DraftSeat[];
  shapes: DraftShape[];
}

/** Elemen denah yang lazim di venue, dengan ukuran dan warna awal. */
export const SHAPE_PRESETS: Record<SeatShapeType, { name: string; label: string; width: number; height: number; color: string }> = {
  stage: { name: 'Panggung', label: 'PANGGUNG', width: 480, height: 120, color: '#09090B' },
  standing: { name: 'Area berdiri', label: 'FESTIVAL', width: 360, height: 220, color: '#FFD9BF' },
  entrance: { name: 'Pintu masuk', label: 'MASUK', width: 120, height: 44, color: '#8DE2BD' },
  exit: { name: 'Pintu keluar', label: 'KELUAR', width: 120, height: 44, color: '#FFA4B8' },
  booth: { name: 'FOH / sound', label: 'FOH', width: 140, height: 90, color: '#27272A' },
  toilet: { name: 'Toilet', label: 'WC', width: 100, height: 80, color: '#A1A1AA' },
  bar: { name: 'Bar / F&B', label: 'BAR', width: 160, height: 70, color: '#F1C875' },
  text: { name: 'Teks', label: 'Label', width: 180, height: 40, color: '#09090B' },
  rect: { name: 'Kotak', label: '', width: 160, height: 100, color: '#E4E4E7' },
  circle: { name: 'Lingkaran', label: '', width: 120, height: 120, color: '#E4E4E7' },
};

/** Palet cepat untuk warna kelas tiket dan elemen. */
export const COLOR_SWATCHES = ['#FF4D00', '#FF7A00', '#F1C875', '#8DE2BD', '#5EC8F2', '#9B8CFF', '#FFA4B8', '#09090B'];

/** Warna teks yang terbaca di atas warna latar (#RRGGBB). */
export function readableText(background: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(background.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? '#09090B' : '#FFFFFF';
}

/** Kursi tersedia memakai warna kelas tiketnya; status lain tetap memakai warna status. */
export function seatFill(status: SeatStatus, ticketColor: string | null | undefined, statusColors: Record<SeatStatus, string>) {
  return status === 'available' && ticketColor ? ticketColor : statusColors[status];
}

export const DEFAULT_MAP_SIZE = { width: 1600, height: 1000 };
export const SEAT_SIZE = 28;
const SEAT_GAP = 8;
const SECTION_PADDING = 16;
const SECTION_HEADER = 36;

let sequence = 0;
/** Kunci sementara untuk area/kursi baru sebelum disimpan backend. */
export const tempKey = () => `new-${++sequence}`;

/** 0 → A, 25 → Z, 26 → AA. */
export function rowLabel(index: number): string {
  const letter = String.fromCharCode(65 + (index % 26));
  return index < 26 ? letter : rowLabel(Math.floor(index / 26) - 1) + letter;
}

export function uniqueLabel(taken: string[], base: string) {
  const used = new Set(taken);
  let n = 1;
  while (used.has(`${base} ${n}`)) n += 1;
  return `${base} ${n}`;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Geser kotak agar tetap berada di dalam kanvas. */
export function clampRect<T extends Rect>(rect: T, bounds: { width: number; height: number }): T {
  return { ...rect, x: Math.round(clamp(rect.x, 0, bounds.width - rect.width)), y: Math.round(clamp(rect.y, 0, bounds.height - rect.height)) };
}

export function toDraft(map: SeatMap | null): SeatMapDraft {
  if (!map) return { ...DEFAULT_MAP_SIZE, sections: [], seats: [], shapes: [] };
  return {
    width: map.width,
    height: map.height,
    sections: map.sections.map(({ id, label, ticket_type_id, x, y, width, height }) => ({
      key: String(id), label, ticket_type_id: ticket_type_id ? String(ticket_type_id) : null, x, y, width, height,
    })),
    seats: map.seats.map((seat) => ({
      key: String(seat.id),
      sectionKey: seat.section_id ? String(seat.section_id) : null,
      label: seat.label,
      row_label: seat.row_label,
      seat_number: seat.seat_number,
      ticket_type_id: seat.ticket_type_id ? String(seat.ticket_type_id) : null,
      x: seat.x,
      y: seat.y,
      width: seat.width,
      height: seat.height,
      // Editor hanya mengatur tersedia/diblokir; held/sold dikelola reservasi.
      status: seat.status === 'blocked' ? 'blocked' : 'available',
    })),
    shapes: (map.shapes ?? []).map(({ id, type, label, x, y, width, height, rotation, color }) => ({
      key: String(id), type, label: label ?? '', x, y, width, height, rotation, color: color ?? SHAPE_PRESETS[type].color,
    })),
  };
}

export function toPayload(draft: SeatMapDraft): SeatMapPayload {
  const labels = new Map(draft.sections.map((section) => [section.key, section.label]));
  return {
    width: draft.width,
    height: draft.height,
    sections: draft.sections.map(({ label, ticket_type_id, x, y, width, height }, index) => ({
      label, ...(ticket_type_id && { ticket_type_id }), x, y, width, height, sort_order: index,
    })),
    seats: draft.seats.map((seat) => ({
      label: seat.label,
      ...(seat.sectionKey && labels.has(seat.sectionKey) && { section_label: labels.get(seat.sectionKey) }),
      ...(seat.ticket_type_id && { ticket_type_id: seat.ticket_type_id }),
      ...(seat.row_label && { row_label: seat.row_label }),
      ...(seat.seat_number && { seat_number: seat.seat_number }),
      x: seat.x,
      y: seat.y,
      width: seat.width,
      height: seat.height,
      status: seat.status,
    })),
    shapes: draft.shapes.map(({ type, label, x, y, width, height, rotation, color }) => ({
      type, ...(label && { label }), x, y, width, height, rotation: Math.round(rotation), color,
    })),
  };
}

export function createShape(draft: SeatMapDraft, type: SeatShapeType, at: { x: number; y: number }): DraftShape {
  const { label, width, height, color } = SHAPE_PRESETS[type];
  return clampRect({ key: tempKey(), type, label, x: at.x - width / 2, y: at.y - height / 2, width, height, rotation: 0, color }, draft);
}

export function createSection(draft: SeatMapDraft, at: { x: number; y: number }): DraftSection {
  return clampRect({
    key: tempKey(),
    label: uniqueLabel(draft.sections.map(({ label }) => label), 'Area'),
    ticket_type_id: null,
    x: at.x,
    y: at.y,
    width: 360,
    height: 220,
  }, draft);
}

/** Susun blok kursi baris × kolom di dalam area, melanjutkan baris terakhir yang ada. */
export function generateSeatBlock(section: DraftSection, existing: DraftSeat[], rows: number, cols: number): DraftSeat[] {
  const inSection = existing.filter((seat) => seat.sectionKey === section.key);
  const usedRows = new Set(inSection.map((seat) => seat.row_label));
  let firstRow = 0;
  while (usedRows.has(rowLabel(firstRow))) firstRow += 1;
  const top = inSection.length
    ? Math.max(...inSection.map((seat) => seat.y + seat.height)) + SEAT_GAP
    : section.y + SECTION_HEADER;

  return Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const number = (index % cols) + 1;
    const label = rowLabel(firstRow + row);
    return {
      key: tempKey(),
      sectionKey: section.key,
      label: `${label}${number}`,
      row_label: label,
      seat_number: number,
      ticket_type_id: section.ticket_type_id,
      x: section.x + SECTION_PADDING + (number - 1) * (SEAT_SIZE + SEAT_GAP),
      y: top + row * (SEAT_SIZE + SEAT_GAP),
      width: SEAT_SIZE,
      height: SEAT_SIZE,
      status: 'available',
    };
  });
}

/** Ukuran area minimum agar seluruh kursinya muat. */
export function fitSectionToSeats(section: DraftSection, seats: DraftSeat[]): DraftSection {
  const own = seats.filter((seat) => seat.sectionKey === section.key);
  if (!own.length) return section;
  return {
    ...section,
    width: Math.max(section.width, Math.max(...own.map((seat) => seat.x + seat.width)) - section.x + SECTION_PADDING),
    height: Math.max(section.height, Math.max(...own.map((seat) => seat.y + seat.height)) - section.y + SECTION_PADDING),
  };
}

/** Pindahkan area beserta seluruh kursinya; posisi dijepit ke kanvas. */
export function moveSection(draft: SeatMapDraft, key: string, x: number, y: number): SeatMapDraft {
  const section = draft.sections.find((item) => item.key === key);
  if (!section) return draft;
  const moved = clampRect({ ...section, x, y }, draft);
  const dx = moved.x - section.x;
  const dy = moved.y - section.y;
  return {
    ...draft,
    sections: draft.sections.map((item) => (item.key === key ? moved : item)),
    seats: draft.seats.map((seat) => (seat.sectionKey === key ? { ...seat, x: seat.x + dx, y: seat.y + dy } : seat)),
  };
}

export function intersects(item: Rect, view: Rect, margin = 0) {
  return item.x + item.width >= view.x - margin
    && item.x <= view.x + view.width + margin
    && item.y + item.height >= view.y - margin
    && item.y <= view.y + view.height + margin;
}

/** Culling: hanya elemen yang beririsan dengan viewport yang dirender. */
export function visible<T extends Rect>(items: T[], view: Rect, margin = 64) {
  return items.filter((item) => intersects(item, view, margin));
}

/** Terapkan delta status realtime tanpa memuat ulang denah. */
export function applyStatusDelta(seats: Seat[], delta: SeatStatusDelta): Seat[] {
  const changes = new Map(delta.seats.map(({ id, status }) => [String(id), status]));
  if (!changes.size) return seats;
  return seats.map((seat) => (changes.has(String(seat.id)) ? { ...seat, status: changes.get(String(seat.id))! } : seat));
}
