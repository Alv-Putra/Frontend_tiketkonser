'use client';

import { useId, useState, type PointerEvent } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';
import type { DashboardChartInterval, DashboardChartSeries } from '@/types/dashboard';
import { ease } from '@/components/workspace/DashboardKit';

const number = new Intl.NumberFormat('id-ID');
const compact = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit', timeZone: 'UTC' });

type Point = [number, number];

// Kurva Catmull-Rom; titik kontrol dijepit agar tidak turun di bawah sumbu.
export function smoothPath(points: Point[]) {
  if (!points.length) return '';
  const clamp = (y: number) => Math.min(96, Math.max(0, y));
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, clamp(p1[1] + (p2[1] - p0[1]) / 6)];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, clamp(p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C${c1} ${c2} ${p2}`;
  }
  return d;
}

export default function OrganizerTrend({ labels, series, interval, total }: {
  labels: string[];
  series: DashboardChartSeries;
  interval: DashboardChartInterval;
  total: string;
}) {
  const gradient = useId();
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState<number | null>(null);
  const values = labels.map((_, index) => series.data[index] ?? 0);
  const peak = Math.max(0, ...values);
  const last = Math.max(0, values.length - 1);
  const selected = Math.min(focused ?? values.lastIndexOf(peak), last);
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, peak) / 4));
  const step = Math.max(1, Math.ceil(peak / (4 * magnitude)) * magnitude);
  const x = (index: number) => last === 0 ? 50 : index * 100 / last;
  const y = (value: number) => 96 - value * 92 / (4 * step);
  const points = values.map((value, index): Point => [x(index), y(value)]);
  const line = smoothPath(points);
  const label = (index: number) => (interval === 'month' ? month : date).format(new Date(labels[index]));
  const format = (amount: number) => series.unit === 'IDR' ? formatCurrency(amount) : number.format(amount);
  const ticks = [...new Set([0, Math.round(last / 4), Math.round(last / 2), Math.round(3 * last / 4), last])];

  function pick(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setFocused(Math.round(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * last));
  }

  return (
    <section aria-label={`Tren ${series.name.toLowerCase()}`} className="min-w-0 rounded-2xl border border-ink/10 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold">Tren {series.name.toLowerCase()}</h2>
          <p className="mt-1 text-sm text-ink/60">Ketuk atau geser grafik untuk melihat tiap periode.</p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs text-ink/60"><span aria-hidden="true" className="size-2 rounded-full bg-blaze" />Total periode</p>
          <p className="font-display text-2xl font-extrabold leading-tight tracking-tight tabular-nums sm:text-3xl">{total}</p>
        </div>
      </div>

      {peak > 0 ? (
        <>
          <div className="mt-6 grid h-60 min-w-0 grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 sm:h-68">
            <div aria-hidden="true" className="flex flex-col justify-between pb-1 text-right text-[11px] tabular-nums text-ink/50">
              {[4, 3, 2, 1, 0].map((tick) => <span key={tick}>{compact.format(tick * step)}</span>)}
            </div>
            <div aria-hidden="true" className="relative min-w-0 touch-pan-y" onPointerMove={pick} onPointerDown={pick}>
              <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-blaze)" stopOpacity=".18" />
                    <stop offset="100%" stopColor="var(--color-blaze)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[4, 27, 50, 73, 96].map((row) => <line key={row} x1="0" x2="100" y1={row} y2={row} className="stroke-ink/10" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />)}
                <path d={`${line} L${x(last)},96 L${x(0)},96 Z`} fill={`url(#${gradient})`} />
                <path d={line} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-blaze" vectorEffect="non-scaling-stroke" />
              </svg>
              {/* Tirai putih yang menyingkap garis dari kiri ke kanan. */}
              <m.span
                className="pointer-events-none absolute -inset-y-1 -right-2 left-0 origin-right bg-white"
                initial={reduced ? false : { scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: reduced ? 0 : 1.2, ease }}
                style={reduced ? { scaleX: 0 } : undefined}
              />
              <span className="pointer-events-none absolute inset-y-0 border-l border-dashed border-ink/25" style={{ left: `${x(selected)}%` }} />
              <span className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blaze shadow-[0_0_0_4px_rgba(255,77,0,0.18)]" style={{ left: `${x(selected)}%`, top: `${y(values[selected])}%` }} />
              <span
                className={`pointer-events-none absolute top-0 whitespace-nowrap rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-xs shadow-sm ${x(selected) > 60 ? '-translate-x-[calc(100%+12px)]' : 'translate-x-3'}`}
                style={{ left: `${x(selected)}%` }}
              >
                <span className="block text-ink/60">{label(selected)}</span>
                <span className="block font-semibold tabular-nums">{format(values[selected])}</span>
              </span>
            </div>
            <span aria-hidden="true" />
            <div aria-hidden="true" className="relative h-6 text-[11px] tabular-nums text-ink/50">
              {ticks.map((index) => (
                <span
                  key={index}
                  className={`absolute top-0 whitespace-nowrap rounded-md px-1.5 py-0.5 ${index === 0 ? '' : index === last ? '-translate-x-full' : '-translate-x-1/2'} ${index === selected ? 'bg-paper font-semibold text-ink' : ''}`}
                  style={{ left: `${x(index)}%` }}
                >
                  {label(index)}
                </span>
              ))}
            </div>
          </div>
          {last > 0 && (
            <input
              type="range"
              min={0}
              max={last}
              value={selected}
              aria-label="Periode pada grafik"
              aria-valuetext={`${label(selected)}, ${format(values[selected])}`}
              onChange={(event) => setFocused(Number(event.target.value))}
              className="mt-2 block h-6 w-full cursor-pointer accent-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze"
            />
          )}
        </>
      ) : (
        <p className="mt-6 grid min-h-52 place-items-center rounded-xl border border-dashed border-ink/15 text-sm text-ink/60">Belum ada penjualan di periode ini.</p>
      )}
    </section>
  );
}
