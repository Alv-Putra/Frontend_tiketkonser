'use client';

import { useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Banknote, CalendarDays, Minus, ShoppingBag, Ticket } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/lib/formatters';
import type { DashboardChartQuery } from '@/services/dashboardService';
import type { DashboardChart, DashboardChartData, DashboardChartInterval } from '@/types/dashboard';
import { DashboardFrame, DashboardHeader, DashboardNotice, Panel, PanelHead, RefreshButton, dashboardOrderStatus } from './DashboardKit';
import DashboardTrend from './DashboardTrend';

type MetricKey = keyof DashboardChartData['summary'];
type LoadCharts = (query: DashboardChartQuery) => Promise<DashboardChartData>;

const number = new Intl.NumberFormat('id-ID');
const percent = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, signDisplay: 'exceptZero' });
const date = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const jakartaDay = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' });
const filterClass = 'min-h-11 rounded-xl border border-ink/15 bg-white text-sm font-semibold text-ink [color-scheme:light] hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze';
const metricLabels = {
  gross_sales: { title: 'Penjualan kotor', icon: Banknote },
  tickets_sold: { title: 'Tiket terjual', icon: Ticket },
  paid_orders: { title: 'Pesanan lunas', icon: ShoppingBag },
} as const;

function dateQuery(days: number, interval: DashboardChartInterval) {
  const end_date = jakartaDay.format(new Date());
  const start = new Date(end_date);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { start_date: start.toISOString().slice(0, 10), end_date, interval };
}

function MetricCards({ data, metric, onMetric }: {
  data: DashboardChartData;
  metric: MetricKey;
  onMetric: (metric: MetricKey) => void;
}) {
  return (
    <div role="group" aria-label="Metrik penjualan" className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {(Object.keys(metricLabels) as MetricKey[]).map((key, index) => {
        const { title, icon: Icon } = metricLabels[key];
        const { value, previous, change_pct: change } = data.summary[key];
        const format = key === 'gross_sales' ? formatCurrency : number.format;
        const ChangeIcon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
        const tone = change > 0 ? 'bg-status-success/45' : change < 0 ? 'bg-status-danger/40' : 'bg-ink/5';

        return (
          <button
            key={key}
            type="button"
            aria-pressed={metric === key}
            onClick={() => onMetric(key)}
            className={`flex min-w-0 flex-col rounded-2xl border bg-white p-3 text-left hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze sm:p-5 ${metric === key ? 'border-blaze/60' : 'border-ink/10'} ${index === 0 ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <span className="sr-only">Tampilkan tren</span>
            <span className="flex w-full flex-wrap items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink/75">
                <Icon className="size-4 shrink-0" aria-hidden="true" /> {title}
              </span>
              {change !== null && (
                <span className={`inline-flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-xs font-bold tabular-nums text-ink ${tone}`}>
                  <ChangeIcon aria-hidden="true" className="size-3.5" />{percent.format(change)}%
                </span>
              )}
            </span>
            <span className="mt-3 max-w-full wrap-anywhere font-display text-2xl font-extrabold leading-none tracking-tight tabular-nums sm:text-3xl">{format(value)}</span>
            <span className="mt-2 text-xs leading-relaxed tabular-nums text-ink/70">Sebelumnya {format(previous)}</span>
          </button>
        );
      })}
    </div>
  );
}

function OrderDistribution({ chart }: { chart: DashboardChart }) {
  const values = chart.series[0]?.data ?? [];
  const entries = chart.labels.map((key, index) => ({
    key,
    ...(dashboardOrderStatus[key] ?? { label: key, color: 'var(--color-line)' }),
    count: values[index] ?? 0,
  }));
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);
  let offset = 0;
  const stops: string[] = [];
  for (const { color, count } of entries) {
    if (count === 0) continue;
    const end = offset + 100 * count / total;
    stops.push(`${color} ${offset}% ${end}%`);
    offset = end;
  }

  const ring = stops.length > 1
    ? `conic-gradient(${stops.join(', ')})`
    : entries.find(({ count }) => count > 0)?.color ?? 'var(--color-paper)';

  return (
    <Panel>
      <PanelHead title="Status pesanan" />
      <div className="mb-4 flex justify-center">
        <div
          className="grid size-32 place-items-center rounded-full p-3 sm:size-36"
          style={{ background: ring }}
        >
          <div className="grid size-full place-content-center rounded-full bg-white text-center">
            <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{number.format(total)}</span>
            <span className="text-xs text-ink/70">Total pesanan</span>
          </div>
        </div>
      </div>
      {total > 0 ? (
        <ul className="grid gap-1.5">
          {entries.map(({ key, label, count, color }) => (
            <li key={key} className="flex min-w-0 items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-ink/75">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
              <span className="font-semibold tabular-nums">{number.format(count)}</span>
            </li>
          ))}
        </ul>
      ) : <p className="text-center text-sm text-ink/70">Belum ada pesanan pada periode ini.</p>}
    </Panel>
  );
}

function TopConcerts({ chart }: { chart: DashboardChart }) {
  const revenue = chart.series.find(({ key }) => key === 'gross_sales')?.data ?? [];
  const sold = chart.series.find(({ key }) => key === 'tickets_sold')?.data ?? [];

  return (
    <Panel>
      <PanelHead title="Konser terlaris" subtitle="Diurutkan menurut penjualan kotor pada periode ini." />
      {chart.labels.length > 0 ? (
        <table className="w-full table-fixed text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/70">
              <th scope="col" className="w-2/5 py-2.5 pr-2 font-semibold">Konser</th>
              <th scope="col" className="w-1/5 py-2.5 text-right font-semibold">Tiket</th>
              <th scope="col" className="w-2/5 py-2.5 pl-2 text-right font-semibold">Penjualan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {chart.labels.map((label, index) => (
              <tr key={index}>
                <th scope="row" className="wrap-anywhere py-3 pr-2 font-semibold">{label}</th>
                <td className="wrap-anywhere py-3 text-right tabular-nums">{number.format(sold[index] ?? 0)}</td>
                <td className="wrap-anywhere py-3 pl-2 text-right font-semibold tabular-nums">{formatCurrency(revenue[index] ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="text-sm text-ink/70">Belum ada konser dengan penjualan pada periode ini.</p>}
    </Panel>
  );
}

function AnalyticsContent({ load, days, interval, metric, onMetric, showTopConcerts }: {
  load: LoadCharts;
  days: number;
  interval: DashboardChartInterval;
  metric: MetricKey;
  onMetric: (metric: MetricKey) => void;
  showTopConcerts: boolean;
}) {
  const { data, status, refresh } = useDashboardData(() => load(dateQuery(days, interval)));
  const series = data?.charts.sales_trend.series.find(({ key }) => key === metric);

  return (
    <section aria-label="Analitik penjualan" className="space-y-3">
      {status === 'loading' && !data && (
        <DashboardNotice>Memuat analitik penjualan…</DashboardNotice>
      )}
      {status === 'error' && (
        <div className="flex flex-wrap items-center gap-3">
          <DashboardNotice error>{data ? 'Pembaruan analitik gagal. Data terakhir masih ditampilkan.' : 'Analitik penjualan gagal dimuat.'}</DashboardNotice>
          <RefreshButton loading={false} refresh={refresh} />
        </div>
      )}
      {data && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-xs font-semibold text-ink/70">{date.format(new Date(data.meta.start_date))} – {date.format(new Date(data.meta.end_date))}</p>
            <p className="text-xs text-ink/70">Dibanding periode sebelumnya</p>
          </div>
          <MetricCards data={data} metric={metric} onMetric={onMetric} />
          <div className="grid gap-3 xl:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
            {series ? (
              <DashboardTrend key={metric} labels={data.charts.sales_trend.labels} series={series} interval={interval} />
            ) : <DashboardNotice>Tren untuk metrik ini belum tersedia.</DashboardNotice>}
            <OrderDistribution chart={data.charts.order_status} />
          </div>
          {showTopConcerts && <TopConcerts chart={data.charts.top_events} />}
        </>
      )}
    </section>
  );
}

export default function DashboardOverview({ title, subtitle, load, showTopConcerts = false, children }: {
  title: string;
  subtitle: string;
  load: LoadCharts;
  showTopConcerts?: boolean;
  children: ReactNode;
}) {
  const [days, setDays] = useState(30);
  const [interval, setInterval] = useState<DashboardChartInterval>('day');
  const [metric, setMetric] = useState<MetricKey>('gross_sales');

  return (
    <DashboardFrame>
      <DashboardHeader title={title} subtitle={subtitle}>
        <label className="relative inline-flex items-center">
          <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-ink/75" />
          <span className="sr-only">Periode analitik</span>
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className={`${filterClass} py-2 pr-3 pl-9`}
          >
            <option value={7}>7 hari terakhir</option>
            <option value={30}>30 hari terakhir</option>
            <option value={90}>90 hari terakhir</option>
          </select>
        </label>
        <select
          aria-label="Kelompokkan grafik"
          value={interval}
          onChange={(event) => setInterval(event.target.value as DashboardChartInterval)}
          className={`${filterClass} px-2 sm:px-3`}
        >
          <option value="day">Harian</option>
          <option value="week">Mingguan</option>
          <option value="month">Bulanan</option>
        </select>
      </DashboardHeader>

      <AnalyticsContent key={`${days}-${interval}`} load={load} days={days} interval={interval} metric={metric} onMetric={setMetric} showTopConcerts={showTopConcerts} />
      {children}
    </DashboardFrame>
  );
}
