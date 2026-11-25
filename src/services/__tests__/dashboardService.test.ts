import { apiFetch } from '@/lib/api';
import {
  checkInTicket,
  createOrganizerEvent,
  createOrganizerTicket,
  deleteOrganizerEvent,
  deleteOrganizerTicket,
  fetchAdminDashboard,
  fetchOrganizerCharts,
  fetchOrganizerDashboardEvents,
  fetchOrganizerDashboardSales,
  fetchOrganizerEventDetail,
  fetchOrganizerTickets,
  fetchWorkspaceNotifications,
  submitOrganizerEvent,
  updateOrganizerEvent,
  updateOrganizerTicket,
} from '../dashboardService';

jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

test('menggunakan endpoint dashboard dan check-in sesuai kontrak backend', async () => {
  const response = { sample: true };
  jest.mocked(apiFetch).mockResolvedValue(response);

  await expect(fetchAdminDashboard()).resolves.toEqual(response);
  await expect(fetchOrganizerDashboardEvents(2)).resolves.toEqual(response);
  await expect(fetchOrganizerDashboardSales('23')).resolves.toEqual(response);
  await expect(checkInTicket('23', 'qr-token')).resolves.toEqual(response);
  await expect(fetchWorkspaceNotifications()).resolves.toEqual(response);
  expect(apiFetch).toHaveBeenNthCalledWith(5, '/api/v1/notifications?limit=5');

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/admin/dashboard');
  expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/v1/organizer/event?page=2');
  expect(apiFetch).toHaveBeenNthCalledWith(3, '/api/v1/organizer/event/23/sales');
  expect(apiFetch).toHaveBeenNthCalledWith(4, '/api/v1/check-in', {
    method: 'POST', body: { event_id: '23', qr_token: 'qr-token' },
  });
});

test('mengirim filter analitik hanya saat diberikan', async () => {
  const response = { charts: {} };
  jest.mocked(apiFetch).mockResolvedValue(response);

  await expect(fetchOrganizerCharts()).resolves.toBe(response);
  expect(apiFetch).toHaveBeenLastCalledWith('/api/v1/organizer/dashboard/charts');
  await expect(fetchOrganizerCharts({})).resolves.toBe(response);
  expect(apiFetch).toHaveBeenLastCalledWith('/api/v1/organizer/dashboard/charts');
  await expect(fetchOrganizerCharts({
    event_id: '23',
    interval: 'week',
    start_date: '2026-11-01',
    end_date: '2026-11-25',
  })).resolves.toBe(response);
  expect(apiFetch).toHaveBeenLastCalledWith('/api/v1/organizer/dashboard/charts?event_id=23&interval=week&start_date=2026-11-01&end_date=2026-11-25');
});

const event = {
  venue_id: '9007199254740993',
  category_id: '1',
  title: 'Tixo Live',
  slug: 'tixo-live',
  start_at: '2026-11-25T12:00:00Z',
  end_at: '2026-11-25T15:00:00Z',
};
const ticket = { event_id: '23', name: 'Festival', price: 150000, quota: 200 };

test.each([
  ['detail event', () => fetchOrganizerEventDetail('23'), ['/api/v1/organizer/event/23']],
  ['buat event', () => createOrganizerEvent(event), ['/api/v1/organizer/event', { method: 'POST', body: event }]],
  ['ubah event', () => updateOrganizerEvent('23', { title: 'Konser baru' }), ['/api/v1/organizer/event/23', { method: 'PATCH', body: { title: 'Konser baru' } }]],
  ['hapus event', () => deleteOrganizerEvent('23'), ['/api/v1/organizer/event/23', { method: 'DELETE' }]],
  ['ajukan event', () => submitOrganizerEvent('23'), ['/api/v1/organizer/event/23/submit', { method: 'POST' }]],
  ['daftar tiket', () => fetchOrganizerTickets('23'), ['/api/v1/organizer/event/23/tickets']],
  ['buat tiket', () => createOrganizerTicket(ticket), ['/api/v1/organizer/tickets', { method: 'POST', body: ticket }]],
  ['ubah kuota tiket', () => updateOrganizerTicket('42', { quota: 300 }), ['/api/v1/organizer/tickets/42', { method: 'PATCH', body: { quota: 300 } }]],
  ['hapus tiket', () => deleteOrganizerTicket('42'), ['/api/v1/organizer/tickets/42', { method: 'DELETE' }]],
] as const)('menggunakan kontrak backend untuk %s', async (_label, request, args) => {
  const response = { id: '23' };
  jest.mocked(apiFetch).mockResolvedValue(response);

  await expect(request()).resolves.toBe(response);
  expect(apiFetch).toHaveBeenLastCalledWith(...args);
});
