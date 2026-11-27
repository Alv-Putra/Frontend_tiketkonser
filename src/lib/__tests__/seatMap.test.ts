import {
  COLOR_SWATCHES,
  DEFAULT_MAP_SIZE,
  SHAPE_PRESETS,
  createShape,
  readableText,
  seatFill,
  SEAT_SIZE,
  applyStatusDelta,
  clampRect,
  createSection,
  fitSectionToSeats,
  generateSeatBlock,
  intersects,
  moveSection,
  rowLabel,
  tempKey,
  toDraft,
  toPayload,
  uniqueLabel,
  visible,
  type DraftSection,
} from '../seatMap';
import type { SeatMap } from '@/types/dashboard';

const map: SeatMap = {
  id: '1',
  width: 800,
  height: 600,
  version: 2,
  sections: [{ id: '10', label: 'VIP', ticket_type_id: '7', x: 0, y: 0, width: 300, height: 200, sort_order: 0 }],
  seats: [
    { id: '100', section_id: '10', ticket_type_id: '7', label: 'A1', row_label: 'A', seat_number: 1, x: 16, y: 36, width: 28, height: 28, status: 'sold' },
    { id: '101', section_id: null, ticket_type_id: null, label: 'X', row_label: null, seat_number: null, x: 500, y: 500, width: 28, height: 28, status: 'blocked' },
  ],
};

describe('seatMap', () => {
  it('membuat label baris dan label unik', () => {
    expect([rowLabel(0), rowLabel(25), rowLabel(26), rowLabel(27), rowLabel(701), rowLabel(702)]).toEqual(['A', 'Z', 'AA', 'AB', 'ZZ', 'AAA']);
    expect(uniqueLabel(['Area 1', 'Area 2'], 'Area')).toBe('Area 3');
    expect(tempKey()).not.toBe(tempKey());
  });

  it('mengubah denah server menjadi draf dan kembali menjadi payload', () => {
    expect(toDraft(null)).toEqual({ ...DEFAULT_MAP_SIZE, sections: [], seats: [], shapes: [] });
    const draft = toDraft(map);
    expect(draft.sections[0]).toMatchObject({ key: '10', ticket_type_id: '7' });
    expect(draft.seats.map((seat) => [seat.key, seat.sectionKey, seat.status])).toEqual([['100', '10', 'available'], ['101', null, 'blocked']]);

    expect(toPayload(draft)).toEqual({
      width: 800,
      height: 600,
      sections: [{ label: 'VIP', ticket_type_id: '7', x: 0, y: 0, width: 300, height: 200, sort_order: 0 }],
      seats: [
        { label: 'A1', section_label: 'VIP', ticket_type_id: '7', row_label: 'A', seat_number: 1, x: 16, y: 36, width: 28, height: 28, status: 'available' },
        { label: 'X', x: 500, y: 500, width: 28, height: 28, status: 'blocked' },
      ],
      shapes: [],
    });
    expect(toDraft({ ...map, sections: [{ ...map.sections[0], ticket_type_id: null }] }).sections[0].ticket_type_id).toBeNull();
  });

  it('membuat area baru yang tetap di dalam kanvas', () => {
    const draft = toDraft(map);
    const section = createSection(draft, { x: 790, y: -20 });
    expect(section).toMatchObject({ label: 'Area 1', x: 440, y: 0, width: 360, height: 220, ticket_type_id: null });
    expect(clampRect({ x: 5, y: 5, width: 900, height: 10 }, { width: 800, height: 600 })).toMatchObject({ x: 0, y: 5 });
  });

  it('menyusun blok kursi dan melanjutkan baris yang sudah ada', () => {
    const section: DraftSection = { key: 's', label: 'Tribun', ticket_type_id: '3', x: 100, y: 50, width: 200, height: 100 };
    const first = generateSeatBlock(section, [], 2, 3);
    expect(first).toHaveLength(6);
    expect(first[0].width).toBe(SEAT_SIZE);
    expect(first[0]).toMatchObject({ label: 'A1', row_label: 'A', seat_number: 1, x: 116, y: 86, ticket_type_id: '3', sectionKey: 's' });
    expect(first[5]).toMatchObject({ label: 'B3', x: 116 + 2 * 36, y: 86 + 36 });

    const next = generateSeatBlock(section, first, 1, 2);
    expect(next.map((seat) => seat.label)).toEqual(['C1', 'C2']);
    expect(next[0].y).toBe(86 + 36 + 28 + 8);

    const fitted = fitSectionToSeats({ ...section, width: 50 }, [...first, ...next]);
    expect(fitted.width).toBe(116 + 72 + 28 - 100 + 16);
    expect(fitSectionToSeats({ ...section, width: 500, height: 500 }, first)).toMatchObject({ width: 500, height: 500 });
    expect(fitted.height).toBe(next[0].y + 28 - 50 + 16);
    expect(fitSectionToSeats(section, [])).toBe(section);
  });

  it('memindahkan area beserta kursinya dalam batas kanvas', () => {
    const base = toDraft(map);
    const other = { ...base.sections[0], key: '11', label: 'Festival' };
    const draft = { ...base, sections: [...base.sections, other] };
    const moved = moveSection(draft, '10', 900, 50);
    expect(moved.sections[1]).toBe(other);
    expect(moved.sections[0]).toMatchObject({ x: 500, y: 50 });
    expect(moved.seats[0]).toMatchObject({ x: 516, y: 86 });
    expect(moved.seats[1]).toEqual(draft.seats[1]);
    expect(moveSection(draft, 'tidak-ada', 0, 0)).toBe(draft);
  });

  it('hanya menyisakan elemen yang terlihat di viewport', () => {
    const view = { x: 100, y: 100, width: 200, height: 200 };
    expect(intersects({ x: 0, y: 0, width: 50, height: 50 }, view)).toBe(false);
    expect(intersects({ x: 0, y: 0, width: 50, height: 50 }, view, 60)).toBe(true);
    expect(intersects({ x: 290, y: 290, width: 50, height: 50 }, view)).toBe(true);
    expect(visible([{ x: 150, y: 150, width: 10, height: 10 }, { x: 1000, y: 1000, width: 10, height: 10 }], view).length).toBe(1);
  });

  it('menerapkan delta status tanpa menyentuh kursi lain', () => {
    const updated = applyStatusDelta(map.seats, { seat_map_id: '1', seats: [{ id: '101', status: 'held' }] });
    expect(updated.map((seat) => seat.status)).toEqual(['sold', 'held']);
    expect(updated[0]).toBe(map.seats[0]);
    expect(applyStatusDelta(map.seats, { seat_map_id: '1', seats: [] })).toBe(map.seats);
  });

  it('menyimpan elemen denah (panggung, pintu, teks) bolak-balik', () => {
    const withShapes: SeatMap = {
      ...map,
      shapes: [
        { id: '5', type: 'stage', label: 'PANGGUNG', x: 10, y: 10, width: 480, height: 120, rotation: 0, color: null },
        { id: '6', type: 'circle', label: null, x: 600, y: 300, width: 100, height: 100, rotation: 45.4, color: '#5EC8F2' },
      ],
    };
    const draft = toDraft(withShapes);
    expect(draft.shapes[0]).toMatchObject({ key: '5', color: SHAPE_PRESETS.stage.color, label: 'PANGGUNG' });
    expect(draft.shapes[1]).toMatchObject({ label: '', color: '#5EC8F2' });
    expect(toPayload(draft).shapes).toEqual([
      { type: 'stage', label: 'PANGGUNG', x: 10, y: 10, width: 480, height: 120, rotation: 0, color: '#09090B' },
      { type: 'circle', x: 600, y: 300, width: 100, height: 100, rotation: 45, color: '#5EC8F2' },
    ]);

    const exit = createShape(draft, 'exit', { x: 790, y: 300 });
    expect(exit).toMatchObject({ type: 'exit', label: 'KELUAR', width: 120, height: 44, rotation: 0, x: 680, y: 278 });
  });

  it('memilih warna teks dan warna kursi dari kelas tiket', () => {
    expect(readableText('#09090B')).toBe('#FFFFFF');
    expect(readableText('#FFD9BF')).toBe('#09090B');
    expect(COLOR_SWATCHES).toContain('#FF4D00');
    const statusColors = { available: 'hijau', held: 'kuning', sold: 'oranye', blocked: 'abu' };
    expect(seatFill('available', '#5EC8F2', statusColors)).toBe('#5EC8F2');
    expect(seatFill('available', null, statusColors)).toBe('hijau');
    expect(seatFill('sold', '#5EC8F2', statusColors)).toBe('oranye');
  });
});
