import { ApiError } from '@/lib/api';
import { createSeatMapEditorStore } from '../seatMapEditorStore';
import { fetchOrganizerSeatMap, saveOrganizerSeatMap } from '@/services/dashboardService';
import type { SeatMap } from '@/types/dashboard';

jest.mock('@/services/dashboardService', () => ({
  fetchOrganizerSeatMap: jest.fn(),
  saveOrganizerSeatMap: jest.fn(),
}));

const map: SeatMap = {
  id: '1',
  width: 800,
  height: 600,
  version: 1,
  sections: [{ id: '10', label: 'VIP', ticket_type_id: null, x: 0, y: 0, width: 300, height: 200, sort_order: 0 }],
  seats: [
    { id: '100', section_id: '10', ticket_type_id: null, label: 'A1', row_label: 'A', seat_number: 1, x: 16, y: 36, width: 28, height: 28, status: 'available' },
    { id: '101', section_id: null, ticket_type_id: null, label: 'B1', row_label: 'B', seat_number: 1, x: 500, y: 500, width: 28, height: 28, status: 'available' },
  ],
};

async function loaded(source: SeatMap | null = map) {
  if (source) jest.mocked(fetchOrganizerSeatMap).mockResolvedValue(source);
  else jest.mocked(fetchOrganizerSeatMap).mockRejectedValue(new ApiError('Tidak ditemukan', { status: 404 }));
  const store = createSeatMapEditorStore('5');
  await store.getState().load();
  return store;
}

beforeEach(() => jest.resetAllMocks());

test('memuat denah server, atau kanvas kosong bila belum ada', async () => {
  const store = await loaded();
  expect(fetchOrganizerSeatMap).toHaveBeenCalledWith('5');
  expect(store.getState()).toMatchObject({ status: 'ready', dirty: false });
  expect(store.getState().draft.seats).toHaveLength(2);

  const empty = await loaded(null);
  expect(empty.getState().draft).toMatchObject({ width: 1600, height: 1000, sections: [], seats: [] });

  jest.mocked(fetchOrganizerSeatMap).mockRejectedValue(new Error('server mati'));
  const failed = createSeatMapEditorStore('5');
  await failed.getState().load();
  expect(failed.getState().status).toBe('error');
});

test('mengelola area: tambah, ubah, pindah, isi kursi, hapus', async () => {
  const store = await loaded();
  const state = () => store.getState();

  state().addSection({ x: 400, y: 300 });
  const added = state().draft.sections[1];
  expect(added.label).toBe('Area 1');
  expect(state()).toMatchObject({ dirty: true, selectedSection: added.key, selectedSeats: [] });

  state().updateSection('10', { label: 'VVIP', ticket_type_id: '7' });
  expect(state().draft.sections[0]).toMatchObject({ label: 'VVIP', ticket_type_id: '7' });
  expect(state().draft.seats[0].ticket_type_id).toBe('7');
  expect(state().draft.seats[1].ticket_type_id).toBeNull();
  state().updateSection('10', { width: 320 });
  expect(state().draft.seats[0].ticket_type_id).toBe('7');

  state().moveSection('10', 10, 20);
  expect(state().draft.seats[0]).toMatchObject({ x: 26, y: 56 });

  state().addSeatBlock(added.key, 2, 4);
  expect(state().draft.seats.filter((seat) => seat.sectionKey === added.key)).toHaveLength(8);
  state().addSeatBlock(added.key, 0, 4);
  state().addSeatBlock('tidak-ada', 1, 1);
  expect(state().draft.seats).toHaveLength(10);

  state().deleteSection(added.key);
  expect(state().draft.sections).toHaveLength(1);
  expect(state().draft.seats).toHaveLength(2);
  expect(state().selectedSection).toBeNull();

  state().setCanvasSize(100, 1234.6);
  expect(state().draft).toMatchObject({ width: 200, height: 1235 });
});

test('mengatur kursi terpilih: pindah, status, kelas tiket, hapus', async () => {
  const store = await loaded();
  const state = () => store.getState();

  state().moveSeat('100', 2000, 40);
  expect(state().draft.seats[0]).toMatchObject({ x: 772, y: 40 });
  expect(state().draft.seats[1]).toMatchObject({ x: 500, y: 500 });

  state().setSelectedStatus('blocked');
  expect(state().draft.seats[0].status).toBe('available');

  state().selectSection('10');
  state().selectSeats(['100']);
  state().selectSeats(['100', 'x'], true);
  expect(state()).toMatchObject({ selectedSeats: ['100', 'x'], selectedSection: null });
  state().selectSeats(['100']);

  state().setSelectedStatus('blocked');
  state().setSelectedTicketType('9');
  expect(state().draft.seats[0]).toMatchObject({ status: 'blocked', ticket_type_id: '9' });
  expect(state().draft.seats[1]).toMatchObject({ status: 'available', ticket_type_id: null });

  state().deleteSelectedSeats();
  expect(state().draft.seats).toHaveLength(1);
  expect(state().selectedSeats).toEqual([]);
  state().deleteSelectedSeats();
});

test('menyimpan denah dan menampilkan error backend', async () => {
  const store = await loaded();
  const state = () => store.getState();
  state().moveSeat('100', 50, 50);

  jest.mocked(saveOrganizerSeatMap).mockResolvedValueOnce({ ...map, version: 2 });
  await expect(state().save()).resolves.toBe(true);
  expect(saveOrganizerSeatMap).toHaveBeenCalledWith('5', expect.objectContaining({ width: 800, seats: expect.arrayContaining([expect.objectContaining({ x: 50, y: 50 })]) }));
  expect(state()).toMatchObject({ dirty: false, saving: false, error: null });

  jest.mocked(saveOrganizerSeatMap).mockRejectedValueOnce(new ApiError('Validasi gagal', { status: 400, errors: [{ field: 'seats', message: 'Minimal satu kursi' }] }));
  await expect(state().save()).resolves.toBe(false);
  expect(state()).toMatchObject({ error: 'Validasi gagal', fieldErrors: { seats: 'Minimal satu kursi' }, saving: false });

  jest.mocked(saveOrganizerSeatMap).mockRejectedValueOnce('putus');
  await state().save();
  expect(state().error).toBe('Denah gagal disimpan.');

  store.setState({ saving: true });
  await expect(state().save()).resolves.toBe(false);
});

test('mengelola elemen denah: tambah, ubah, pilih, hapus', async () => {
  const store = await loaded();
  const state = () => store.getState();

  state().addShape('stage', { x: 400, y: 60 });
  const stage = state().draft.shapes[0];
  expect(stage).toMatchObject({ type: 'stage', label: 'PANGGUNG', x: 160, y: 0 });
  expect(state()).toMatchObject({ selectedShape: stage.key, selectedSection: null, dirty: true });

  state().addShape('toilet', { x: 700, y: 500 });
  const toilet = state().draft.shapes[1];
  state().updateShape(stage.key, { label: 'MAIN STAGE', color: '#FF4D00', rotation: 15, width: 500 });
  expect(state().draft.shapes[0]).toMatchObject({ label: 'MAIN STAGE', color: '#FF4D00', rotation: 15, width: 500 });
  expect(state().draft.shapes[1]).toBe(toilet);

  state().selectSection('10');
  expect(state().selectedShape).toBeNull();
  state().selectShape(toilet.key);
  expect(state()).toMatchObject({ selectedShape: toilet.key, selectedSection: null, selectedSeats: [] });
  state().selectSeats(['100']);
  expect(state().selectedShape).toBeNull();

  state().deleteShape(stage.key);
  expect(state().draft.shapes.map((shape) => shape.type)).toEqual(['toilet']);
  expect(state().selectedShape).toBeNull();
});
