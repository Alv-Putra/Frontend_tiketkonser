'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { m, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, MapPin } from 'lucide-react';
import { DashboardNotice, DashboardStatus, RefreshButton, ease } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchOrganizerDashboardEvents } from '@/services/dashboardService';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { statusConfig } from './OrganizerEventList';
import { eventDate } from './OrganizerEventPicker';

export const editableEvent = (status: string) => status === 'draft' || status === 'rejected';

/** Deretan kartu event yang bisa digeser; dipakai pemilih event dan daftar Event saya. */
export function EventCards({ events, selected, onSelect, lockLabel }: {
  events: OrganizerDashboardEvent[];
  selected?: string;
  onSelect: (event: OrganizerDashboardEvent) => void;
  lockLabel?: string;
}) {
  const reduced = useReducedMotion();
  if (!events.length) return null;
  return (
    <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
      {events.map((event, index) => {
        const active = event.id === selected;
        const cfg = statusConfig[event.status] ?? { label: event.status, tone: 'neutral' as const };
        return (
          <m.li
            key={event.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduced ? 0 : index * 0.05, ease }}
            className="w-64 shrink-0 snap-start"
          >
            <m.button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(event)}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              className={`relative flex h-full w-full cursor-pointer flex-col gap-2 rounded-2xl border bg-white p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze ${active ? 'border-transparent' : 'border-ink/10 hover:border-ink/25'}`}
            >
              {active && <m.span layoutId="event-rail-active" transition={{ duration: reduced ? 0 : 0.35, ease }} aria-hidden="true" className="absolute inset-0 rounded-2xl border-2 border-blaze" />}
              <span className="flex items-center justify-between gap-2">
                <DashboardStatus label={cfg.label} tone={cfg.tone} />
                {lockLabel && !editableEvent(event.status) && <Lock aria-label={lockLabel} className="size-3.5 text-ink/45" />}
              </span>
              <span className="line-clamp-2 font-display text-base font-bold leading-snug">{event.title}</span>
              <span className="mt-auto flex items-center gap-1.5 text-xs text-ink/60">
                <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{event.venue?.name ?? 'Venue belum diisi'} · {eventDate.format(new Date(event.start_at))}</span>
              </span>
            </m.button>
          </m.li>
        );
      })}
    </ul>
  );
}

function Rail({ page, onPage, selected, onSelect, lockLabel }: {
  page: number;
  onPage: (page: number) => void;
  selected: string | null;
  onSelect: (event: OrganizerDashboardEvent | undefined) => void;
  lockLabel?: string;
}) {
  const reduced = useReducedMotion();
  const { data, status, refresh } = useDashboardData(() => fetchOrganizerDashboardEvents(page));
  const events = data?.data ?? [];
  const current = events.find(({ id }) => id === selected) ?? events[0];

  useEffect(() => { onSelect(current); }, [current, onSelect]);

  return (
    <section aria-label="Pilih event" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Pilih event</h2>
        <div className="flex items-center gap-2">
          {(page > 1 || (data?.totalPages ?? 0) > 1) && (
            <nav aria-label="Halaman daftar event" className="flex items-center gap-1">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page === 1} onClick={() => onPage(page - 1)} className="grid size-9 cursor-pointer place-items-center rounded-md border border-ink/10 bg-white hover:border-blaze disabled:cursor-default disabled:opacity-40">
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <span className="px-2 text-xs tabular-nums text-ink/60">{page}/{data?.totalPages || 1}</span>
              <button type="button" aria-label="Halaman berikutnya" disabled={!data || page >= data.totalPages} onClick={() => onPage(page + 1)} className="grid size-9 cursor-pointer place-items-center rounded-md border border-ink/10 bg-white hover:border-blaze disabled:cursor-default disabled:opacity-40">
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </nav>
          )}
          <RefreshButton loading={status === 'loading'} refresh={refresh} />
        </div>
      </div>
      {status === 'error' && <DashboardNotice error>Daftar event gagal dimuat. Pilih Segarkan untuk mencoba lagi.</DashboardNotice>}
      {status === 'loading' && !events.length && <DashboardNotice>Memuat event…</DashboardNotice>}
      {status === 'ready' && !events.length && (
        <DashboardNotice>Belum ada event. <Link href="/organizer/concerts" className="font-semibold underline">Buat event dulu</Link>, lalu kembali ke sini.</DashboardNotice>
      )}
      <EventCards events={events} selected={current?.id} onSelect={onSelect} lockLabel={lockLabel} />
    </section>
  );
}

/** Pemilih event berupa kartu; `?event=<id>` memilih event di awal. */
export default function OrganizerEventRail({ children, lockLabel }: {
  children: (event: OrganizerDashboardEvent) => ReactNode;
  lockLabel?: string;
}) {
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(params.get('event'));
  const [event, setEvent] = useState<OrganizerDashboardEvent>();

  // Stabil agar efek di Rail tidak berulang tiap render.
  const [select] = useState(() => (next: OrganizerDashboardEvent | undefined) => {
    setEvent(next);
    if (next) setSelected(next.id);
  });

  return (
    <>
      <Rail key={page} page={page} onPage={setPage} selected={selected} onSelect={select} lockLabel={lockLabel} />
      {event && (
        <m.section
          key={event.id}
          aria-label={event.title}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="space-y-4 border-t border-ink/10 pt-6"
        >
          {children(event)}
        </m.section>
      )}
    </>
  );
}
