import { imageToDraft } from '../seatMapImport';

type RGBA = [number, number, number, number];
const WHITE: RGBA = [255, 255, 255, 255];
const ORANGE: RGBA = [255, 77, 0, 255];
const BLACK: RGBA = [9, 9, 11, 255];
const GRAY: RGBA = [120, 120, 120, 255];

function canvas(width: number, height: number) {
  const data = new Uint8ClampedArray(width * height * 4);
  const paint = (x: number, y: number, w: number, h: number, color: RGBA) => {
    for (let yy = y; yy < y + h; yy += 1) {
      for (let xx = x; xx < x + w; xx += 1) data.set(color, (yy * width + xx) * 4);
    }
  };
  paint(0, 0, width, height, WHITE);
  return { image: { data, width, height }, paint };
}

test('mengubah bintik kursi menjadi area per warna, baris, dan nomor kursi', () => {
  const { image, paint } = canvas(60, 50);
  paint(5, 2, 40, 5, GRAY); // panggung
  for (const y of [12, 17]) for (const x of [5, 10, 15]) paint(x, y, 3, 3, ORANGE);
  paint(30, 12, 3, 3, BLACK);
  paint(36, 12, 3, 3, BLACK);
  paint(5, 30, 30, 1, GRAY); // garis: diabaikan
  paint(40, 25, 15, 1, BLACK); // bingkai tipis: diabaikan
  paint(40, 39, 15, 1, BLACK);
  paint(40, 25, 1, 15, BLACK);
  paint(54, 25, 1, 15, BLACK);
  paint(2, 45, 1, 1, ORANGE); // noise
  paint(10, 40, 4, 4, [0, 0, 0, 0]); // transparan

  const draft = imageToDraft(image);
  const scale = 28 / 3;

  expect(draft.width).toBe(Math.round(60 * scale));
  expect(draft.sections.map(({ label }) => label)).toEqual(['Area 1', 'Area 2']);
  const [orange, black] = draft.sections;
  const own = (key: string) => draft.seats.filter((seat) => seat.sectionKey === key);
  expect(own(orange.key).map(({ label }) => label)).toEqual(['A1', 'A2', 'A3', 'B1', 'B2', 'B3']);
  expect(own(black.key).map(({ label }) => label)).toEqual(['A1', 'A2']);
  expect(draft.seats[0]).toMatchObject({ x: Math.round(5 * scale), y: Math.round(12 * scale), width: 28, height: 28, row_label: 'A', seat_number: 1, status: 'available' });
  expect(orange.x).toBe(Math.round(5 * scale) - 16);
  expect(draft.shapes).toEqual([expect.objectContaining({ type: 'stage', label: 'PANGGUNG', color: '#787878', width: Math.round(40 * scale) })]);
});

test('bidang besar lain menjadi kotak dan gambar polos tidak menghasilkan kursi', () => {
  const { image, paint } = canvas(40, 40);
  for (const x of [2, 6, 10, 14, 18]) paint(x, 2, 2, 2, ORANGE);
  paint(2, 10, 30, 8, GRAY);
  paint(2, 22, 12, 12, BLACK);
  paint(0, 0, 1, 1, ORANGE); // tepi kursi kecil dekat 0 tetap dijepit ke kanvas
  const draft = imageToDraft(image);
  expect(draft.shapes.map(({ type }) => type)).toEqual(['stage', 'rect']);
  expect(draft.sections[0]).toMatchObject({ x: 12, y: 0 });

  const empty = imageToDraft(canvas(10, 10).image);
  expect(empty).toEqual({ width: 280, height: 280, sections: [], seats: [], shapes: [] });
  expect(imageToDraft(canvas(1, 1).image)).toMatchObject({ width: 200, height: 200 });
});
