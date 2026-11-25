import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SeatMapViewer from '../SeatMapViewer';
import { useSeatStatusStream } from '@/hooks/useSeatStatusStream';
import type { SeatMap, SeatStatusDelta } from '@/types/dashboard';

jest.mock('@/hooks/useSeatStatusStream', () => ({ useSeatStatusStream: jest.fn(() => true) }));

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(private cb: ResizeObserverCallback) {}
    observe() { this.cb([{ contentRect: { width: 1000 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
});

const seat = (id: string, x: number, status: 'available' | 'sold' = 'available') => ({
  id, section_id: '1', ticket_type_id: null, label: `A${id}`, row_label: 'A', seat_number: Number(id), x, y: 240, width: 28, height: 28, status,
});
const map: SeatMap = {
  id: '9', width: 1000, height: 500, version: 1,
  sections: [{ id: '1', label: 'Tribun', ticket_type_id: null, x: 0, y: 200, width: 1000, height: 100, sort_order: 0 }],
  seats: [seat('1', 10), seat('2', 500, 'sold'), seat('3', 960)],
};

test('menampilkan legenda, status langsung, dan menerapkan delta realtime', () => {
  render(<SeatMapViewer map={map} live />);
  expect(useSeatStatusStream).toHaveBeenLastCalledWith('9', expect.any(Function));
  expect(screen.getByText('Status langsung')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAccessibleName(expect.stringContaining('3 kursi, 2 tersedia'));

  const onDelta = jest.mocked(useSeatStatusStream).mock.calls.at(-1)![1] as (delta: SeatStatusDelta) => void;
  act(() => onDelta({ seat_map_id: '9', seats: [{ id: '1', status: 'held' }] }));
  expect(screen.getByRole('img')).toHaveAccessibleName(expect.stringContaining('1 tersedia'));
  expect(screen.getByText('A1, Ditahan')).toBeInTheDocument();
});

test('zoom memangkas kursi di luar layar dan bisa dikembalikan', async () => {
  render(<SeatMapViewer map={map} />);
  expect(useSeatStatusStream).toHaveBeenLastCalledWith(null, expect.any(Function));
  expect(screen.getByText(/Menampilkan 3 dari 3 kursi/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Perkecil denah' })).toBeDisabled();

  for (let i = 0; i < 4; i += 1) await userEvent.click(screen.getByRole('button', { name: 'Perbesar denah' }));
  expect(screen.getByText(/Menampilkan 1 dari 3 kursi/)).toBeInTheDocument();

  screen.getByRole('img').focus();
  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
  expect(screen.getByText('A1, Tersedia')).toBeInTheDocument();
  await userEvent.keyboard('-=');

  await userEvent.click(screen.getByRole('button', { name: 'Tampilkan seluruh denah' }));
  expect(screen.getByText(/Menampilkan 3 dari 3 kursi/)).toBeInTheDocument();
});

test('mewarnai kursi tersedia sesuai kelas tiket dan menampilkan elemen denah', () => {
  const colored: SeatMap = {
    ...map,
    seats: [{ ...seat('1', 10), ticket_type_id: '7' }, { ...seat('2', 500, 'sold'), ticket_type_id: '7' }],
    shapes: [
      { id: 's1', type: 'stage', label: 'PANGGUNG', x: 300, y: 380, width: 400, height: 80, rotation: 0, color: null },
      { id: 's2', type: 'circle', label: null, x: 50, y: 400, width: 60, height: 60, rotation: 30, color: '#5EC8F2' },
    ],
    event: { ticketTypes: [{ id: '7', name: 'CAT 1', color: '#9B8CFF' }, { id: '8', name: 'CAT 2', color: '#FF7A00' }] },
  };
  const { container } = render(<SeatMapViewer map={colored} />);

  expect(screen.getByText('CAT 1')).toBeInTheDocument();
  expect(screen.queryByText('CAT 2')).not.toBeInTheDocument();
  expect(screen.getByText('PANGGUNG')).toBeInTheDocument();
  expect(container.querySelector('ellipse')).toHaveStyle({ fill: '#5EC8F2' });

  const fills = Array.from(container.querySelectorAll('rect')).map((rect) => rect.getAttribute('style'));
  expect(fills).toContain('fill: #9B8CFF;');
  expect(fills).toContain('fill: var(--color-blaze);');
});
