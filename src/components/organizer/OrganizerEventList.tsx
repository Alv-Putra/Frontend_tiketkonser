'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from 'zustand';
import { m, useReducedMotion } from 'framer-motion';
import { DashboardFrame, DashboardHeader, DashboardNotice, ease, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import MotionProvider from '@/components/landing/MotionProvider';
import { createOrganizerEventStore } from '@/stores/organizerEventStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import OrganizerEventForm from './OrganizerEventForm';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { fetchOrganizerEventDetail, uploadOrganizerEventDocument, type EventCreateInput } from '@/services/dashboardService';
import type { EventDocumentType } from '@/types/dashboard';
import OrganizerConfirmDialog from './OrganizerConfirmDialog';
import OrganizerDialog from './OrganizerDialog';
import OrganizerEventPanel from './OrganizerEventPanel';
import { EventCards } from './OrganizerEventRail';
import OrganizerEventDocuments, { eventDocumentLabels, readableDocumentError } from './OrganizerEventDocuments';

export const statusConfig: Record<string, { label: string; tone: 'neutral' | 'positive' | 'warning' | 'danger' }> = {
  draft: { label: 'Draf', tone: 'neutral' },
  pending_review: { label: 'Menunggu review', tone: 'warning' },
  published: { label: 'Dipublikasikan', tone: 'positive' },
  rejected: { label: 'Ditolak', tone: 'danger' },
  ongoing: { label: 'Berlangsung', tone: 'positive' },
  completed: { label: 'Selesai', tone: 'neutral' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
};

export default function OrganizerEventList() {

  const [store] = useState(createOrganizerEventStore);
  const { events, status, page, totalPages, submitting, loadEvents, createEvent, updateEvent, submitEvent, deleteEvent } = useStore(store);
  const [form, setForm] = useState<'create' | OrganizerDashboardEvent | null>(null);
  const [confirmation, setConfirmation] = useState<{ action: 'Ajukan' | 'Hapus'; event: OrganizerDashboardEvent } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<OrganizerDashboardEvent | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // Naik saat dialog berkas/edit ditutup agar checklist dimuat ulang.
  const [version, setVersion] = useState(0);
  const current = events.find(({ id }) => id === selected) ?? events[0];
  const reduced = useReducedMotion();
  const router = useRouter();

  useEffect(() => { void loadEvents(); }, [loadEvents]);

  // Langkah kedua pembuatan event: susun denah kursi selagi masih draf.
  async function handleCreate(data: EventCreateInput, files: [EventDocumentType, File][]) {
    const created = await createEvent(data);
    if (!created) return;
    const failed: string[] = [];
    for (const [type, file] of files) {
      await uploadOrganizerEventDocument(created.id, type, file).catch(() => failed.push(eventDocumentLabels[type].label));
    }
    // Event sudah tersimpan; berkas yang gagal diunggah ulang lewat dialog berkas.
    if (failed.length) {
      setActionError(`Event tersimpan, tapi berkas ${failed.join(', ')} gagal diunggah. Coba unggah ulang di sini.`);
      setDocuments(created);
      return;
    }
    router.push(`/organizer/seat-map?event=${encodeURIComponent(created.id)}`);
  }

  function openForm(value: 'create' | OrganizerDashboardEvent) {
    setActionError(null);
    setForm(value);
  }

  async function handleConfirmation() {
    if (!confirmation) return;
    const { action, event } = confirmation;
    setActionError(null);
    try {
      await (action === 'Ajukan' ? submitEvent(event.id) : deleteEvent(event.id));
    } catch (err) {
      setActionError(err instanceof Error ? readableDocumentError(err.message) : 'Aksi gagal. Coba lagi.');
    } finally {
      setConfirmation(null);
    }
  }

  return (
    <MotionProvider>
      <DashboardFrame>
        <DashboardHeader title="Event saya" subtitle="Kelola event yang kamu selenggarakan — buat, ajukan ke admin, dan pantau statusnya.">
          <m.button
            type="button"
            onClick={() => openForm('create')}
            disabled={submitting}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-md bg-blaze px-5 py-2.5 text-sm font-semibold text-ink hover:bg-tangerine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze"
          >
            <Plus className="size-4" aria-hidden="true" />
            Buat event baru
          </m.button>
        </DashboardHeader>

        {actionError && (
          <DashboardNotice error>{actionError}</DashboardNotice>
        )}

        <section aria-label="Daftar event" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">Pilih event</h2>
            {totalPages > 1 && (
              <nav aria-label="Halaman daftar event" className="flex items-center gap-1">
                <button type="button" aria-label="Halaman sebelumnya" onClick={() => loadEvents(page - 1)} disabled={page <= 1 || status === 'loading'} className="grid size-9 cursor-pointer place-items-center rounded-md border border-ink/10 bg-white hover:border-blaze disabled:cursor-default disabled:opacity-40">
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <span className="px-2 text-xs tabular-nums text-ink/60">{page}/{totalPages}</span>
                <button type="button" aria-label="Halaman berikutnya" onClick={() => loadEvents(page + 1)} disabled={page >= totalPages || status === 'loading'} className="grid size-9 cursor-pointer place-items-center rounded-md border border-ink/10 bg-white hover:border-blaze disabled:cursor-default disabled:opacity-40">
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
          {status === 'loading' && !events.length && <DashboardNotice>Memuat event…</DashboardNotice>}
          {status === 'error' && <DashboardNotice error>Gagal memuat daftar event. Muat ulang halaman untuk mencoba lagi.</DashboardNotice>}
          {status === 'ready' && !events.length && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 bg-white py-12">
              <p className="text-sm text-ink/60">Belum ada event. Mulai dengan membuat event pertama!</p>
              <button type="button" onClick={() => openForm('create')} disabled={submitting} className={primaryButton}>
                <Plus className="size-4" aria-hidden="true" />
                Buat event
              </button>
            </div>
          )}
          <EventCards events={events} selected={current?.id} onSelect={(ev) => setSelected(ev.id)} />
        </section>

        {current && (
          <m.section
            key={current.id}
            aria-label={current.title}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="border-t border-ink/10 pt-6"
          >
            <OrganizerEventPanel
              key={`${current.status}-${version}`}
              event={current}
              submitting={submitting}
              onEdit={() => openForm(current)}
              onDocuments={() => setDocuments(current)}
              onSubmit={() => setConfirmation({ action: 'Ajukan', event: current })}
              onDelete={() => setConfirmation({ action: 'Hapus', event: current })}
            />
          </m.section>
        )}

        {form === 'create' && (
          // Form tanpa event selalu mengirim data lengkap, termasuk venue.
          <OrganizerEventForm submitting={submitting} onClose={() => setForm(null)} onSubmit={(data, files) => handleCreate(data as EventCreateInput, files)} />
        )}
        {form && form !== 'create' && (
          <EditEventForm
            event={form}
            submitting={submitting}
            onClose={() => setForm(null)}
            onSubmit={async (data) => { await updateEvent(form.id, data); setVersion((v) => v + 1); }}
          />
        )}

        {documents && <OrganizerEventDocuments event={documents} onClose={() => { setDocuments(null); setVersion((v) => v + 1); }} />}

        {confirmation && (
          <OrganizerConfirmDialog
            title={`${confirmation.action} “${confirmation.event.title}”?`}
            description={confirmation.action === 'Ajukan'
              ? 'Event akan dikirim ke admin untuk diperiksa. Kelima berkas verifikasi, minimal satu kelas tiket, dan denah kursi sudah lengkap. Denah terkunci setelah diajukan.'
              : 'Event yang sudah dihapus tidak bisa dikembalikan.'}
            action={confirmation.action}
            busy={submitting}
            onConfirm={handleConfirmation}
            onCancel={() => setConfirmation(null)}
          />
        )}
      </DashboardFrame>
    </MotionProvider>
  );
}

function EditEventForm({ event, ...formProps }: Omit<React.ComponentProps<typeof OrganizerEventForm>, 'event'> & {
  event: OrganizerDashboardEvent;
}) {
  const { data, status, refresh } = useDashboardData(() => fetchOrganizerEventDetail(event.id));
  if (data) return <OrganizerEventForm {...formProps} event={data} />;

  return (
    <OrganizerDialog title={`Edit ${event.title}`} onClose={formProps.onClose} className="max-w-sm">
      <div className="space-y-4 p-6">
        {status === 'error' ? (
          <p role="alert">Detail event gagal dimuat.</p>
        ) : (
          <p role="status">Memuat detail event…</p>
        )}
        <div className="flex flex-wrap gap-3">
          {status === 'error' && <button type="button" className={primaryButton} onClick={refresh}>Coba lagi</button>}
          <button type="button" className={ghostButton} onClick={formProps.onClose}>Batal</button>
        </div>
      </div>
    </OrganizerDialog>
  );
}
