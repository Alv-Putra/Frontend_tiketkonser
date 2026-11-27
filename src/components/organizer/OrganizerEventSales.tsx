import { CalendarDays, MapPin } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchOrganizerDashboardSales } from '@/services/dashboardService';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { DashboardNotice, DashboardStatus, RefreshButton } from '@/components/workspace/DashboardKit';
import { eventDate } from './OrganizerEventPicker';
import OrganizerSalesSummary from './OrganizerSalesSummary';

export const eventStatuses = {
  draft: { label: 'Draf', tone: 'neutral' },
  pending_review: { label: 'Menunggu persetujuan', tone: 'warning' },
  published: { label: 'Dipublikasikan', tone: 'positive' },
  rejected: { label: 'Ditolak', tone: 'danger' },
  ongoing: { label: 'Berlangsung', tone: 'positive' },
  completed: { label: 'Selesai', tone: 'neutral' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
} as const;

export default function OrganizerEventSales({ event }: { event: OrganizerDashboardEvent }) {
  const { data, status, refresh } = useDashboardData(() => fetchOrganizerDashboardSales(event.id));
  const summary = data?.summary;

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words font-display text-2xl font-extrabold">{event.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/70">
            <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-4" /><time dateTime={event.start_at}>{eventDate.format(new Date(event.start_at))}</time></span>
            {event.venue && <span className="inline-flex min-w-0 items-center gap-1.5 break-all"><MapPin aria-hidden="true" className="size-4 shrink-0" />{event.venue.name}</span>}
            <DashboardStatus {...(eventStatuses[event.status] ?? { label: event.status })} />
          </div>
        </div>
        <RefreshButton loading={status === 'loading'} refresh={refresh} />
      </section>
      {status === 'loading' && !data && <DashboardNotice>Memuat penjualan konser…</DashboardNotice>}
      {status === 'error' && <DashboardNotice error>{data ? 'Pembaruan penjualan gagal. Data terakhir masih ditampilkan.' : 'Penjualan gagal dimuat. Pilih Segarkan untuk mencoba lagi.'}</DashboardNotice>}
      {data && summary && <OrganizerSalesSummary summary={summary} tickets={data.ticket_types} />}
    </>
  );
}
