import { ApiError } from '@/lib/api';
import {
  createOrganizerEvent,
  deleteOrganizerEvent,
  fetchOrganizerDashboardEvents,
  submitOrganizerEvent,
  updateOrganizerEvent,
} from '@/services/dashboardService';
import { createOrganizerEventStore } from '../organizerEventStore';

jest.mock('@/services/dashboardService');

const fetchEvents = jest.mocked(fetchOrganizerDashboardEvents);
const event = { id: '23', title: 'Tixo Live', start_at: '2026-11-25T12:00:00Z', status: 'draft', venue: null };
const input = { venue: { name: 'GBK', city_id: '1' }, category_id: '2', title: event.title, start_at: event.start_at, end_at: '2026-11-25T15:00:00Z' };

beforeEach(() => {
  jest.resetAllMocks();
  fetchEvents.mockResolvedValue({ data: [event], totalPages: 1 });
});

test('memuat daftar dan mempertahankan data saat penyegaran gagal', async () => {
  const store = createOrganizerEventStore();

  const load = store.getState().loadEvents();
  expect(store.getState().status).toBe('loading');
  await load;
  expect(fetchEvents).toHaveBeenCalledWith(1);
  expect(store.getState()).toMatchObject({ events: [event], page: 1, totalPages: 1, status: 'ready' });

  fetchEvents.mockRejectedValueOnce(new Error('Offline'));
  await store.getState().loadEvents(1);
  expect(store.getState()).toMatchObject({ events: [event], status: 'error' });
});

test.each(['success', 'failure'])('mengabaikan permintaan daftar lama yang selesai belakangan (%s)', async (outcome) => {
  let resolveOld!: (value: { data: typeof event[]; totalPages: number }) => void;
  let rejectOld!: (error: Error) => void;
  fetchEvents.mockReturnValueOnce(new Promise((resolve, reject) => { resolveOld = resolve; rejectOld = reject; }));
  fetchEvents.mockResolvedValueOnce({ data: [{ ...event, title: 'Halaman dua' }], totalPages: 2 });
  const store = createOrganizerEventStore();

  const old = store.getState().loadEvents();
  await store.getState().loadEvents(2);
  if (outcome === 'success') resolveOld({ data: [event], totalPages: 2 });
  else rejectOld(new Error('Timeout'));
  await old;
  expect(store.getState()).toMatchObject({ events: [{ ...event, title: 'Halaman dua' }], page: 2, status: 'ready' });
});

test('memuat halaman sebelumnya saat event terakhir di halaman dihapus', async () => {
  fetchEvents.mockResolvedValueOnce({ data: [event], totalPages: 2 });
  const store = createOrganizerEventStore();

  await store.getState().loadEvents(2);
  fetchEvents.mockResolvedValueOnce({ data: [], totalPages: 1 });
  await store.getState().deleteEvent(event.id);
  expect(deleteOrganizerEvent).toHaveBeenCalledWith(event.id);
  expect(fetchEvents.mock.calls).toEqual([[2], [2], [1]]);
  expect(store.getState()).toMatchObject({ page: 1, totalPages: 1, submitting: false });
});

test('menyegarkan daftar setelah membuat, mengubah, dan mengajukan event', async () => {
  const store = createOrganizerEventStore();

  await store.getState().createEvent(input);
  await store.getState().updateEvent(event.id, { title: 'Judul baru' });
  await store.getState().submitEvent(event.id);
  expect(createOrganizerEvent).toHaveBeenCalledWith(input);
  expect(updateOrganizerEvent).toHaveBeenCalledWith(event.id, { title: 'Judul baru' });
  expect(submitOrganizerEvent).toHaveBeenCalledWith(event.id);
  expect(fetchEvents).toHaveBeenCalledTimes(3);
});

test('meneruskan detail ApiError dan mencegah mutasi ganda selama request berjalan', async () => {
  const store = createOrganizerEventStore();
  const error = new ApiError('Jadwal tidak valid', { errors: [{ field: 'end_at', message: 'Harus setelah waktu mulai' }] });
  jest.mocked(createOrganizerEvent).mockRejectedValueOnce(error);

  const create = store.getState().createEvent(input);
  expect(store.getState().submitting).toBe(true);
  const other = store.getState().submitEvent(event.id);
  await expect(create).rejects.toBe(error);
  await other;
  expect(submitOrganizerEvent).not.toHaveBeenCalled();
  expect(fetchEvents).not.toHaveBeenCalled();
  expect(store.getState().submitting).toBe(false);
});
