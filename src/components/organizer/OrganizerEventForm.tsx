'use client';

import { useId, useState, type FormEvent } from 'react';
import { CalendarDays, FileText, Image as ImageIcon, MapPin, X } from 'lucide-react';
import { DashboardNotice, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import { fieldErrorsFrom } from '@/lib/api';
import { formatDateTimeInput } from '@/lib/formatters';
import type { EventCreateInput } from '@/services/dashboardService';
import type { OrganizerEventDetail } from '@/types/dashboard';
import OrganizerDialog from './OrganizerDialog';
import OrganizerField, { organizerInput } from './OrganizerField';

interface Props {
  event?: OrganizerEventDetail;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: EventCreateInput) => Promise<void>;
}

export default function OrganizerEventForm({ event, submitting, onClose, onSubmit }: Props) {
  const uid = useId();
  const [error, setError] = useState<unknown>(null);
  const fieldErrors = fieldErrorsFrom(error);
  const title = event ? `Edit ${event.title}` : 'Buat konser baru';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    const value = (key: string) => String(fd.get(key) ?? '').trim();
    const optional = (key: string) => value(key) || undefined;
    const date = (key: string, previous?: string | null) => {
      const input = value(key);
      if (previous && input === formatDateTimeInput(previous)) return previous;
      return input ? new Date(input).toISOString() : undefined;
    };
    setError(null);

    try {
      await onSubmit({
        category_id: value('category_id'),
        venue_id: value('venue_id'),
        title: value('title'),
        slug: value('slug'),
        summary: optional('summary'),
        description: optional('description'),
        banner: optional('banner'),
        thumbnail: optional('thumbnail'),
        poster: optional('poster'),
        minimum_age: value('minimum_age') === '' ? undefined : Number(value('minimum_age')),
        dress_code: optional('dress_code'),
        gate_open_at: date('gate_open_at', event?.gate_open_at),
        start_at: date('start_at', event?.start_at)!,
        end_at: date('end_at', event?.end_at)!,
        sales_start_at: date('sales_start_at', event?.sales_start_at),
        sales_end_at: date('sales_end_at', event?.sales_end_at),
      });
      onClose();
    } catch (err) {
      setError(err ?? new Error('Gagal menyimpan event. Coba lagi.'));
    }
  }

  function input(name: keyof EventCreateInput, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) {
    const id = `${uid}-${name}`;
    return (
      <OrganizerField id={id} label={label} error={fieldErrors[name]}>
        <input id={id} name={name} className={organizerInput} {...props} />
      </OrganizerField>
    );
  }

  return (
    <OrganizerDialog title={title} busy={submitting} error={error} onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-line/15 px-5 py-4 sm:px-6">
        <h2 className="min-w-0 wrap-break-word font-display text-xl font-extrabold">{title}</h2>
        <button type="button" onClick={onClose} disabled={submitting} aria-label="Tutup form" className={ghostButton}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <form autoComplete="off" onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-6">
        {event?.rejected_reason && <DashboardNotice>Alasan penolakan: {event.rejected_reason}</DashboardNotice>}
        {error !== null && (
          <DashboardNotice error>{error instanceof Error ? error.message : 'Gagal menyimpan event. Coba lagi.'}</DashboardNotice>
        )}

        <fieldset disabled={submitting} className="min-w-0 space-y-3">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <FileText className="size-4 text-blaze" aria-hidden="true" /> Info dasar
          </legend>
          {input('title', 'Judul konser *', { required: true, defaultValue: event?.title })}
          <div className="grid gap-3 sm:grid-cols-2">
            {input('slug', 'Slug URL *', { required: true, defaultValue: event?.slug, spellCheck: false, placeholder: 'java-jazz-2027' })}
            {input('minimum_age', 'Usia minimum', { type: 'number', defaultValue: event?.minimum_age ?? '' })}
          </div>
          {input('summary', 'Ringkasan', { defaultValue: event?.summary ?? '' })}
          <OrganizerField id={`${uid}-description`} label="Deskripsi lengkap" error={fieldErrors.description}>
            <textarea id={`${uid}-description`} name="description" rows={3} defaultValue={event?.description ?? ''} className={organizerInput} />
          </OrganizerField>
          {input('dress_code', 'Dress code', { defaultValue: event?.dress_code ?? '' })}
        </fieldset>

        <fieldset disabled={submitting} className="min-w-0 space-y-3">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <MapPin className="size-4 text-blaze" aria-hidden="true" /> Venue dan kategori
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('venue_id', 'ID Venue *', { inputMode: 'numeric', required: true, defaultValue: event?.venue_id })}
            {input('category_id', 'ID Kategori *', { inputMode: 'numeric', required: true, defaultValue: event?.category_id })}
          </div>
          <p className="text-xs text-ink/70">Hubungi admin untuk mendapatkan ID venue dan kategori yang tersedia.</p>
        </fieldset>

        <fieldset disabled={submitting} className="min-w-0">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <CalendarDays className="size-4 text-blaze" aria-hidden="true" /> Jadwal
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('start_at', 'Mulai event *', { type: 'datetime-local', required: true, defaultValue: formatDateTimeInput(event?.start_at) })}
            {input('end_at', 'Selesai event *', { type: 'datetime-local', required: true, defaultValue: formatDateTimeInput(event?.end_at) })}
            {input('gate_open_at', 'Buka pintu', { type: 'datetime-local', defaultValue: formatDateTimeInput(event?.gate_open_at) })}
            <div className="hidden sm:block" />
            {input('sales_start_at', 'Mulai penjualan tiket', { type: 'datetime-local', defaultValue: formatDateTimeInput(event?.sales_start_at) })}
            {input('sales_end_at', 'Tutup penjualan tiket', { type: 'datetime-local', defaultValue: formatDateTimeInput(event?.sales_end_at) })}
          </div>
        </fieldset>

        <fieldset disabled={submitting} className="min-w-0">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <ImageIcon className="size-4 text-blaze" aria-hidden="true" /> Media (URL)
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {input('banner', 'Banner', { type: 'url', defaultValue: event?.banner ?? '' })}
            {input('thumbnail', 'Thumbnail', { type: 'url', defaultValue: event?.thumbnail ?? '' })}
            {input('poster', 'Poster', { type: 'url', defaultValue: event?.poster ?? '' })}
          </div>
        </fieldset>

        {event && <p className="text-xs text-ink/70">Kolom opsional yang dikosongkan tetap memakai nilai sebelumnya.</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-4">
          <button type="button" onClick={onClose} disabled={submitting} className={ghostButton}>Batal</button>
          <button type="submit" disabled={submitting} className={primaryButton}>
            {submitting ? 'Menyimpan…' : event ? 'Simpan perubahan' : 'Buat event'}
          </button>
        </div>
      </form>
    </OrganizerDialog>
  );
}
