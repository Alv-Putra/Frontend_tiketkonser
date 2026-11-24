import { m, useReducedMotion } from 'framer-motion';
import { Banknote, ClipboardList, Ticket, TicketCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { OrganizerDashboardSales } from '@/types/dashboard';
import { MetricGrid, Panel, PanelHead, ease } from './DashboardKit';

const numberFormat = new Intl.NumberFormat('id-ID');

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

export default function OrganizerSalesSummary({ summary, tickets }: {
  summary: OrganizerDashboardSales['summary'];
  tickets: OrganizerDashboardSales['ticket_types'];
}) {
  return (
    <>
      <MetricGrid items={[
        { label: 'Pendapatan tiket', value: formatCurrency(summary.revenue), icon: Banknote },
        { label: 'Pesanan lunas', value: numberFormat.format(summary.paid_orders), icon: ClipboardList },
        { label: 'Tiket terbayar', value: numberFormat.format(summary.paid_tickets), icon: TicketCheck },
        { label: 'Kuota tersedia', value: numberFormat.format(Math.max(0, summary.quota - summary.sold)), icon: Ticket, note: `Dari ${numberFormat.format(summary.quota)} tiket` },
      ]} />
      <TicketSales tickets={tickets} />
    </>
  );
}
