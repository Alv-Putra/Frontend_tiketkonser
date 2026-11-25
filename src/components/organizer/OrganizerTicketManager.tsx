'use client';

import { useState, useId, type FormEvent } from 'react';
import { Plus, Trash2, Edit2, RefreshCw, X, Ticket } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { DashboardFrame, DashboardHeader, DashboardNotice, DashboardStatus, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import MotionProvider from '@/components/landing/MotionProvider';
import { useDashboardData } from '@/hooks/useDashboardData';
import OrganizerEventPicker from './OrganizerEventPicker';
import {
  fetchOrganizerTickets,
  createOrganizerTicket,
  updateOrganizerTicket,
  deleteOrganizerTicket,
  type TicketCreateInput,
} from '@/services/dashboardService';
import type { OrganizerDashboardEvent, OrganizerTicket } from '@/types/dashboard';
import { formatCurrency, formatDateTimeInput } from '@/lib/formatters';
import { fieldErrorsFrom } from '@/lib/api';
import OrganizerConfirmDialog from './OrganizerConfirmDialog';
import OrganizerDialog from './OrganizerDialog';
import OrganizerField, { organizerInput } from './OrganizerField';

const statusConfig: Record<string, { label: string; tone: 'neutral' | 'positive' | 'warning' | 'danger' }> = {
  active: { label: 'Tersedia', tone: 'positive' },
  sold_out: { label: 'Habis', tone: 'danger' },
  inactive: { label: 'Nonaktif', tone: 'neutral' },
};

function TicketModal({
  eventId,
  priceLocked,
  ticket,
  onClose,
  onSaved,
}: {
  eventId: string;
  priceLocked: boolean;
  ticket: OrganizerTicket | null;
  onClose: () => void;
  onSaved: () => void;
}) {

  const uid = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const fieldErrors = fieldErrorsFrom(error);
  const title = ticket ? `Edit ${ticket.name}` : 'Tambah Kelas Tiket';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    const value = (key: string) => String(fd.get(key) ?? '').trim();
    const optionalNumber = (key: string) => value(key) === '' ? undefined : Number(value(key));
    const changedDate = (key: string, previous?: string | null) => {
      const input = value(key);
      return input && input !== formatDateTimeInput(previous) ? new Date(input).toISOString() : undefined;
    };
    setSubmitting(true);
    setError(null);

    try {
      const price = Number(value('price'));
      const data = {
        name: value('name'),
        description: value('description') || undefined,
        quota: Number(value('quota')),
        wave: optionalNumber('wave'),
        max_purchase: optionalNumber('max_purchase'),
        status: value('status') as TicketCreateInput['status'],
        sale_start_at: changedDate('sale_start_at', ticket?.sale_start_at),
        sale_end_at: changedDate('sale_end_at', ticket?.sale_end_at),
      };
      if (ticket) {
        await updateOrganizerTicket(ticket.id, {
          ...data,
          ...(priceLocked || price === Number(ticket.price) ? {} : { price }),
        });
      } else {
        await createOrganizerTicket({ ...data, event_id: eventId, price });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err ?? new Error('Gagal menyimpan kelas tiket. Coba lagi.'));
    } finally {
      setSubmitting(false);
    }
  }

  function input(name: keyof TicketCreateInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) {
    const id = `${uid}-${name}`;
    return (
      <OrganizerField id={id} label={label} error={fieldErrors[name]}>
        <input id={id} name={name} className={organizerInput} {...props} />
      </OrganizerField>
    );
  }

  return (
    <OrganizerDialog title={title} onClose={onClose} busy={submitting} error={error} className="max-w-lg">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <h2 className="min-w-0 wrap-break-word font-display text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} disabled={submitting} aria-label="Tutup" className={ghostButton}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error !== null && (
            <DashboardNotice error>{error instanceof Error ? error.message : 'Gagal menyimpan kelas tiket. Coba lagi.'}</DashboardNotice>
          )}
          <fieldset disabled={submitting} className="min-w-0 space-y-4">
            {input('name', 'Nama Kelas Tiket *', { required: true, defaultValue: ticket?.name })}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                {input('price', 'Harga (IDR) *', {
                  type: 'number', step: 'any', required: true, readOnly: priceLocked, defaultValue: ticket?.price,
                  'aria-describedby': priceLocked ? `${uid}-price-note` : undefined,
                })}
                {priceLocked && <p id={`${uid}-price-note`} className="mt-1 text-xs text-ink/70">Harga dikunci setelah event diajukan.</p>}
              </div>
              {input('quota', 'Kuota Tiket *', { type: 'number', required: true, defaultValue: ticket?.quota })}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {input('wave', 'Gelombang', { type: 'number', defaultValue: ticket ? ticket.wave ?? '' : 1 })}
              {input('max_purchase', 'Maks. Beli', { type: 'number', defaultValue: ticket ? ticket.max_purchase ?? '' : 5 })}
              <OrganizerField id={`${uid}-status`} label="Status" error={fieldErrors.status}>
                <select id={`${uid}-status`} name="status" defaultValue={ticket?.status ?? 'active'} className={organizerInput}>
                  <option value="active">Tersedia</option>
                  <option value="sold_out">Habis</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </OrganizerField>
            </div>
            <OrganizerField id={`${uid}-description`} label="Deskripsi / Benefit" error={fieldErrors.description}>
              <textarea id={`${uid}-description`} name="description" rows={2} defaultValue={ticket?.description ?? ''} className={organizerInput} />
            </OrganizerField>
            <div className="grid gap-3 sm:grid-cols-2">
              {input('sale_start_at', 'Mulai Jual', { type: 'datetime-local', defaultValue: formatDateTimeInput(ticket?.sale_start_at) })}
              {input('sale_end_at', 'Selesai Jual', { type: 'datetime-local', defaultValue: formatDateTimeInput(ticket?.sale_end_at) })}
            </div>
          </fieldset>

          <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-4">
            <button type="button" onClick={onClose} disabled={submitting} className={ghostButton}>Batal</button>
            <button type="submit" disabled={submitting} className={primaryButton}>
              {submitting ? 'Menyimpan…' : ticket ? 'Simpan Perubahan' : 'Tambah Tiket'}
            </button>
          </div>
        </form>
      </div>
    </OrganizerDialog>
  );
}

function EventTicketsSection({ event }: { event: OrganizerDashboardEvent }) {
  const { data, status, refresh: loadTickets } = useDashboardData(() => fetchOrganizerTickets(event.id));
  const [actionError, setActionError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<OrganizerTicket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrganizerTicket | null>(null);
  const reduced = useReducedMotion();
  const tickets = data ?? [];
  const [deleting, setDeleting] = useState(false);
  const loading = status === 'loading';
  const error = actionError || (status === 'error' ? 'Gagal memuat kelas tiket konser.' : null);

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setActionError(null);
    setDeleting(true);
    try {
      await deleteOrganizerTicket(deleteTarget.id);
      void loadTickets();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Gagal menghapus tiket.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink">{event.title}</h2>
          <p className="text-xs text-ink/60">Daftar kategori dan kuota tiket untuk konser ini.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadTickets}
            disabled={loading}
            aria-label="Segarkan"
            className="grid size-9 place-items-center rounded-xl border border-ink/10 text-ink/60 hover:text-ink disabled:opacity-40"
          >
            <RefreshCw className={`size-4 ${loading ? 'motion-safe:animate-spin' : ''}`} />
          </button>
          <m.button
            type="button"
            onClick={() => { setEditingTicket(null); setModalOpen(true); }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-blaze px-4 py-2 text-xs font-semibold text-ink hover:bg-tangerine"
          >
            <Plus className="size-3.5" />
            Tambah Kelas Tiket
          </m.button>
        </div>
      </div>

      {error && <DashboardNotice error>{error}</DashboardNotice>}

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {loading && !tickets.length && (
          <p role="status" className="p-8 text-center text-sm text-ink/60">Memuat tiket…</p>
        )}
        {status === 'ready' && !tickets.length && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Ticket className="size-8 text-ink/30" />
            <p className="text-sm text-ink/60">Belum ada kelas tiket untuk konser ini.</p>
            <button
              type="button"
              onClick={() => { setEditingTicket(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 rounded-full bg-blaze px-4 py-2 text-xs font-semibold text-ink hover:bg-tangerine"
            >
              <Plus className="size-3.5" />
              Buat Kelas Tiket
            </button>
          </div>
        )}
        {tickets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45">
                  <th className="px-5 py-3">Nama Tiket</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Kuota</th>
                  <th className="px-5 py-3">Terjual</th>
                  <th className="px-5 py-3">Tersedia</th>
                  <th className="px-5 py-3">Gelombang</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.06]">
                {tickets.map((t) => {
                  const cfg = statusConfig[t.status] ?? { label: t.status, tone: 'neutral' as const };
                  const remaining = Math.max(0, t.quota - t.sold);
                  return (
                    <tr key={t.id} className="hover:bg-ink/[0.025] transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-ink">
                        <div>{t.name}</div>
                        {t.description && <div className="text-[11px] font-normal text-ink/50">{t.description}</div>}
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-ink font-semibold">{formatCurrency(t.price)}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink/70">{t.quota.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink/70">{t.sold.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5 tabular-nums text-ink font-semibold">{remaining.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5 text-ink/70">{t.wave ?? 1}</td>
                      <td className="px-5 py-3.5">
                        <DashboardStatus label={cfg.label} tone={cfg.tone} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setEditingTicket(t); setModalOpen(true); }}
                            aria-label={`Edit ${t.name}`}
                            className="grid size-7 place-items-center rounded-lg border border-ink/10 text-ink/50 hover:border-blaze hover:text-blaze"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(t)}
                            aria-label={`Hapus ${t.name}`}
                            className="grid size-7 place-items-center rounded-lg border border-ink/10 text-ink/50 hover:border-[#EF4444] hover:text-[#EF4444]"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {modalOpen && (
        <TicketModal
          eventId={event.id}
          ticket={editingTicket}
          priceLocked={!!editingTicket && event.status !== 'draft' && event.status !== 'rejected'}
          onClose={() => setModalOpen(false)}
          onSaved={loadTickets}
        />
      )}

      {deleteTarget && (
        <OrganizerConfirmDialog
          title={`Hapus tiket “${deleteTarget.name}”?`}
          description="Kelas tiket yang sudah dihapus tidak bisa dipulihkan."
          action="Hapus"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default function OrganizerTicketManager() {
  return (
    <MotionProvider>
      <DashboardFrame>
        <DashboardHeader
          title="Kelas tiket"
          subtitle="Atur tipe tiket, kuota, gelombang penjualan, dan harga tiket per konser."
        />
        <OrganizerEventPicker>
          {(event) => <EventTicketsSection key={event.id} event={event} />}
        </OrganizerEventPicker>
      </DashboardFrame>
    </MotionProvider>
  );
}
