import { createStore } from 'zustand/vanilla';
import { ApiError, fieldErrorsFrom } from '@/lib/api';
import {
  clampRect,
  createSection,
  createShape,
  fitSectionToSeats,
  generateSeatBlock,
  moveSection,
  toDraft,
  toPayload,
  type DraftSection,
  type DraftShape,
  type SeatMapDraft,
} from '@/lib/seatMap';
import type { SeatShapeType } from '@/types/dashboard';
import { fetchOrganizerSeatMap, saveOrganizerSeatMap } from '@/services/dashboardService';

export interface SeatMapEditorState {
  draft: SeatMapDraft;
  status: 'loading' | 'ready' | 'error';
  saving: boolean;
  dirty: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  selectedSection: string | null;
  selectedSeats: string[];
  selectedShape: string | null;

  load: () => Promise<void>;
  save: () => Promise<boolean>;
  setCanvasSize: (width: number, height: number) => void;
  addSection: (at: { x: number; y: number }) => void;
  updateSection: (key: string, patch: Partial<Pick<DraftSection, 'label' | 'ticket_type_id' | 'width' | 'height'>>) => void;
  moveSection: (key: string, x: number, y: number) => void;
  deleteSection: (key: string) => void;
  addSeatBlock: (sectionKey: string, rows: number, cols: number) => void;
  moveSeat: (key: string, x: number, y: number) => void;
  selectSection: (key: string | null) => void;
  selectSeats: (keys: string[], additive?: boolean) => void;
  deleteSelectedSeats: () => void;
  setSelectedStatus: (status: 'available' | 'blocked') => void;
  setSelectedTicketType: (ticketTypeId: string | null) => void;
  addShape: (type: SeatShapeType, at: { x: number; y: number }) => void;
  updateShape: (key: string, patch: Partial<Pick<DraftShape, 'label' | 'color' | 'x' | 'y' | 'width' | 'height' | 'rotation'>>) => void;
  deleteShape: (key: string) => void;
  selectShape: (key: string | null) => void;
}

export function createSeatMapEditorStore(eventId: string) {
  return createStore<SeatMapEditorState>((set, get) => {
    // Semua perubahan draf menandai editor belum tersimpan.
    const edit = (change: (draft: SeatMapDraft) => SeatMapDraft) => set({ draft: change(get().draft), dirty: true });
    const touchSelected = (patch: { status?: 'available' | 'blocked'; ticket_type_id?: string | null }) => {
      const selected = new Set(get().selectedSeats);
      if (!selected.size) return;
      edit((draft) => ({ ...draft, seats: draft.seats.map((seat) => (selected.has(seat.key) ? { ...seat, ...patch } : seat)) }));
    };

    return {
      draft: toDraft(null),
      status: 'loading',
      saving: false,
      dirty: false,
      error: null,
      fieldErrors: {},
      selectedSection: null,
      selectedSeats: [],
      selectedShape: null,

      async load() {
        set({ status: 'loading', error: null });
        try {
          const map = await fetchOrganizerSeatMap(eventId).catch((error) => {
            // 404 = denah belum dibuat; mulai dari kanvas kosong.
            if (error instanceof ApiError && error.status === 404) return null;
            throw error;
          });
          set({ draft: toDraft(map), status: 'ready', dirty: false, selectedSection: null, selectedSeats: [], selectedShape: null });
        } catch {
          set({ status: 'error' });
        }
      },

      async save() {
        if (get().saving) return false;
        set({ saving: true, error: null, fieldErrors: {} });
        try {
          const map = await saveOrganizerSeatMap(eventId, toPayload(get().draft));
          set({ draft: toDraft(map), dirty: false, selectedSection: null, selectedSeats: [], selectedShape: null });
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Denah gagal disimpan.', fieldErrors: fieldErrorsFrom(error) });
          return false;
        } finally {
          set({ saving: false });
        }
      },

      setCanvasSize(width, height) {
        edit((draft) => ({
          ...draft,
          width: Math.max(200, Math.round(width)),
          height: Math.max(200, Math.round(height)),
        }));
      },

      addSection(at) {
        const section = createSection(get().draft, at);
        edit((draft) => ({ ...draft, sections: [...draft.sections, section] }));
        set({ selectedSection: section.key, selectedSeats: [], selectedShape: null });
      },

      updateSection(key, patch) {
        edit((draft) => ({
          ...draft,
          sections: draft.sections.map((section) => (section.key === key ? clampRect({ ...section, ...patch }, draft) : section)),
          // Kelas tiket area ikut diterapkan ke kursi di dalamnya.
          seats: patch.ticket_type_id === undefined
            ? draft.seats
            : draft.seats.map((seat) => (seat.sectionKey === key ? { ...seat, ticket_type_id: patch.ticket_type_id } : seat)),
        }));
      },

      moveSection(key, x, y) {
        edit((draft) => moveSection(draft, key, x, y));
      },

      deleteSection(key) {
        edit((draft) => ({
          ...draft,
          sections: draft.sections.filter((section) => section.key !== key),
          seats: draft.seats.filter((seat) => seat.sectionKey !== key),
        }));
        set({ selectedSection: null, selectedSeats: [] });
      },

      addSeatBlock(sectionKey, rows, cols) {
        const section = get().draft.sections.find((item) => item.key === sectionKey);
        if (!section || rows < 1 || cols < 1) return;
        edit((draft) => {
          const seats = [...draft.seats, ...generateSeatBlock(section, draft.seats, rows, cols)];
          const sections = draft.sections.map((item) => (item.key === sectionKey ? clampRect(fitSectionToSeats(item, seats), draft) : item));
          return { ...draft, sections, seats };
        });
      },

      moveSeat(key, x, y) {
        edit((draft) => ({ ...draft, seats: draft.seats.map((seat) => (seat.key === key ? clampRect({ ...seat, x, y }, draft) : seat)) }));
      },

      selectSection(key) {
        set({ selectedSection: key, selectedSeats: [], selectedShape: null });
      },

      selectSeats(keys, additive = false) {
        const current = additive ? get().selectedSeats : [];
        set({ selectedSeats: [...new Set([...current, ...keys])], selectedSection: null, selectedShape: null });
      },

      deleteSelectedSeats() {
        const selected = new Set(get().selectedSeats);
        if (!selected.size) return;
        edit((draft) => ({ ...draft, seats: draft.seats.filter((seat) => !selected.has(seat.key)) }));
        set({ selectedSeats: [] });
      },

      setSelectedStatus: (status) => touchSelected({ status }),
      setSelectedTicketType: (ticketTypeId) => touchSelected({ ticket_type_id: ticketTypeId }),

      addShape(type, at) {
        const shape = createShape(get().draft, type, at);
        edit((draft) => ({ ...draft, shapes: [...draft.shapes, shape] }));
        set({ selectedShape: shape.key, selectedSection: null, selectedSeats: [] });
      },

      updateShape(key, patch) {
        edit((draft) => ({
          ...draft,
          shapes: draft.shapes.map((shape) => (shape.key === key ? clampRect({ ...shape, ...patch }, draft) : shape)),
        }));
      },

      deleteShape(key) {
        edit((draft) => ({ ...draft, shapes: draft.shapes.filter((shape) => shape.key !== key) }));
        set({ selectedShape: null });
      },

      selectShape(key) {
        set({ selectedShape: key, selectedSection: null, selectedSeats: [] });
      },
    };
  });
}
