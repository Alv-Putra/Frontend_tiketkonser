'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, SendHorizontal, Trash2, ChevronLeft, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { useStore } from 'zustand';
import { m, useReducedMotion } from 'framer-motion';
import { DashboardFrame, DashboardHeader, DashboardNotice, DashboardStatus, ease, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import MotionProvider from '@/components/landing/MotionProvider';
import { createOrganizerEventStore } from '@/stores/organizerEventStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import OrganizerEventForm from './OrganizerEventForm';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { fetchOrganizerEventDetail, type EventCreateInput } from '@/services/dashboardService';
import OrganizerConfirmDialog from './OrganizerConfirmDialog';
import OrganizerDialog from './OrganizerDialog';
import OrganizerEventDocuments, { readableDocumentError } from './OrganizerEventDocuments';

const statusConfig: Record<string, { label: string; tone: 'neutral' | 'positive' | 'warning' | 'danger' }> = {
  draft: { label: 'Draf', tone: 'neutral' },
  pending_review: { label: 'Menunggu review', tone: 'warning' },
  published: { label: 'Dipublikasikan', tone: 'positive' },
  rejected: { label: 'Ditolak', tone: 'danger' },
  ongoing: { label: 'Berlangsung', tone: 'positive' },
  completed: { label: 'Selesai', tone: 'neutral' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
};

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' });

export default function OrganizerEventList() {

  const [store] = useState(createOrganizerEventStore);
  const { events, status, page, totalPages, submitting, loadEvents, createEvent, updateEvent, submitEvent, deleteEvent } = useStore(store);
  const [form, setForm] = useState<'create' | OrganizerDashboardEvent | null>(null);
  const [confirmation, setConfirmation] = useState<{ action: 'Ajukan' | 'Hapus'; event: OrganizerDashboardEvent } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<OrganizerDashboardEvent | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => { void loadEvents(); }, [loadEvents]);

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

        {/* Tabel event */}
        <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Daftar event</h2>
              <p className="text-xs text-ink/50">Semua event milik akun organizer kamu.</p>
            </div>
            <button
              type="button"
              onClick={() => loadEvents(page)}
              disabled={status === 'loading'}
              aria-label="Segarkan"
              className="grid size-9 place-items-center rounded-sm border border-ink/10 text-ink/60 hover:border-blaze/40 hover:text-blaze disabled:opacity-40"
            >
              <RefreshCw className={`size-4 ${status === 'loading' ? 'motion-safe:animate-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>

          {/* State: loading/error/empty */}
          {status === 'loading' && !events.length && (
            <p role="status" className="p-8 text-center text-sm text-ink/60">Memuat event…</p>
          )}
          {status === 'error' && (
            <p role="alert" className="p-8 text-center text-sm text-[#EF4444]">Gagal memuat daftar event. Pilih Segarkan untuk mencoba lagi.</p>
          )}
          {status === 'ready' && !events.length && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-ink/60">Belum ada event. Mulai dengan membuat event pertama!</p>
              <button
                type="button"
                onClick={() => openForm('create')}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-blaze px-5 py-2.5 text-sm font-semibold text-ink hover:bg-tangerine"
              >
                <Plus className="size-4" aria-hidden="true" />
                Buat event
              </button>
            </div>
          )}

          {events.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45">
                    <th className="px-5 py-3 text-left">Judul</th>
                    <th className="px-5 py-3 text-left">Mulai</th>
                    <th className="px-5 py-3 text-left">Venue</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {events.map((ev, i) => {
                    const cfg = statusConfig[ev.status] ?? { label: ev.status, tone: 'neutral' as const };
                    const canEdit = ev.status === 'draft' || ev.status === 'rejected';
                    return (
                      <m.tr
                        key={ev.id}
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04, ease }}
                        className="transition-colors hover:bg-ink/[0.025]"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-ink">{ev.title}</span>
                        </td>
                        <td className="px-5 py-3.5 text-ink/70">
                          {dateFormat.format(new Date(ev.start_at))}
                        </td>
                        <td className="px-5 py-3.5 text-ink/70">
                          {ev.venue?.name ?? <span className="text-ink/35">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <DashboardStatus label={cfg.label} tone={cfg.tone} />
                          {ev.status === 'rejected' && (
                            <p className="mt-1 text-xs text-[#EF4444]">Ditolak — perbaiki & ajukan ulang</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setDocuments(ev)}
                              aria-label={`Berkas verifikasi ${ev.title}`}
                              title="Berkas verifikasi"
                              className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink/65 hover:border-blaze hover:text-ink"
                            >
                              <FileText className="size-3.5" aria-hidden="true" />
                            </button>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => openForm(ev)}
                                disabled={submitting}
                                aria-label={`Edit event ${ev.title}`}
                                className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink/65 hover:border-blaze hover:text-ink disabled:opacity-50"
                              >
                                <Pencil className="size-3.5" aria-hidden="true" />
                              </button>
                            )}
                            {canEdit && (
                              <m.button
                                type="button"
                                onClick={() => setConfirmation({ action: 'Ajukan', event: ev })}
                                disabled={submitting}
                                whileTap={reduced ? undefined : { scale: 0.95 }}
                                title="Ajukan ke admin"
                                className="inline-flex items-center gap-1.5 rounded-sm bg-blaze/10 px-3 py-1.5 text-xs font-semibold text-blaze hover:bg-blaze hover:text-ink disabled:opacity-50"
                              >
                                <SendHorizontal className="size-3.5" aria-hidden="true" />
                                Ajukan
                              </m.button>
                            )}
                            {canEdit && (
                              <m.button
                                type="button"
                                onClick={() => setConfirmation({ action: 'Hapus', event: ev })}
                                disabled={submitting}
                                whileTap={reduced ? undefined : { scale: 0.95 }}
                                title="Hapus event"
                                aria-label={`Hapus event ${ev.title}`}
                                className="grid size-8 place-items-center rounded-sm border border-ink/10 text-ink/40 hover:border-[#EF4444]/40 hover:text-[#EF4444] disabled:opacity-50"
                              >
                                <Trash2 className="size-3.5" aria-hidden="true" />
                              </m.button>
                            )}
                          </div>
                        </td>
                      </m.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3">
              <span className="text-xs text-ink/50">Halaman {page} dari {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadEvents(page - 1)}
                  disabled={page <= 1 || status === 'loading'}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-blaze/40 disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" aria-hidden="true" />
                  Sebelumnya
                </button>
                <button
                  onClick={() => loadEvents(page + 1)}
                  disabled={page >= totalPages || status === 'loading'}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-blaze/40 disabled:opacity-40"
                >
                  Berikutnya
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>


        {form === 'create' && (
          // Form tanpa event selalu mengirim data lengkap, termasuk venue.
          <OrganizerEventForm submitting={submitting} onClose={() => setForm(null)} onSubmit={(data) => createEvent(data as EventCreateInput)} />
        )}
        {form && form !== 'create' && (
          <EditEventForm
            event={form}
            submitting={submitting}
            onClose={() => setForm(null)}
            onSubmit={(data) => updateEvent(form.id, data)}
          />
        )}

        {documents && <OrganizerEventDocuments event={documents} onClose={() => setDocuments(null)} />}

        {confirmation && (
          <OrganizerConfirmDialog
            title={`${confirmation.action} “${confirmation.event.title}”?`}
            description={confirmation.action === 'Ajukan'
              ? 'Event akan dikirim ke admin untuk diperiksa. Pastikan kelima berkas verifikasi dan minimal satu kelas tiket sudah ada.'
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
