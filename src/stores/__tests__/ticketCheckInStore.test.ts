import { ApiError } from '@/lib/api';
import { checkInTicket } from '@/services/dashboardService';
import { createTicketCheckInStore } from '../ticketCheckInStore';

jest.mock('@/services/dashboardService', () => ({ checkInTicket: jest.fn() }));
const request = jest.mocked(checkInTicket);

test('menangani verifikasi sukses dan mencegah pengiriman ganda selama verifikasi', async () => {
  const ticket = { ticket_code: 'TIX-AB', ticket_type: 'Reguler', checked_in_at: '2026-11-24T09:00:00Z' };
  request.mockResolvedValueOnce(ticket);
  const store = createTicketCheckInStore('9');
  const pending = store.getState().submit('token');
  expect(store.getState().submitting).toBe(true);
  expect(await store.getState().submit('token')).toBe(false);
  expect(await pending).toBe(true);
  expect(request).toHaveBeenCalledWith('9', 'token');
  expect(store.getState()).toMatchObject({ recent: [ticket], submitting: false, error: null });
});

test.each([
  [new ApiError('Validasi gagal', { errors: [{ field: 'qr_token', message: 'Format QR tidak valid' }] }), 'Format QR tidak valid'],
  [new Error('Tiket sudah digunakan'), 'Tiket sudah digunakan'],
  [null, 'Check-in gagal. Coba lagi.'],
])('mengumumkan kegagalan verifikasi tanpa menambah aktivitas', async (error, message) => {
  request.mockRejectedValueOnce(error);
  const store = createTicketCheckInStore('9');
  expect(await store.getState().submit('token')).toBe(false);
  expect(store.getState()).toMatchObject({ recent: [], submitting: false, error: message });
});
