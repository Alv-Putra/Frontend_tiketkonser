import { createStore } from 'zustand/vanilla';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import {
  fetchOrganizerDashboardEvents,
  createOrganizerEvent,
  updateOrganizerEvent,
  deleteOrganizerEvent,
  submitOrganizerEvent,
  type EventCreateInput,
} from '@/services/dashboardService';

interface OrganizerEventState {
  events: OrganizerDashboardEvent[];
  page: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'ready' | 'error';
  submitting: boolean;

  loadEvents: (page?: number) => Promise<void>;
  createEvent: (data: EventCreateInput) => Promise<void>;
  updateEvent: (id: string, data: Partial<EventCreateInput>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  submitEvent: (id: string) => Promise<void>;
}

export function createOrganizerEventStore() {
  return createStore<OrganizerEventState>((set, get) => {
    let request = 0;

    async function mutate(action: () => Promise<unknown>) {
      if (get().submitting) return;
      set({ submitting: true });
      try {
        await action();
        await get().loadEvents(get().page);
      } finally {
        set({ submitting: false });
      }
    }

    return {
      events: [],
      page: 1,
      totalPages: 0,
      status: 'idle',
      submitting: false,

      async loadEvents(page = 1) {
        const current = ++request;
        set({ status: 'loading' });
        try {
          let result = await fetchOrganizerDashboardEvents(page);
          const lastPage = Math.max(result.totalPages, 1);
          if (page > lastPage) {
            page = lastPage;
            result = await fetchOrganizerDashboardEvents(page);
          }
          if (request === current) {
            set({ events: result.data, page, totalPages: result.totalPages, status: 'ready' });
          }
        } catch {
          if (request === current) set({ status: 'error' });
        }
      },

      createEvent: (data) => mutate(() => createOrganizerEvent(data)),
      updateEvent: (id, data) => mutate(() => updateOrganizerEvent(id, data)),
      deleteEvent: (id) => mutate(() => deleteOrganizerEvent(id)),
      submitEvent: (id) => mutate(() => submitOrganizerEvent(id)),
    };
  });
}
