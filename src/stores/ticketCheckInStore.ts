import { createStore } from 'zustand/vanilla';
import { fieldErrorsFrom } from '@/lib/api';
import { checkInTicket } from '@/services/dashboardService';
import type { TicketCheckIn } from '@/types/dashboard';

export function createTicketCheckInStore(eventId: string) {
  return createStore<{
    recent: TicketCheckIn[];
    submitting: boolean;
    error: string | null;
    submit: (token: string) => Promise<boolean>;
  }>((set, get) => ({
    recent: [],
    submitting: false,
    error: null,
    async submit(token) {
      if (get().submitting) return false;
      set({ submitting: true, error: null });
      try {
        const result = await checkInTicket(eventId, token);
        set((state) => ({ recent: [result, ...state.recent].slice(0, 5) }));
        return true;
      } catch (error) {
        set({ error: fieldErrorsFrom(error).qr_token || (error instanceof Error ? error.message : 'Check-in gagal. Coba lagi.') });
        return false;
      } finally {
        set({ submitting: false });
      }
    },
  }));
}
