'use client';

import { useId, useState, type PointerEvent } from 'react';
import { ChartNoAxesCombined } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { DashboardChartInterval, DashboardChartSeries } from '@/types/dashboard';

const number = new Intl.NumberFormat('id-ID');
const compact = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export default function DashboardTrend({ labels, series, interval }: {
  labels: string[];
  series: DashboardChartSeries;
  interval: DashboardChartInterval;
}) {
  const gradient = useId();
  const [focused, setFocused] = useState<number | null>(null);
  const values = labels.map((_, index) => series.data[index] ?? 0);
  const peak = Math.max(0, ...values);
  const last = Math.max(0, values.length - 1);
  const selected = Math.min(focused ?? values.indexOf(peak), last);
  const x = (index: number) => last === 0 ? 50 : index * 100 / last;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, peak) / 4));
  const step = Math.max(1, Math.ceil(peak / (4 * magnitude)) * magnitude);
  const y = (value: number) => 96 - value * 92 / (4 * step);
  const line = values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
  const area = `${x(0)},96 ${line} ${x(last)},96`;
  const label = (index: number) => (interval === 'month' ? month : date).format(new Date(labels[index]));
  const value = (amount: number) => series.unit === 'IDR' ? formatCurrency(amount) : number.format(amount);
  const milestones = [...new Set([0, Math.round(last / 3), Math.round(2 * last / 3), last])];

  function selectPoint(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    setFocused(Math.round(fraction * last));
  }

  return (
    <section className="min-w-0 rounded-2xl border border-line bg-ink p-4 text-paper sm:p-6" aria-label="Grafik tren penjualan">
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold">Tren penjualan</h2>
        <p className="mt-1 flex items-center gap-2 text-xs text-paper/70">
          <span aria-hidden="true" className="size-2 rounded-full bg-tangerine" />
          {series.name}
        </p>
      </div>

      {peak > 0 ? (
        <>
          <div className="mb-3 flex min-h-9 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{value(values[selected])}</span>
            <span className="text-xs font-medium text-paper/75">{label(selected)}</span>
          </div>
          <div className="grid h-40 min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2 sm:h-44 sm:gap-3">
            <div className="flex flex-col justify-between py-0.5 text-right text-[11px] tabular-nums text-paper/70" aria-hidden="true">
              {[4, 3, 2, 1, 0].map((tick) => <span key={tick}>{compact.format(tick * step)}</span>)}
            </div>
            <div className="relative min-w-0 touch-pan-y" onPointerMove={selectPoint} onPointerDown={selectPoint} aria-hidden="true">
              <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={gradient} x1="0" x2="0" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-blaze)" stopOpacity=".35" />
                    <stop offset="100%" stopColor="var(--color-blaze)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[4, 27, 50, 73, 96].map((row) => <line key={row} x1="0" x2="100" y1={row} y2={row} className="stroke-paper/20" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />)}
                <polygon points={area} fill={`url(#${gradient})`} />
                <polyline points={line} fill="none" strokeWidth="2.5" strokeLinejoin="round" className="stroke-tangerine" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="pointer-events-none absolute inset-y-[4%] border-l border-dashed border-paper/55" style={{ left: `${x(selected)}%` }} />
              <span className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-tangerine ring-2 ring-tangerine/50" style={{ left: `${x(selected)}%`, top: `${y(values[selected])}%` }} />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-[11px] tabular-nums text-paper/70" aria-hidden="true">
            {milestones.map((index) => <span key={index}>{label(index)}</span>)}
          </div>
          {last > 0 && (
            <input
              type="range"
              min={0}
              max={last}
              value={selected}
              aria-label="Periode pada grafik"
              aria-valuetext={`${label(selected)}, ${value(values[selected])}`}
              onChange={(event) => setFocused(Number(event.target.value))}
              className="mt-2 block h-8 w-full cursor-pointer accent-tangerine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tangerine"
            />
          )}
        </>
      ) : (
        <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-paper/25 px-4 py-8 text-center">
          <div className="space-y-3">
            <ChartNoAxesCombined className="mx-auto size-7 text-tangerine" aria-hidden="true" />
            <p className="text-sm text-paper/75">Belum ada penjualan pada periode ini.</p>
          </div>
        </div>
      )}
    </section>
  );
}
