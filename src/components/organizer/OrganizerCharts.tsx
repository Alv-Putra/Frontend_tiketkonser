'use client';

import { useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';
import { useGsap } from '@/lib/gsap';
import type { DashboardChart } from '@/types/dashboard';
import { Panel, PanelHead, ease } from '@/components/workspace/DashboardKit';

const number = new Intl.NumberFormat('id-ID');
const share = new Intl.NumberFormat('id-ID', { style: 'percent', maximumFractionDigits: 1 });
const BARS_PER_STAGE = 8;

export type Legend = Record<string, { label: string; color: string }>;

const series = (chart: DashboardChart, key: string) => chart.series.find((item) => item.key === key)?.data ?? [];
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function StatusBar({ title, subtitle, unit, chart, legend }: {
  title: string;
  subtitle: string;
  unit: string;
  chart: DashboardChart;
  legend: Legend;
}) {
  const reduced = useReducedMotion();
  const values = chart.series[0]?.data ?? [];
  const entries = chart.labels.map((key, index) => ({ key, ...(legend[key] ?? { label: key, color: 'var(--color-mute)' }), count: values[index] ?? 0 }));
  const total = sum(entries.map(({ count }) => count));

  return (
    <Panel>
      <div className="mb-4 flex items-start justify-between gap-3">
        <PanelHead title={title} subtitle={subtitle} />
        <p className="shrink-0 text-right">
          <span className="block font-display text-2xl font-extrabold leading-none tabular-nums">{number.format(total)}</span>
          <span className="text-xs text-ink/60">{unit}</span>
        </p>
      </div>
      <div aria-hidden="true" className="flex h-2.5 gap-0.5">
        {total ? entries.filter(({ count }) => count).map(({ key, color, count, label }, index) => (
          <m.span
            key={key}
            title={`${label}: ${number.format(count)}`}
            className="h-full origin-left rounded-full"
            style={{ flexGrow: count, backgroundColor: color }}
            initial={reduced ? false : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : index * 0.08, ease }}
          />
        )) : <span className="h-full flex-1 rounded-full bg-paper" />}
      </div>
      <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-x-6 gap-y-2.5 text-sm">
        {entries.map(({ key, label, color, count }) => (
          <li key={key} className={`flex min-w-0 items-center justify-between gap-2 ${count ? '' : 'text-ink/45'}`}>
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="truncate">{label}</span>
            </span>
            <span className="font-semibold tabular-nums">{number.format(count)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SellGauge({ chart }: { chart: DashboardChart }) {
  const reduced = useReducedMotion();
  const sold = sum(series(chart, 'sold'));
  const quota = sold + sum(series(chart, 'available'));
  const ratio = quota ? sold / quota : 0;

  return (
    <Panel>
      <PanelHead title="Kuota terjual" subtitle="Semua kelas tiket, kondisi terkini." />
      <div className="relative mx-auto aspect-[2/1] w-full max-w-64">
        <svg aria-hidden="true" viewBox="0 0 100 52" className="size-full overflow-visible">
          <path d="M6,50 A44,44 0 0 1 94,50" fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-ink/10" />
          <m.path
            d="M6,50 A44,44 0 0 1 94,50"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${ratio * 100} 100`}
            className="stroke-blaze"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: ratio ? 1 : 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.5 }}
          />
        </svg>
        {/* Jarum berputar dari kiri ke posisi nilai. */}
        <m.span
          aria-hidden="true"
          className="absolute bottom-[3.8%] left-1/2 h-[88%] w-3 -translate-x-1/2 origin-bottom"
          initial={reduced ? false : { rotate: -90 }}
          whileInView={{ rotate: ratio * 180 - 90 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1.1, ease }}
          style={reduced ? { rotate: ratio * 180 - 90 } : undefined}
        >
          <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink" />
        </m.span>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-display text-3xl font-extrabold leading-none tabular-nums">{share.format(ratio)}</p>
          <p className="mt-1 text-xs text-ink/60">{number.format(sold)} dari {number.format(quota)} tiket</p>
        </div>
      </div>
    </Panel>
  );
}

export function TicketFunnel({ tickets, checkIn }: { tickets: DashboardChart; checkIn: DashboardChart }) {
  const root = useRef<HTMLDivElement>(null);
  const status = (key: string) => checkIn.series[0]?.data[checkIn.labels.indexOf(key)] ?? 0;
  const sold = sum(series(tickets, 'sold'));
  const quota = sold + sum(series(tickets, 'available'));
  const active = status('issued') + status('checked_in');
  const stages = [
    { label: 'Kuota', value: quota },
    { label: 'Terjual', value: sold },
    { label: 'E-ticket aktif', value: active },
    { label: 'Sudah masuk', value: status('checked_in') },
  ];
  const attendance = active ? status('checked_in') / active : 0;

  useGsap(({ gsap }) => {
    gsap.from('[data-bar]', {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.7,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, scroller: root.current?.closest('main'), start: 'top 85%', once: true },
    });
  }, root, [quota, active]);

  return (
    <section aria-label="Perjalanan tiket" className="rounded-2xl border border-line bg-onyx p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold text-white">Perjalanan tiket</h2>
          <p className="mt-1 text-sm text-mute">Dari kuota sampai pemindaian di gerbang.</p>
        </div>
        <div>
          <p className="text-xs text-mute">Tingkat kehadiran</p>
          <p className="font-display text-4xl font-extrabold leading-none tracking-tight tabular-nums text-white">{share.format(attendance)}</p>
        </div>
      </div>
      {quota ? (
        <div ref={root} className="mt-6 grid grid-cols-4 gap-1.5">
          {stages.map((stage, index) => {
            const next = stages[index + 1]?.value ?? stage.value;
            return (
              <div key={stage.label} className="min-w-0">
                <p className="mb-2 text-sm font-semibold tabular-nums text-white">{share.format(stage.value / quota)}</p>
                <div aria-hidden="true" className="flex h-32 items-end gap-[3px] sm:h-40">
                  {Array.from({ length: BARS_PER_STAGE }, (_, bar) => {
                    const value = stage.value + (next - stage.value) * bar / BARS_PER_STAGE;
                    return (
                      <span
                        key={bar}
                        data-bar
                        className={`min-w-0 flex-1 rounded-full ${bar === 0 ? 'bg-blaze' : 'bg-white/15'}`}
                        style={{ height: `${Math.max(4, 100 * value / quota)}%` }}
                      />
                    );
                  })}
                </div>
                <p className="mt-3 truncate text-xs text-mute">{stage.label}</p>
                <p className="text-sm font-semibold tabular-nums text-white">{number.format(stage.value)}</p>
              </div>
            );
          })}
        </div>
      ) : <p className="mt-6 text-sm text-mute">Belum ada kuota tiket. Tambahkan kelas tiket untuk konsermu.</p>}
    </section>
  );
}

export function TopConcertsTable({ chart }: { chart: DashboardChart }) {
  const reduced = useReducedMotion();
  const revenue = series(chart, 'gross_sales');
  const sold = series(chart, 'tickets_sold');

  return (
    <section aria-labelledby="konser-terlaris" className="rounded-2xl border border-line bg-onyx p-4 sm:p-6">
      <h2 id="konser-terlaris" className="font-display text-lg font-bold text-white">Konser terlaris</h2>
      <p className="mt-1 text-sm text-mute">Menurut penjualan kotor di periode ini.</p>
      {chart.labels.length ? (
        <table className="mt-4 w-full table-fixed text-left text-sm">
          <thead>
            <tr className="text-mute">
              <th scope="col" className="w-1/2 py-2 font-normal">Konser</th>
              <th scope="col" className="w-1/5 py-2 text-right font-normal">Tiket</th>
              <th scope="col" className="py-2 text-right font-normal">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {chart.labels.map((label, index) => (
              <m.tr
                key={`${label}-${index}`}
                className="border-t border-dashed border-white/10 text-white"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : index * 0.06 }}
              >
                <th scope="row" className="truncate py-3 pr-2 font-semibold" title={label}>{label}</th>
                <td className="py-3 text-right tabular-nums">{number.format(sold[index] ?? 0)}</td>
                <td className="py-3 pl-2 text-right tabular-nums wrap-anywhere">{formatCurrency(revenue[index] ?? 0)}</td>
              </m.tr>
            ))}
          </tbody>
        </table>
      ) : <p className="mt-4 text-sm text-mute">Belum ada penjualan di periode ini.</p>}
    </section>
  );
}

export function TicketClassSales({ chart }: { chart: DashboardChart }) {
  const root = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const sold = series(chart, 'sold');
  const left = series(chart, 'available');

  useGsap(({ gsap }) => {
    gsap.from('[data-row]', {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: root.current, scroller: root.current?.closest('main'), start: 'top 90%', once: true },
    });
  }, root, [chart]);

  return (
    <Panel>
      <PanelHead title="Kelas tiket" subtitle="Terjual dibanding kuota tiap kelas, kondisi terkini." />
      {chart.labels.length ? (
        <ul ref={root} className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {chart.labels.map((label, index) => {
            const total = (sold[index] ?? 0) + (left[index] ?? 0);
            const ratio = total ? (sold[index] ?? 0) / total : 0;
            return (
              <li key={label} data-row className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-semibold" title={label}>{label}</span>
                  <span className="shrink-0 tabular-nums text-ink/60"><span className="font-semibold text-ink">{number.format(sold[index] ?? 0)}</span> / {number.format(total)}</span>
                </div>
                <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                  <m.div
                    className="h-full origin-left rounded-full bg-blaze"
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: ratio }}
                    viewport={{ once: true }}
                    transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.1 + index * 0.06, ease }}
                    style={reduced ? { scaleX: ratio } : undefined}
                  />
                </div>
                <p className="mt-1 text-xs tabular-nums text-ink/60">{share.format(ratio)} terjual, {number.format(left[index] ?? 0)} tersisa</p>
              </li>
            );
          })}
        </ul>
      ) : <p className="text-sm text-ink/70">Belum ada kelas tiket. Tambahkan dari menu Kelas tiket.</p>}
    </Panel>
  );
}
