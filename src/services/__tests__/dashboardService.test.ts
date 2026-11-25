import { apiFetch } from '@/lib/api';
import {
  checkInTicket,
  createOrganizerEvent,
  createOrganizerTicket,
  deleteOrganizerEvent,
  deleteOrganizerTicket,
  fetchAdminCharts,
  fetchAdminDashboard,
  fetchNotifications,
  fetchOrganizerCategories,
  fetchOrganizerProfile,
  fetchOrganizerCities,
  fetchOrganizerEventDocuments,
  uploadOrganizerEventDocument,
  fetchOrganizerSeatMap,
  fetchPublicSeatMap,
  saveOrganizerSeatMap,
  markNotificationRead,
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
  venue: { name: 'GBK', city_id: '9007199254740993' },
  category_id: '1',
  title: 'Tixo Live',
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

test('memuat tren admin untuk rentang dan interval yang dipilih', async () => {
  const response = { chart: 'admin sales' };
  jest.mocked(apiFetch).mockResolvedValue(response);
  await expect(fetchAdminCharts({ interval: 'month', start_date: '2026-09-01', end_date: '2026-11-25' })).resolves.toBe(response);
  expect(apiFetch).toHaveBeenLastCalledWith('/api/v1/admin/dashboard/charts?interval=month&start_date=2026-09-01&end_date=2026-11-25');
});

test('memakai endpoint notifikasi dan denah organizer', async () => {
  jest.mocked(apiFetch).mockReset().mockResolvedValue({});

  await fetchNotifications(3);
  await markNotificationRead('7');
  await fetchOrganizerSeatMap('23');

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/notifications?page=3&limit=10');
  expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/v1/notifications/7/read', { method: 'PATCH' });
  expect(apiFetch).toHaveBeenNthCalledWith(3, '/api/v1/organizer/event/23/seat-map');
});

test('memakai endpoint berkas verifikasi event organizer', async () => {
  jest.mocked(apiFetch).mockReset().mockResolvedValue({});
  const file = new File(['pdf'], 'pks.pdf', { type: 'application/pdf' });

  await fetchOrganizerEventDocuments('23');
  await uploadOrganizerEventDocument('23', 'venue_permit', file);

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/organizer/event/23/documents');
  const [path, options] = jest.mocked(apiFetch).mock.calls[1];
  expect(path).toBe('/api/v1/organizer/event/23/documents/venue_permit');
  expect(options.method).toBe('PUT');
  expect((options.body as FormData).get('file')).toBe(file);
});

test('memakai endpoint master data form event organizer', async () => {
  jest.mocked(apiFetch).mockReset().mockResolvedValue([]);

  await fetchOrganizerCategories();
  await fetchOrganizerCities();
  await fetchOrganizerProfile();

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/organizer/categories');
  expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/v1/organizer/cities');
  expect(apiFetch).toHaveBeenNthCalledWith(3, '/api/v1/organizer/profile');
});

test('menyimpan denah organizer dan mengambil denah publik dengan viewport', async () => {
  jest.mocked(apiFetch).mockReset().mockResolvedValue({});
  const payload = { width: 800, height: 600, sections: [], seats: [], shapes: [] };

  await saveOrganizerSeatMap('23', payload);
  await fetchPublicSeatMap('23');
  await fetchPublicSeatMap('23', { x: 10.4, y: 0, width: 400.6, height: 300 });

  expect(apiFetch).toHaveBeenNthCalledWith(1, '/api/v1/organizer/event/23/seat-map', { method: 'PUT', body: payload });
  expect(apiFetch).toHaveBeenNthCalledWith(2, '/api/v1/events/23/seat-map', { auth: false });
  expect(apiFetch).toHaveBeenNthCalledWith(3, '/api/v1/events/23/seat-map?x=10&y=0&width=401&height=300', { auth: false });
});
