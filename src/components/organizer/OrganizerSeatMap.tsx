'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { m, useReducedMotion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useStore } from 'zustand';
import { DashboardFrame, DashboardHeader, DashboardNotice, Panel, RefreshButton, ease } from '@/components/workspace/DashboardKit';
import SeatMapViewer from '@/components/seatmap/SeatMapViewer';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ApiError } from '@/lib/api';
import type { SeatMapDraft } from '@/lib/seatMap';
import { fetchOrganizerSeatMap, fetchOrganizerTickets } from '@/services/dashboardService';
import { createSeatMapEditorStore } from '@/stores/seatMapEditorStore';
import type { OrganizerDashboardEvent, OrganizerTicket, SeatMap } from '@/types/dashboard';
import OrganizerEventPicker from './OrganizerEventPicker';

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

function SeatMapStudio({ event }: { event: OrganizerDashboardEvent }) {
  const reduced = useReducedMotion();
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

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Mode denah" className="inline-flex rounded-md border border-ink/10 bg-white p-1">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`relative min-h-9 cursor-pointer rounded-sm px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze ${tab === key ? 'text-paper' : 'text-ink/65 hover:text-ink'}`}
          >
            {tab === key && <m.span layoutId="seatmap-tab" transition={{ duration: reduced ? 0 : 0.3, ease }} className="absolute inset-0 rounded-sm bg-ink" />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
      {tickets.status === 'error' && <DashboardNotice error>Kelas tiket gagal dimuat; kursi tetap bisa diatur tanpa kelas tiket.</DashboardNotice>}
      {tab === 'editor'
        ? <OrganizerSeatMapEditor store={store} tickets={tickets.data ?? []} />
        : <Panel>{state.draft.seats.length || state.draft.shapes.length ? <SeatMapViewer map={draftToMap(state.draft, tickets.data ?? [])} title="Pratinjau denah" /> : <p className="text-sm text-ink/70">Belum ada kursi. Tambahkan area dan blok kursi di tab Editor.</p>}</Panel>}
    </div>
  );
}

// 404 = denah belum dibuat; bukan error.
const loadMap = (eventId: string) => fetchOrganizerSeatMap(eventId).catch((error) => {
  if (error instanceof ApiError && error.status === 404) return null;
  throw error;
});

function LockedSeatMap({ event }: { event: OrganizerDashboardEvent }) {
  const { data, status, refresh } = useDashboardData(() => loadMap(event.id));
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-md border border-ink/10 bg-white p-4 text-sm">
        <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p className="text-ink/75">Denah terkunci karena event sudah diajukan atau dipublikasikan. Status kursi di bawah diperbarui langsung saat pembeli memesan.</p>
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
      <DashboardHeader title="Venue & denah kursi" subtitle="Susun area dan kursi dengan seret-lepas, lalu pratinjau tampilan pembeli." />
      <OrganizerEventPicker>
        {(event) => (event.status === 'draft' || event.status === 'rejected'
          ? <SeatMapStudio key={event.id} event={event} />
          : <LockedSeatMap key={event.id} event={event} />)}
      </OrganizerEventPicker>
    </DashboardFrame>
  );
}
