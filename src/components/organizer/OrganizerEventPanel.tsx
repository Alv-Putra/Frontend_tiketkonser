'use client';

import Link from 'next/link';
import { m, useReducedMotion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Clock3, FileText, Map, MapPin, Pencil, SendHorizontal, Ticket, Trash2 } from 'lucide-react';
import { DashboardNotice, DashboardStatus, ease, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { REVIEW_SLA_HOURS, reviewSla } from '@/lib/reviewSla';
import { fetchOrganizerEventDetail, fetchOrganizerEventDocuments, findOrganizerSeatMap } from '@/services/dashboardService';
import type { OrganizerDashboardEvent, OrganizerEventDetail } from '@/types/dashboard';
import { eventDocumentLabels } from './OrganizerEventDocuments';
import { statusConfig } from './OrganizerEventList';
import { editableEvent } from './OrganizerEventRail';
import { eventDate } from './OrganizerEventPicker';

type DetailState = { data: OrganizerEventDetail | null; status: string };

const DOCUMENT_TOTAL = Object.keys(eventDocumentLabels).length;
const dateTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

function Bar({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-paper">
      <m.div
        className="h-full origin-left rounded-full bg-blaze"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: value }}
        transition={{ duration: reduced ? 0 : 0.7, ease }}
      />
    </div>
  );
}

type ChecklistItem = { label: string; note: string; done: boolean; action?: React.ReactNode };

/** Syarat pengajuan: detail, berkas, kelas tiket, dan denah kursi (wajib). */
function useReadiness(event: OrganizerDashboardEvent, detail: DetailState, onDocuments: () => void) {
  const documents = useDashboardData(() => fetchOrganizerEventDocuments(event.id));
  const seatMap = useDashboardData(() => findOrganizerSeatMap(event.id));
  const docCount = documents.data?.length ?? 0;
  const ticketCount = detail.data?.ticketTypes.length ?? 0;
  const query = `?event=${encodeURIComponent(event.id)}`;
  const items: ChecklistItem[] = [
    { label: 'Detail event', note: 'Judul, venue, dan jadwal', done: true },
    { label: 'Berkas verifikasi', note: documents.status === 'error' ? 'Gagal dimuat' : `${docCount} dari ${DOCUMENT_TOTAL} berkas`, done: docCount >= DOCUMENT_TOTAL, action: <button type="button" onClick={onDocuments} className="text-xs font-semibold underline">Kelola</button> },
    { label: 'Kelas tiket', note: detail.status === 'error' ? 'Gagal dimuat' : `${ticketCount} kelas tiket`, done: ticketCount > 0, action: <Link href={`/organizer/categories${query}`} className="text-xs font-semibold underline">Atur</Link> },
    { label: 'Denah kursi', note: seatMap.status === 'error' ? 'Gagal dimuat' : seatMap.data ? `${seatMap.data.seats.length} kursi` : 'Belum dibuat', done: !!seatMap.data, action: <Link href={`/organizer/seat-map${query}`} className="text-xs font-semibold underline">Buka</Link> },
  ];
  return { items, ready: items.every((item) => item.done) };
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  const reduced = useReducedMotion();
  const required = items;
  const ready = items.filter((item) => item.done).length;

  return (
    <section aria-label="Kesiapan event" className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold">Kesiapan pengajuan</h3>
        <span className="text-xs font-semibold tabular-nums text-ink/60" aria-live="polite">{ready}/{required.length} syarat</span>
      </div>
      <Bar value={ready / required.length} />
      <ul className="space-y-1">
        {items.map(({ label, note, done, action }, index) => (
          <m.li
            key={label}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : 0.1 + index * 0.06, ease }}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-paper"
          >
            {done
              ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-ink" fill="var(--color-blaze)" />
              : <CircleDashed aria-hidden="true" className="size-5 shrink-0 text-ink/35" />}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{label}<span className="sr-only">{done ? ', selesai' : ', belum'}</span></span>
              <span className="block text-xs text-ink/60">{note}</span>
            </span>
            {action}
          </m.li>
        ))}
      </ul>
    </section>
  );
}

const stages = ['Draf', 'Review admin', 'Dipublikasikan'];
const stageOf: Record<string, number> = { draft: 0, rejected: 1, pending_review: 1, published: 2, ongoing: 2, completed: 2 };

function Sla({ event, detail }: { event: OrganizerDashboardEvent; detail?: OrganizerEventDetail }) {
  const reduced = useReducedMotion();
  const stage = stageOf[event.status] ?? -1;
  const rejected = event.status === 'rejected';
  // shortcut: backend belum menyimpan waktu pengajuan, jadi updated_at dipakai sebagai perkiraan; ganti ke submitted_at bila tersedia.
  const sla = event.status === 'pending_review' && detail?.updated_at ? reviewSla(detail.updated_at) : null;

  return (
    <section aria-label="SLA review admin" className="space-y-4 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold">SLA review</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold"><Clock3 aria-hidden="true" className="size-3.5" />Maks. {REVIEW_SLA_HOURS / 24}×24 jam</span>
      </div>

      <ol aria-label="Tahapan event" className="grid grid-cols-3 gap-2">
        {stages.map((label, index) => {
          const isRejected = rejected && index === 1;
          const reached = index <= stage;
          return (
            <li key={label} aria-current={index === stage ? 'step' : undefined} className="space-y-1.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-paper">
                <m.div
                  className={`h-full origin-left rounded-full ${isRejected ? 'bg-ink' : 'bg-blaze'}`}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: reached ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.15, ease }}
                />
              </div>
              <span className={`block text-xs font-semibold ${reached ? 'text-ink' : 'text-ink/50'}`}>{isRejected ? 'Ditolak' : label}</span>
            </li>
          );
        })}
      </ol>

      {sla ? (
        <div className="space-y-2">
          <p className="font-display text-3xl font-extrabold tabular-nums leading-none">
            {sla.overdue ? `Lewat ${Math.abs(sla.hoursLeft)} jam` : `Sisa ${sla.hoursLeft} jam`}
          </p>
          <Bar value={sla.elapsed} />
          <p className="text-xs text-ink/65">Batas review {dateTime.format(sla.deadline)} WIB. Perkiraan dari waktu terakhir event diperbarui.</p>
        </div>
      ) : (
        <p className="text-sm text-ink/70">
          {event.status === 'pending_review' && 'Menghitung batas review…'}
          {(event.status === 'draft' || rejected) && `Setelah diajukan, admin mereview paling lama ${REVIEW_SLA_HOURS / 24}×24 jam.`}
          {stage === 2 && (detail?.approved_at ? `Disetujui ${dateTime.format(new Date(detail.approved_at))} WIB.` : 'Sudah disetujui admin.')}
          {event.status === 'cancelled' && 'Event dibatalkan.'}
        </p>
      )}
      {rejected && detail?.rejected_reason && <DashboardNotice error>Alasan penolakan: {detail.rejected_reason}</DashboardNotice>}
    </section>
  );
}

export default function OrganizerEventPanel({ event, submitting, onEdit, onDocuments, onSubmit, onDelete }: {
  event: OrganizerDashboardEvent;
  submitting: boolean;
  onEdit: () => void;
  onDocuments: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}) {
  const detail = useDashboardData(() => fetchOrganizerEventDetail(event.id));
  const canEdit = editableEvent(event.status);
  const readiness = useReadiness(event, detail, onDocuments);
  const cfg = statusConfig[event.status] ?? { label: event.status, tone: 'neutral' as const };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <DashboardStatus label={cfg.label} tone={cfg.tone} />
          <h2 className="mt-2 wrap-break-word font-display text-2xl font-extrabold leading-tight">{event.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />{event.venue?.name ?? 'Venue belum diisi'} · {eventDate.format(new Date(event.start_at))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onDocuments} className={ghostButton}><FileText aria-hidden="true" className="size-4" />Berkas</button>
          <Link href={`/organizer/seat-map?event=${encodeURIComponent(event.id)}`} className={ghostButton}><Map aria-hidden="true" className="size-4" />Denah</Link>
          <Link href={`/organizer/categories?event=${encodeURIComponent(event.id)}`} className={ghostButton}><Ticket aria-hidden="true" className="size-4" />Tiket</Link>
          {canEdit && <button type="button" onClick={onEdit} disabled={submitting} className={ghostButton}><Pencil aria-hidden="true" className="size-4" />Edit</button>}
          {canEdit && <button type="button" onClick={onDelete} disabled={submitting} aria-label={`Hapus event ${event.title}`} className={ghostButton}><Trash2 aria-hidden="true" className="size-4" /></button>}
          {canEdit && <button type="button" onClick={onSubmit} disabled={submitting || !readiness.ready} title={readiness.ready ? undefined : 'Lengkapi semua syarat dulu'} className={primaryButton}><SendHorizontal aria-hidden="true" className="size-4" />Ajukan</button>}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Checklist items={readiness.items} />
        <Sla event={event} detail={detail.data ?? undefined} />
      </div>
    </div>
  );
}
