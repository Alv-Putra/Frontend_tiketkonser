'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Check, Lock, MapPin } from 'lucide-react';
import { useStore } from 'zustand';
import { DashboardFrame, DashboardHeader, DashboardNotice, Panel, RefreshButton, ease } from '@/components/workspace/DashboardKit';
import SeatMapViewer from '@/components/seatmap/SeatMapViewer';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { SeatMapDraft } from '@/lib/seatMap';
import { findOrganizerSeatMap, fetchOrganizerTickets } from '@/services/dashboardService';
import { createSeatMapEditorStore } from '@/stores/seatMapEditorStore';
import type { OrganizerDashboardEvent, OrganizerTicket, SeatMap } from '@/types/dashboard';
import OrganizerEventRail, { editableEvent } from './OrganizerEventRail';

// Konva hanya jalan di browser; dimuat terpisah agar halaman lain tidak ikut membawa bundel kanvas.
const OrganizerSeatMapEditor = dynamic(() => import('./OrganizerSeatMapEditor'), {
  ssr: false,
  loading: () => <DashboardNotice>Menyiapkan editor denah…</DashboardNotice>,
});

const tabs = [['editor', 'Editor'], ['preview', 'Pratinjau pembeli']] as const;

/** Draf editor ke bentuk SeatMap agar bisa dipratinjau dengan viewer pembeli. */
function draftToMap(draft: SeatMapDraft, tickets: OrganizerTicket[]): SeatMap {
  return {
    id: 'draft',
    width: draft.width,
    height: draft.height,
    version: 0,
    sections: draft.sections.map(({ key, label, ticket_type_id, x, y, width, height }, index) => ({ id: key, label, ticket_type_id, x, y, width, height, sort_order: index })),
    seats: draft.seats.map(({ key, sectionKey, ticket_type_id, label, row_label, seat_number, x, y, width, height, status }) => ({
      id: key, section_id: sectionKey, ticket_type_id, label, row_label, seat_number, x, y, width, height, status,
    })),
    shapes: draft.shapes.map(({ key, ...shape }) => ({ id: key, ...shape, label: shape.label || null })),
    event: { ticketTypes: tickets.map(({ id, name, color }) => ({ id: String(id), name, color })) },
  };
}

/** Angka yang bergeser halus saat nilainya berubah. */
function Count({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="min-w-0 rounded-xl border border-ink/10 bg-white px-4 py-3">
      <dt className="text-xs font-semibold text-ink/60">{label}</dt>
      <dd className="relative mt-1 h-7 overflow-hidden font-display text-2xl font-extrabold leading-7 tabular-nums">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={value}
            className="block"
            initial={reduced ? false : { y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            {value}
          </m.span>
        </AnimatePresence>
      </dd>
    </div>
  );
}

/** Posisi denah di alur pembuatan event: detail → denah → ajukan. */
function Steps({ locked }: { locked: boolean }) {
  const reduced = useReducedMotion();
  const steps = ['Detail event', 'Denah kursi', 'Ajukan ke admin'];
  const current = locked ? 3 : 1;
  return (
    <ol aria-label="Tahap pembuatan event" className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <m.li
            key={label}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.08, ease }}
            aria-current={active ? 'step' : undefined}
            className="flex items-center gap-2"
          >
            <span className={`grid size-6 place-items-center rounded-full ${done ? 'bg-ink text-paper' : active ? 'bg-blaze text-ink' : 'bg-paper text-ink/55'}`}>
              {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
            </span>
            <span className={active ? 'text-ink' : 'text-ink/60'}>{label}</span>
            {index < steps.length - 1 && <span aria-hidden="true" className="h-px w-6 bg-ink/15" />}
          </m.li>
        );
      })}
    </ol>
  );
}

function Tabs({ tab, setTab }: { tab: (typeof tabs)[number][0]; setTab: (tab: (typeof tabs)[number][0]) => void }) {
  const reduced = useReducedMotion();
  return (
    <div role="tablist" aria-label="Mode denah" className="inline-flex rounded-full border border-ink/10 bg-white p-1">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={tab === key}
          onClick={() => setTab(key)}
          className={`relative min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze ${tab === key ? 'text-paper' : 'text-ink/65 hover:text-ink'}`}
        >
          {tab === key && <m.span layoutId="seatmap-tab" transition={{ duration: reduced ? 0 : 0.3, ease }} className="absolute inset-0 rounded-full bg-ink" />}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

function Swap({ id, children }: { id: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={id}
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

function SeatMapStudio({ event }: { event: OrganizerDashboardEvent }) {
  const [store] = useState(() => createSeatMapEditorStore(event.id));
  const state = useStore(store);
  const tickets = useDashboardData(() => fetchOrganizerTickets(event.id));
  const [tab, setTab] = useState<(typeof tabs)[number][0]>('editor');

  useEffect(() => { void store.getState().load(); }, [store]);

  if (state.status === 'loading') return <DashboardNotice>Memuat denah…</DashboardNotice>;
  if (state.status === 'error') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <DashboardNotice error>Denah gagal dimuat.</DashboardNotice>
        <RefreshButton loading={false} refresh={() => void state.load()} />
      </div>
    );
  }

  const { draft } = state;
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-3 gap-3 sm:max-w-md">
        <Count label="Area" value={draft.sections.length} />
        <Count label="Kursi" value={draft.seats.length} />
        <Count label="Elemen" value={draft.shapes.length} />
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tab={tab} setTab={setTab} />
        <p className="text-xs text-ink/60">Denah wajib sebelum event diajukan, dan bisa diubah selama event masih draf atau ditolak.</p>
      </div>
      {tickets.status === 'error' && <DashboardNotice error>Kelas tiket gagal dimuat; kursi tetap bisa diatur tanpa kelas tiket.</DashboardNotice>}
      {tickets.status === 'ready' && !tickets.data?.length && (
        <DashboardNotice>Belum ada kelas tiket. <Link href={`/organizer/categories?event=${encodeURIComponent(event.id)}`} className="font-semibold underline">Buat kelas tiket</Link> agar area bisa diberi harga dan warna.</DashboardNotice>
      )}
      <Swap id={tab}>
        {tab === 'editor'
          ? <OrganizerSeatMapEditor store={store} tickets={tickets.data ?? []} />
          : <Panel>{draft.seats.length || draft.shapes.length ? <SeatMapViewer map={draftToMap(draft, tickets.data ?? [])} title="Pratinjau denah" /> : <p className="text-sm text-ink/70">Belum ada kursi. Tambahkan area dan blok kursi di tab Editor.</p>}</Panel>}
      </Swap>
    </div>
  );
}

function LockedSeatMap({ event }: { event: OrganizerDashboardEvent }) {
  const { data, status, refresh } = useDashboardData(() => findOrganizerSeatMap(event.id));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper"><Lock aria-hidden="true" className="size-4" /></span>
        <p className="min-w-0 flex-1 basis-60 text-ink/75">Denah terkunci karena event sudah diajukan atau dipublikasikan.</p>
        {data && (
          <span className="inline-flex items-center gap-2 rounded-full bg-status-success/40 px-3 py-1 text-xs font-semibold">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-ink/40 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-ink" />
            </span>
            Status kursi langsung
          </span>
        )}
      </div>
      {status === 'loading' && data === null && <DashboardNotice>Memuat denah…</DashboardNotice>}
      {status === 'error' && (
        <div className="flex flex-wrap items-center gap-3">
          <DashboardNotice error>Denah gagal dimuat.</DashboardNotice>
          <RefreshButton loading={false} refresh={refresh} />
        </div>
      )}
      {status === 'ready' && !data && <DashboardNotice>Event ini tidak memakai denah kursi.</DashboardNotice>}
      {data && <Panel><SeatMapViewer map={data} live title={`Denah ${event.title}`} /></Panel>}
    </div>
  );
}

export default function OrganizerSeatMap() {
  return (
    <DashboardFrame>
      <DashboardHeader title="Venue & denah kursi" subtitle="Susun panggung, area, dan kursi sejak event masih draf, lalu lihat tampilannya di mata pembeli." />
      <OrganizerEventRail lockLabel="Denah terkunci">
        {(event) => (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink/60">
                  <MapPin aria-hidden="true" className="size-3.5" />{event.venue?.name ?? 'Venue belum diisi'}
                </p>
                <h2 className="mt-1 wrap-break-word font-display text-2xl font-extrabold leading-tight">{event.title}</h2>
              </div>
              <Steps locked={!editableEvent(event.status)} />
            </div>
            {editableEvent(event.status) ? <SeatMapStudio event={event} /> : <LockedSeatMap event={event} />}
          </>
        )}
      </OrganizerEventRail>
    </DashboardFrame>
  );
}
