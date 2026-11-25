'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { animate, m, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { DashboardFrame, DashboardHeader, DashboardNotice, RefreshButton, dashboardOrderStatus, ease } from '@/components/workspace/DashboardKit';
import { dateQuery } from '@/components/workspace/DashboardOverview';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/lib/formatters';
import { fetchOrganizerCharts, fetchOrganizerDashboardEvents } from '@/services/dashboardService';
import useAuthStore from '@/stores/authStore';
import type { DashboardChart, DashboardChartData, DashboardChartInterval, OrganizerChartData } from '@/types/dashboard';
import { SellGauge, StatusBar, TicketClassSales, TicketFunnel, TopConcertsTable, type Legend } from './OrganizerCharts';
import OrganizerEventPicker from './OrganizerEventPicker';
import OrganizerEventSales, { eventStatuses } from './OrganizerEventSales';
import OrganizerTrend from './OrganizerTrend';
import Select from '@/components/ui/Select';

type MetricKey = keyof DashboardChartData['summary'];

const number = new Intl.NumberFormat('id-ID');
const percent = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const day = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const spring = { type: 'spring', stiffness: 420, damping: 36 } as const;
const metrics: { key: MetricKey; title: string; format: (value: number) => string }[] = [
  { key: 'gross_sales', title: 'Penjualan kotor', format: formatCurrency },
  { key: 'tickets_sold', title: 'Tiket terjual', format: number.format },
  { key: 'paid_orders', title: 'Pesanan lunas', format: number.format },
];
const eventColors: Record<string, string> = {
  draft: 'var(--color-mute)', pending_review: 'var(--color-status-warning)', published: 'var(--color-status-success)',
  rejected: 'var(--color-status-danger)', ongoing: 'var(--color-blaze)', completed: 'var(--color-ink)', cancelled: 'var(--color-tangerine)',
};
const eventLegend: Legend = Object.fromEntries(Object.entries(eventStatuses).map(([key, { label }]) => [key, { label, color: eventColors[key] }]));
const countOf = (chart: DashboardChart, key: string) => chart.series[0]?.data[chart.labels.indexOf(key)] ?? 0;

function CountUp({ value, format }: { value: number; format: (value: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    node.textContent = format(0);
    const controls = animate(0, value, { duration: 1.2, ease, onUpdate: (v) => { node.textContent = format(Math.round(v)); } });
    return () => controls.stop();
  }, [value, format, reduced]);

  return <><span ref={ref} aria-hidden="true">{format(value)}</span><span className="sr-only">{format(value)}</span></>;
}

function Segmented<T extends string | number>({ label, id, value, options, onChange }: {
  label: string;
  id: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-ink/10 bg-white p-1">
      {options.map(([option, text]) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`relative min-h-9 cursor-pointer rounded-sm px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze sm:text-sm ${value === option ? 'text-paper' : 'text-ink/65 hover:text-ink'}`}
        >
          {value === option && <m.span layoutId={id} transition={spring} className="absolute inset-0 rounded-sm bg-ink" />}
          <span className="relative">{text}</span>
        </button>
      ))}
    </div>
  );
}

function KpiCards({ data, metric, onMetric }: { data: DashboardChartData; metric: MetricKey; onMetric: (metric: MetricKey) => void }) {
  const reduced = useReducedMotion();
  return (
    <div role="group" aria-label="Metrik penjualan" className="grid gap-3 sm:grid-cols-3">
      {metrics.map(({ key, title, format }, index) => {
        const { value, previous, change_pct: change } = data.summary[key];
        const Icon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : Minus;
        const tone = change > 0 ? 'bg-status-success/45' : change < 0 ? 'bg-status-danger/45' : 'bg-paper';
        const note = change === null ? `Sebelumnya ${format(previous)}` : change > 0 ? `Naik ${percent.format(change)}% dari periode lalu` : change < 0 ? `Turun ${percent.format(-change)}% dari periode lalu` : 'Sama dengan periode lalu';
        const active = metric === key;
        return (
          <m.button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onMetric(key)}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 + index * 0.07, ease }}
            className="relative min-w-0 cursor-pointer rounded-2xl border border-ink/10 bg-white p-4 text-left hover:border-ink/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze sm:p-5"
          >
            {active && <m.span aria-hidden="true" layoutId="organizer-kpi" transition={spring} className="absolute -inset-px rounded-2xl border-2 border-blaze" />}
            <span className="sr-only">Tampilkan tren </span>
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm text-ink/60">{title}</span>
              {change !== null && (
                <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums text-ink ${tone}`}>
                  <Icon aria-hidden="true" className="size-3" />{percent.format(Math.abs(change))}%
                </span>
              )}
            </span>
            <span className="mt-4 block wrap-anywhere font-display text-2xl font-extrabold leading-none tracking-tight tabular-nums">
              <CountUp value={value} format={format} />
            </span>
            <span className="mt-3 block text-xs text-ink/70">{note}</span>
          </m.button>
        );
      })}
    </div>
  );
}

function DarkStat({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-onyx p-4 sm:p-5">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-3 font-display text-3xl font-extrabold leading-none tracking-tight tabular-nums text-white"><CountUp value={value} format={number.format} /></p>
      <p className="mt-2 text-xs text-mute">{note}</p>
    </div>
  );
}

function Analytics({ days, interval, eventId, metric, onMetric }: {
  days: number;
  interval: DashboardChartInterval;
  eventId: string;
  metric: MetricKey;
  onMetric: (metric: MetricKey) => void;
}) {
  const reduced = useReducedMotion();
  const { data, status, refresh } = useDashboardData<OrganizerChartData>(() => fetchOrganizerCharts({ ...dateQuery(days, interval), event_id: eventId || undefined }));

  if (!data) {
    return status === 'error' ? (
      <div className="flex flex-wrap items-center gap-3">
        <DashboardNotice error>Analitik penjualan gagal dimuat.</DashboardNotice>
        <RefreshButton loading={false} refresh={refresh} />
      </div>
    ) : <DashboardNotice>Memuat analitik penjualan…</DashboardNotice>;
  }

  const { charts, summary } = data;
  const series = charts.sales_trend.series.find(({ key }) => key === metric);
  const format = metrics.find(({ key }) => key === metric).format;
  const checkInTotal = charts.check_in.series[0]?.data.reduce((a, b) => a + b, 0) ?? 0;
  const orderTotal = charts.order_status.series[0]?.data.reduce((a, b) => a + b, 0) ?? 0;

  return (
    <section aria-label="Analitik penjualan" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/60">{day.format(new Date(data.meta.start_date))} sampai {day.format(new Date(data.meta.end_date))}, dibanding periode sebelumnya</p>
        <RefreshButton loading={status === 'loading'} refresh={refresh} />
      </div>
      {status === 'error' && <DashboardNotice error>Pembaruan analitik gagal. Data terakhir masih ditampilkan.</DashboardNotice>}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="min-w-0 space-y-4">
          <KpiCards data={data} metric={metric} onMetric={onMetric} />
          {series
            ? <OrganizerTrend key={metric} labels={charts.sales_trend.labels} series={series} interval={interval} total={format(summary[metric].value)} />
            : <DashboardNotice>Tren untuk metrik ini belum tersedia.</DashboardNotice>}
          <div className="grid gap-4 md:grid-cols-2">
            <SellGauge chart={charts.ticket_type_sales} />
            <StatusBar title="Status pesanan" subtitle="Pesanan di periode ini." unit="pesanan" chart={charts.order_status} legend={dashboardOrderStatus} />
          </div>
        </div>

        <m.div
          initial={reduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2, ease }}
          className="min-w-0 space-y-3 rounded-[28px] bg-ink p-3 sm:p-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <DarkStat label="Sudah masuk" value={countOf(charts.check_in, 'checked_in')} note={`Dari ${number.format(checkInTotal)} e-ticket`} />
            <DarkStat label="Menunggu bayar" value={countOf(charts.order_status, 'pending')} note={`Dari ${number.format(orderTotal)} pesanan`} />
          </div>
          <TicketFunnel tickets={charts.ticket_type_sales} checkIn={charts.check_in} />
          <TopConcertsTable chart={charts.top_events} />
        </m.div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TicketClassSales chart={charts.ticket_type_sales} />
        <StatusBar title="Status konser" subtitle="Posisi semua konsermu saat ini." unit="konser" chart={charts.event_status} legend={eventLegend} />
      </div>
    </section>
  );
}

function OrganizerHome() {
  const user = useAuthStore((state) => state.user);
  const reduced = useReducedMotion();
  const events = useDashboardData(() => fetchOrganizerDashboardEvents(1));
  const [days, setDays] = useState(30);
  const [interval, setInterval] = useState<DashboardChartInterval>('day');
  const [eventId, setEventId] = useState('');
  const [metric, setMetric] = useState<MetricKey>('gross_sales');
  const name = (user?.name || user?.full_name || '').split(' ')[0];

  return (
    <>
      <m.header
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-balance font-display text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
            {name ? `Halo, ${name}` : 'Dashboard organizer'}
          </h1>
          <p className="mt-2 text-sm text-ink/70">Penjualan, check-in, dan status konsermu dalam satu layar.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
            {/* shortcut: hanya halaman pertama daftar konser; tambah pencarian server bila konser organizer banyak */}
            <Select
              aria-label="Konser"
              value={eventId}
              onChange={setEventId}
              options={[{ value: '', label: 'Semua konser' }, ...(events.data?.data.map(({ id, title }) => ({ value: id, label: title })) ?? [])]}
            />
          </div>
          <Segmented<number> label="Periode analitik" id="organizer-days" value={days} onChange={setDays} options={[[7, '7 hari'], [30, '30 hari'], [90, '90 hari']]} />
          <Segmented<DashboardChartInterval> label="Kelompokkan grafik" id="organizer-interval" value={interval} onChange={setInterval} options={[['day', 'Harian'], ['week', 'Mingguan'], ['month', 'Bulanan']]} />
        </div>
      </m.header>

      <Analytics key={`${days}-${interval}-${eventId}`} days={days} interval={interval} eventId={eventId} metric={metric} onMetric={setMetric} />
    </>
  );
}

export default function OrganizerDashboard({ salesOnly = false }: { salesOnly?: boolean }) {
  if (salesOnly) {
    return (
      <DashboardFrame>
        <DashboardHeader title="Laporan Penjualan Tiket" subtitle="Analisis pendapatan dan performa penjualan per konser musik." />
        <section aria-labelledby="detail-penjualan-konser" className="space-y-3">
          <h2 id="detail-penjualan-konser" className="font-display text-xl font-extrabold">Pilih konser untuk analisis</h2>
          <OrganizerEventPicker>
            {(event) => <OrganizerEventSales key={event.id} event={event} />}
          </OrganizerEventPicker>
        </section>
      </DashboardFrame>
    );
  }

  return <DashboardFrame><OrganizerHome /></DashboardFrame>;
}
