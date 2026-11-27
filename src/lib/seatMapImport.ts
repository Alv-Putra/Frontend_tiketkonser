import { SEAT_SIZE, rowLabel, tempKey, type DraftSeat, type DraftSection, type DraftShape, type SeatMapDraft } from './seatMap';

/** Piksel RGBA seperti ImageData. */
export interface PixelImage {
  data: ArrayLike<number>;
  width: number;
  height: number;
}

interface Blob {
  bin: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  count: number;
  r: number;
  g: number;
  b: number;
}

const TRANSPARENT = -1;
const MIN_PIXELS = 4;
const PADDING = 16;
const HEADER = 32;

// Warna dikelompokkan 8 tingkat per kanal agar sedikit beda warna tetap satu kelompok.
const colorBin = (data: ArrayLike<number>, i: number) => data[i + 3] < 128
  ? TRANSPARENT
  : ((data[i] >> 5) << 6) | ((data[i + 1] >> 5) << 3) | (data[i + 2] >> 5);

const blobWidth = (blob: Blob) => blob.maxX - blob.minX + 1;
const blobHeight = (blob: Blob) => blob.maxY - blob.minY + 1;
const fill = (blob: Blob) => blob.count / (blobWidth(blob) * blobHeight(blob));
const centerY = (blob: Blob) => (blob.minY + blob.maxY) / 2;
const hex = (blob: Blob) => `#${[blob.r, blob.g, blob.b].map((sum) => Math.round(sum / blob.count).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** Warna latar = warna paling sering di tepi gambar. */
function backgroundBin(bins: Int16Array, width: number, height: number) {
  const counts = new Map<number, number>();
  const add = (p: number) => counts.set(bins[p], (counts.get(bins[p]) ?? 0) + 1);
  for (let x = 0; x < width; x += 1) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y += 1) { add(y * width); add(y * width + width - 1); }
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

/** Kelompok piksel bertetangga dengan warna sama, selain latar. */
function findBlobs({ data, width, height }: PixelImage): Blob[] {
  const total = width * height;
  const bins = new Int16Array(total);
  for (let p = 0; p < total; p += 1) bins[p] = colorBin(data, p * 4);
  const background = backgroundBin(bins, width, height);
  const seen = new Uint8Array(total);
  const blobs: Blob[] = [];

  for (let start = 0; start < total; start += 1) {
    const bin = bins[start];
    if (seen[start] || bin === background || bin === TRANSPARENT) continue;
    const blob: Blob = { bin, minX: width, minY: height, maxX: 0, maxY: 0, count: 0, r: 0, g: 0, b: 0 };
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop()!;
      const x = p % width;
      const y = (p - x) / width;
      blob.count += 1;
      blob.r += data[p * 4];
      blob.g += data[p * 4 + 1];
      blob.b += data[p * 4 + 2];
      blob.minX = Math.min(blob.minX, x);
      blob.maxX = Math.max(blob.maxX, x);
      blob.minY = Math.min(blob.minY, y);
      blob.maxY = Math.max(blob.maxY, y);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = ny * width + nx;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || seen[next] || bins[next] !== bin) continue;
        seen[next] = 1;
        stack.push(next);
      }
    }
    if (blob.count >= MIN_PIXELS) blobs.push(blob);
  }
  return blobs;
}

/**
 * Tebak denah dari gambar: bintik kecil seragam = kursi (dikelompokkan per warna jadi area, lalu per baris),
 * bidang besar = elemen (yang terlebar dianggap panggung). Teks, garis, dan bingkai tipis diabaikan.
 * shortcut: heuristik warna, cocok untuk denah digital berwarna dengan latar polos; foto atau denah ramai butuh model visi.
 */
export function imageToDraft(image: PixelImage): SeatMapDraft {
  const blobs = findBlobs(image);
  const sizes = blobs.map((blob) => Math.max(blobWidth(blob), blobHeight(blob))).sort((a, b) => a - b);
  // Kursi biasanya elemen terbanyak, jadi ukuran tengah dianggap ukuran kursi.
  const seatSize = sizes[Math.floor(sizes.length / 2)] ?? 1;
  const scale = SEAT_SIZE / seatSize;
  const px = (value: number) => Math.round(value * scale);

  const isSeat = (blob: Blob) => Math.max(blobWidth(blob), blobHeight(blob)) <= seatSize * 2
    && Math.min(blobWidth(blob), blobHeight(blob)) >= seatSize * 0.4
    && fill(blob) >= 0.3;
  const seatBlobs = blobs.filter(isSeat);
  const areaBlobs = blobs
    .filter((blob) => !isSeat(blob) && blobWidth(blob) * blobHeight(blob) >= (seatSize * 3) ** 2 && fill(blob) >= 0.25)
    .sort((a, b) => blobWidth(b) - blobWidth(a));

  const groups = new Map<number, Blob[]>();
  for (const blob of seatBlobs) groups.set(blob.bin, [...(groups.get(blob.bin) ?? []), blob]);
  const ordered = [...groups.values()].sort((a, b) => Math.min(...a.map(centerY)) - Math.min(...b.map(centerY)));

  const sections: DraftSection[] = [];
  const seats: DraftSeat[] = [];
  ordered.forEach((group, index) => {
    const key = tempKey();
    const minX = Math.min(...group.map((blob) => blob.minX));
    const minY = Math.min(...group.map((blob) => blob.minY));
    const x = Math.max(0, px(minX) - PADDING);
    const y = Math.max(0, px(minY) - HEADER);
    sections.push({
      key,
      label: `Area ${index + 1}`,
      ticket_type_id: null,
      x,
      y,
      width: px(Math.max(...group.map((blob) => blob.maxX)) + 1) + PADDING - x,
      height: px(Math.max(...group.map((blob) => blob.maxY)) + 1) + PADDING - y,
    });

    // Baris baru bila titik tengah turun lebih dari separuh ukuran kursi.
    const rows: Blob[][] = [];
    for (const blob of [...group].sort((a, b) => centerY(a) - centerY(b))) {
      const row = rows[rows.length - 1];
      if (row && centerY(blob) - centerY(row[0]) <= seatSize * 0.6) row.push(blob);
      else rows.push([blob]);
    }
    rows.forEach((row, rowIndex) => {
      const label = rowLabel(rowIndex);
      row.sort((a, b) => a.minX - b.minX).forEach((blob, seatIndex) => {
        seats.push({
          key: tempKey(),
          sectionKey: key,
          label: `${label}${seatIndex + 1}`,
          row_label: label,
          seat_number: seatIndex + 1,
          ticket_type_id: null,
          x: px(blob.minX),
          y: px(blob.minY),
          width: Math.max(8, px(blobWidth(blob))),
          height: Math.max(8, px(blobHeight(blob))),
          status: 'available',
        });
      });
    });
  });

  const shapes: DraftShape[] = areaBlobs.map((blob, index) => ({
    key: tempKey(),
    type: index === 0 ? 'stage' : 'rect',
    label: index === 0 ? 'PANGGUNG' : '',
    x: px(blob.minX),
    y: px(blob.minY),
    width: px(blobWidth(blob)),
    height: px(blobHeight(blob)),
    rotation: 0,
    color: hex(blob),
  }));

  return {
    width: Math.max(200, px(image.width)),
    height: Math.max(200, px(image.height)),
    sections,
    seats,
    shapes,
  };
}
