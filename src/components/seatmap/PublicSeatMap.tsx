'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchPublicSeatMap } from '@/services/dashboardService';
import SeatMapViewer from './SeatMapViewer';

// Event tanpa denah (404) atau id non-numerik (400) cukup tidak menampilkan apa pun.
const load = (eventId: string) => fetchPublicSeatMap(eventId).catch(() => null);

/** Denah kursi untuk pembeli: SVG dengan status kursi realtime. */
export default function PublicSeatMap({ eventId }: { eventId: string }) {
  const { data } = useDashboardData(() => load(eventId));
  if (!data) return null;

  return (
    <section aria-labelledby="denah-kursi" className="rounded-2xl bg-paper p-4 text-ink sm:p-6">
      <h2 id="denah-kursi" className="font-display text-lg font-bold">Denah kursi</h2>
      <p className="mb-4 mt-1 text-xs text-ink/65">Lihat posisi kursi dan ketersediaannya. Pemesanan dilakukan lewat aplikasi mobile.</p>
      <SeatMapViewer map={data} live />
    </section>
  );
}
