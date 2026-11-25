'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';
import { useSeatStatusStream } from '@/hooks/useSeatStatusStream';
import { SHAPE_PRESETS, applyStatusDelta, readableText, seatFill, visible, type Rect } from '@/lib/seatMap';
import type { SeatMap, SeatStatus, SeatStatusDelta } from '@/types/dashboard';

export const seatStatusStyle: Record<SeatStatus, { label: string; fill: string }> = {
  available: { label: 'Tersedia', fill: 'var(--color-status-success)' },
  held: { label: 'Ditahan', fill: 'var(--color-status-warning)' },
  sold: { label: 'Terjual', fill: 'var(--color-blaze)' },
  blocked: { label: 'Diblokir', fill: 'var(--color-mute)' },
};

const number = new Intl.NumberFormat('id-ID');
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

function zoomView(view: Rect, map: SeatMap, factor: number, anchor = { fx: 0.5, fy: 0.5 }): Rect {
  const width = Math.min(map.width, Math.max(map.width / MAX_ZOOM, view.width * factor));
  const height = width * (map.height / map.width);
  return clampView({ x: view.x + (view.width - width) * anchor.fx, y: view.y + (view.height - height) * anchor.fy, width, height }, map);
}

function clampView(view: Rect, map: SeatMap): Rect {
  return {
    ...view,
    x: Math.min(Math.max(view.x, 0), map.width - view.width),
    y: Math.min(Math.max(view.y, 0), map.height - view.height),
  };
}

/** Denah SVG untuk pembeli dan pratinjau organizer: pan, zoom, culling viewport, dan status realtime. */
export default function SeatMapViewer({ map, live = false, title = 'Denah kursi' }: { map: SeatMap; live?: boolean; title?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; view: Rect } | null>(null);
  const [seats, setSeats] = useState(map.seats);
  const full = useMemo(() => ({ x: 0, y: 0, width: map.width, height: map.height }), [map.width, map.height]);
  const [view, setView] = useState<Rect>(full);
  const [svgWidth, setSvgWidth] = useState(800);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSvgWidth(entry.contentRect.width));
    observer.observe(svg.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronkan saat denah baru dimuat
    setSeats(map.seats);
    setView(full);
  }, [map, full]);

  const onDelta = useCallback((delta: SeatStatusDelta) => setSeats((current) => applyStatusDelta(current, delta)), []);
  const connected = useSeatStatusStream(live ? String(map.id) : null, onDelta);

  const zoom = MIN_ZOOM * (map.width / view.width);
  const shownSeats = useMemo(() => visible(seats, view), [seats, view]);
  const shownSections = useMemo(() => visible(map.sections, view), [map.sections, view]);
  // Kotak pembatas diperbesar agar elemen yang diputar tidak terpotong oleh culling.
  const shownShapes = useMemo(() => (map.shapes ?? []).filter((shape) => visible([{ x: shape.x - shape.width / 2, y: shape.y - shape.height / 2, width: shape.width * 2, height: shape.height * 2 }], view).length), [map.shapes, view]);
  const ticketTypes = useMemo(() => map.event?.ticketTypes ?? [], [map.event]);
  const ticketColors = useMemo(() => new Map(ticketTypes.map((ticket) => [String(ticket.id), ticket.color])), [ticketTypes]);
  const statusColors = useMemo(() => Object.fromEntries(Object.entries(seatStatusStyle).map(([key, { fill }]) => [key, fill])) as Record<SeatStatus, string>, []);
  const usedTickets = useMemo(() => {
    const used = new Set(seats.map((seat) => String(seat.ticket_type_id)));
    return ticketTypes.filter((ticket) => ticket.color && used.has(String(ticket.id)));
  }, [seats, ticketTypes]);
  const counts = useMemo(() => {
    const result: Record<SeatStatus, number> = { available: 0, held: 0, sold: 0, blocked: 0 };
    for (const seat of seats) result[seat.status] = (result[seat.status] ?? 0) + 1;
    return result;
  }, [seats]);
  // Label kursi hanya dirender bila kursinya cukup besar di layar.
  const pixelPerUnit = svgWidth / view.width;
  const showLabels = pixelPerUnit * 28 >= 22;

  // Listener native non-passive agar scroll di atas denah tidak ikut menggulir halaman.
  useEffect(() => {
    const node = svg.current;
    if (!node) return;
    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      const rect = node.getBoundingClientRect();
      const anchor = { fx: (event.clientX - rect.left) / rect.width, fy: (event.clientY - rect.top) / rect.height };
      setView((current) => zoomView(current, map, event.deltaY > 0 ? 1.15 : 1 / 1.15, anchor));
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [map]);

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, view };
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current) return;
    const scale = drag.current.view.width / event.currentTarget.clientWidth;
    const { x, y, view: start } = drag.current;
    setView(clampView({ ...start, x: start.x - (event.clientX - x) * scale, y: start.y - (event.clientY - y) * scale }, map));
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const step = view.width * 0.1;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[event.key]) {
      event.preventDefault();
      setView((current) => clampView({ ...current, x: current.x + moves[event.key][0], y: current.y + moves[event.key][1] }, map));
    } else if (event.key === '+' || event.key === '=') {
      setView((current) => zoomView(current, map, 1 / 1.3));
    } else if (event.key === '-') {
      setView((current) => zoomView(current, map, 1.3));
    }
  }

  const controlClass = 'grid size-9 cursor-pointer place-items-center rounded-sm border border-ink/10 bg-white text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze disabled:cursor-default disabled:opacity-40';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink/70">
          {usedTickets.map((ticket) => (
            <li key={ticket.id} className="flex items-center gap-1.5 font-semibold text-ink">
              <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: ticket.color }} />
              {ticket.name}
            </li>
          ))}
          {(Object.keys(seatStatusStyle) as SeatStatus[]).map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: seatStatusStyle[status].fill }} />
              {seatStatusStyle[status].label} <span className="font-semibold tabular-nums text-ink">{number.format(counts[status])}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {live && (
            <span className="flex items-center gap-1.5 text-xs text-ink/60" aria-live="polite">
              <span aria-hidden="true" className={`size-2 rounded-full ${connected ? 'bg-status-success' : 'bg-ink/25'}`} />
              {connected ? 'Status langsung' : 'Status belum tersambung'}
            </span>
          )}
          <button type="button" aria-label="Perkecil denah" className={controlClass} disabled={zoom <= MIN_ZOOM} onClick={() => setView((current) => zoomView(current, map, 1.3))}><Minus aria-hidden="true" className="size-4" /></button>
          <button type="button" aria-label="Perbesar denah" className={controlClass} disabled={zoom >= MAX_ZOOM} onClick={() => setView((current) => zoomView(current, map, 1 / 1.3))}><Plus aria-hidden="true" className="size-4" /></button>
          <button type="button" aria-label="Tampilkan seluruh denah" className={controlClass} onClick={() => setView(full)}><Maximize2 aria-hidden="true" className="size-4" /></button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-ink/10 bg-paper">
        <svg
          ref={svg}
          role="img"
          tabIndex={0}
          aria-label={`${title}: ${number.format(seats.length)} kursi, ${number.format(counts.available)} tersedia. Gunakan tombol panah untuk menggeser dan plus atau minus untuk zoom.`}
          viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto max-h-[70vh] w-full cursor-grab touch-none select-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blaze active:cursor-grabbing"
          style={{ aspectRatio: `${map.width} / ${map.height}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
          onKeyDown={onKeyDown}
        >
          {shownShapes.map((shape) => {
            const cx = shape.x + shape.width / 2;
            const cy = shape.y + shape.height / 2;
            const fill = shape.color ?? SHAPE_PRESETS[shape.type].color;
            const isText = shape.type === 'text';
            return (
              <g key={shape.id} transform={`rotate(${shape.rotation} ${cx} ${cy})`}>
                {shape.type === 'circle'
                  ? <ellipse cx={cx} cy={cy} rx={shape.width / 2} ry={shape.height / 2} style={{ fill }} />
                  : !isText && <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.type === 'stage' ? 4 : 10} style={{ fill }} opacity={shape.type === 'standing' ? 0.85 : 1} />}
                {shape.label && (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="font-display font-bold" style={{ fill: isText ? fill : readableText(fill), fontSize: shape.type === 'stage' ? 26 : 16 }}>{shape.label}</text>
                )}
              </g>
            );
          })}
          {shownSections.map((section) => (
            <g key={section.id}>
              <rect x={section.x} y={section.y} width={section.width} height={section.height} rx={10} className="fill-white stroke-ink/15" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <text x={section.x + 14} y={section.y + 24} className="fill-ink/60 font-body text-[18px] font-semibold">{section.label}</text>
            </g>
          ))}
          {shownSeats.map((seat) => (
            <g key={seat.id}>
              <rect x={seat.x} y={seat.y} width={seat.width} height={seat.height} rx={6} style={{ fill: seatFill(seat.status, seat.ticket_type_id ? ticketColors.get(String(seat.ticket_type_id)) : null, statusColors) ?? 'var(--color-mute)' }}>
                <title>{`${seat.label}, ${seatStatusStyle[seat.status]?.label ?? seat.status}`}</title>
              </rect>
              {showLabels && (
                <text x={seat.x + seat.width / 2} y={seat.y + seat.height / 2 + 4} textAnchor="middle" className="pointer-events-none fill-ink text-[10px] font-semibold">{seat.label}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs text-ink/55">Seret untuk menggeser, scroll atau tombol untuk zoom. Menampilkan {number.format(shownSeats.length)} dari {number.format(seats.length)} kursi di layar.</p>
    </div>
  );
}
