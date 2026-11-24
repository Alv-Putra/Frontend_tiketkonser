'use client';

import { m, useReducedMotion } from 'framer-motion';
import { Banknote, CalendarDays, ClipboardList, MapPin, Music, QrCode, Ticket, TicketCheck } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/lib/formatters';
import { fetchOrganizerDashboardSales } from '@/services/dashboardService';
import type { OrganizerDashboardEvent, OrganizerDashboardSales } from '@/types/dashboard';
import { DashboardFrame, DashboardHeader, DashboardLinks, DashboardNotice, DashboardStatus, MetricGrid, Panel, PanelHead, RefreshButton, ease } from './DashboardKit';
import OrganizerEventPicker, { eventDate } from './OrganizerEventPicker';

const numberFormat = new Intl.NumberFormat('id-ID');
const eventStatuses = {
  draft: { label: 'Draf', tone: 'neutral' },
  pending_review: { label: 'Menunggu persetujuan', tone: 'warning' },
  published: { label: 'Dipublikasikan', tone: 'positive' },
  rejected: { label: 'Ditolak', tone: 'danger' },
  ongoing: { label: 'Berlangsung', tone: 'positive' },
  completed: { label: 'Selesai', tone: 'neutral' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
} as const;

function TicketSales({ tickets }: { tickets: OrganizerDashboardSales['ticket_types'] }) {
  const reduced = useReducedMotion();
  return (
    <Panel>
      <PanelHead title="Penjualan per kelas tiket" subtitle="Jumlah tiket terbayar dibandingkan dengan kuota tiap kelas." />
      {tickets.length ? (
        <ul className="grid gap-3 lg:grid-cols-2">
          {tickets.map((ticket) => {
            const proportion = ticket.quota > 0 ? Math.min(ticket.paid_tickets / ticket.quota, 1) : 0;
            return (
              <li key={ticket.id} className="min-w-0 rounded-xl border border-ink/10 bg-paper p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="min-w-0 break-words font-display font-bold">{ticket.name}</h3>
                  <p className="text-sm font-semibold tabular-nums">{formatCurrency(ticket.revenue)}</p>
                </div>
                <div aria-hidden="true" className="my-3 h-2 overflow-hidden rounded-full bg-ink/10">
                  <m.div className="h-full origin-left rounded-full bg-blaze" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: proportion }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.55, ease }} style={reduced ? { scaleX: proportion } : undefined} />
                </div>
                <p className="flex flex-wrap justify-between gap-2 text-xs tabular-nums text-ink/75">
                  <span>{numberFormat.format(ticket.paid_tickets)} / {numberFormat.format(ticket.quota)} terbayar</span>
                  <span>{numberFormat.format(ticket.available)} tersedia</span>
                </p>
              </li>
            );
          })}
        </ul>
      ) : <p className="text-sm text-ink/65">Belum ada kelas tiket untuk konser ini.</p>}
    </Panel>
  );
}

function EventSales({ event }: { event: OrganizerDashboardEvent }) {
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
      {data && summary && (
        <>
          <MetricGrid items={[
            { label: 'Pendapatan tiket', value: formatCurrency(summary.revenue), icon: Banknote },
            { label: 'Pesanan lunas', value: numberFormat.format(summary.paid_orders), icon: ClipboardList },
            { label: 'Tiket terbayar', value: numberFormat.format(summary.paid_tickets), icon: TicketCheck },
            { label: 'Kuota tersedia', value: numberFormat.format(Math.max(0, summary.quota - summary.sold)), icon: Ticket, note: `Dari ${numberFormat.format(summary.quota)} tiket` },
          ]} />
          <TicketSales tickets={data.ticket_types} />
        </>
      )}
    </>
  );
}

export default function OrganizerDashboard({ salesOnly = false }: { salesOnly?: boolean }) {
  return (
    <DashboardFrame>
      <DashboardHeader title={salesOnly ? 'Laporan penjualan tiket' : 'Ringkasan konser'} subtitle="Pantau pembayaran tiket dan kuota konsermu." />
      <OrganizerEventPicker>{(event) => <EventSales key={event.id} event={event} />}</OrganizerEventPicker>
      {!salesOnly && <DashboardLinks items={[
        { label: 'Konser saya', href: '/organizer/concerts', icon: Music },
        { label: 'Kelola kelas tiket', href: '/organizer/categories', icon: Ticket },
        { label: 'Laporan penjualan', href: '/organizer/sales', icon: ClipboardList },
        { label: 'Check-in tiket', href: '/organizer/checkin', icon: QrCode },
      ]} />}
    </DashboardFrame>
  );
}
