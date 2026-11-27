'use client';

import { useId, useState, type FormEvent } from 'react';
import { CalendarDays, FileCheck2, FileText, Image as ImageIcon, MapPin, X } from 'lucide-react';
import { DashboardNotice, ghostButton, primaryButton } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fieldErrorsFrom } from '@/lib/api';
import { formatDateTimeInput } from '@/lib/formatters';
import { fetchOrganizerCategories, fetchOrganizerCities, type EventCreateInput } from '@/services/dashboardService';
import type { EventDocumentType, OrganizerEventDetail } from '@/types/dashboard';
import OrganizerDialog from './OrganizerDialog';
import OrganizerField, { organizerInput } from './OrganizerField';
import { eventDocumentLabels } from './OrganizerEventDocuments';
import Select from '@/components/ui/Select';

interface Props {
  event?: OrganizerEventDetail;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<EventCreateInput>, documents: [EventDocumentType, File][]) => Promise<void>;
}

const documentTypes = Object.keys(eventDocumentLabels) as EventDocumentType[];

export default function OrganizerEventForm({ event, submitting: external, onClose, onSubmit }: Props) {
  const uid = useId();
  // Tetap sibuk selama berkas diunggah setelah event dibuat, agar tidak terkirim dua kali.
  const [saving, setSaving] = useState(false);
  const submitting = external || saving;
  const [error, setError] = useState<unknown>(null);
  const fieldErrors = fieldErrorsFrom(error);
  const categories = useDashboardData(fetchOrganizerCategories);
  const cities = useDashboardData(fetchOrganizerCities);
  const optionsFailed = categories.status === 'error' || cities.status === 'error';
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
    const venue = { name: value('venue_name'), address: optional('venue_address'), city_id: value('venue_city_id') };
    const old = event?.venue;
    // Venue yang berubah dibuat ulang oleh backend; kirim hanya bila memang diubah.
    const venueChanged = !old || old.name !== venue.name || (old.address ?? undefined) !== venue.address || String(old.city_id) !== venue.city_id;
    const documents = documentTypes
      .map((type) => [type, fd.get(`doc_${type}`)] as const)
      .filter((entry): entry is [EventDocumentType, File] => entry[1] instanceof File && entry[1].size > 0);
    setError(null);
    setSaving(true);

    try {
      await onSubmit({
        category_id: value('category_id'),
        ...(venueChanged && { venue }),
        title: value('title'),
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
      }, documents);
      onClose();
    } catch (err) {
      setError(err ?? new Error('Gagal menyimpan event. Coba lagi.'));
    } finally {
      setSaving(false);
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
        {!event && <p className="text-xs font-semibold text-ink/60">Langkah 1 dari 2 · Detail event dan berkas verifikasi, lalu susun denah kursi.</p>}
        {event?.rejected_reason && <DashboardNotice>Alasan penolakan: {event.rejected_reason}</DashboardNotice>}
        {error !== null && (
          <DashboardNotice error>{error instanceof Error ? error.message : 'Gagal menyimpan event. Coba lagi.'}</DashboardNotice>
        )}

        <fieldset disabled={submitting} className="min-w-0 space-y-3">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <FileText className="size-4 text-blaze" aria-hidden="true" /> Info dasar
          </legend>
          <div>
            {input('title', 'Judul konser *', { required: true, defaultValue: event?.title })}
            <p className="mt-1 text-xs text-ink/60">
              {event ? <>Link konser: <span className="font-semibold text-ink">/{event.slug}</span></> : 'Link konser dibuat otomatis dari judul.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OrganizerField id={`${uid}-category_id`} label="Kategori *" error={fieldErrors.category_id}>
              <Select
                id={`${uid}-category_id`}
                name="category_id"
                required
                variant="field"
                defaultValue={event?.category_id ?? ''}
                placeholder={categories.data ? 'Pilih kategori' : 'Memuat kategori…'}
                options={categories.data?.map(({ id, name }) => ({ value: String(id), label: name })) ?? []}
              />
            </OrganizerField>
            {input('minimum_age', 'Usia minimum', { type: 'number', min: 0, defaultValue: event?.minimum_age ?? '' })}
          </div>
          {input('summary', 'Ringkasan', { defaultValue: event?.summary ?? '' })}
          <OrganizerField id={`${uid}-description`} label="Deskripsi lengkap" error={fieldErrors.description}>
            <textarea id={`${uid}-description`} name="description" rows={3} defaultValue={event?.description ?? ''} className={organizerInput} />
          </OrganizerField>
          {input('dress_code', 'Dress code (opsional)', { defaultValue: event?.dress_code ?? '', placeholder: 'Contoh: serba hitam' })}
        </fieldset>

        <fieldset disabled={submitting} className="min-w-0 space-y-3">
          <legend className="mb-2 inline-flex items-center gap-2 text-sm font-bold">
            <MapPin className="size-4 text-blaze" aria-hidden="true" /> Tempat acara
          </legend>
          <OrganizerField id={`${uid}-venue_name`} label="Nama tempat *" error={fieldErrors['venue.name']}>
            <input id={`${uid}-venue_name`} name="venue_name" required defaultValue={event?.venue?.name ?? ''} placeholder="Contoh: Lapangan Banteng" className={organizerInput} />
          </OrganizerField>
          <div className="grid gap-3 sm:grid-cols-2">
            <OrganizerField id={`${uid}-venue_address`} label="Alamat" error={fieldErrors['venue.address']}>
              <input id={`${uid}-venue_address`} name="venue_address" defaultValue={event?.venue?.address ?? ''} className={organizerInput} />
            </OrganizerField>
            <OrganizerField id={`${uid}-venue_city_id`} label="Kota *" error={fieldErrors['venue.city_id'] ?? fieldErrors.venue}>
              <Select
                id={`${uid}-venue_city_id`}
                name="venue_city_id"
                required
                searchable
                variant="field"
                defaultValue={event?.venue?.city_id ? String(event.venue.city_id) : ''}
                placeholder={cities.data ? 'Pilih kota' : 'Memuat kota…'}
                options={cities.data?.map(({ id, name, province }) => ({ value: String(id), label: province ? `${name}, ${province.name}` : name })) ?? []}
              />
            </OrganizerField>
          </div>
          {optionsFailed && <DashboardNotice error>Daftar kategori atau kota gagal dimuat. Tutup form lalu buka lagi.</DashboardNotice>}
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

        {!event && (
          <fieldset disabled={submitting} className="min-w-0">
            <legend className="mb-1 inline-flex items-center gap-2 text-sm font-bold">
              <FileCheck2 className="size-4 text-blaze" aria-hidden="true" /> Berkas verifikasi
            </legend>
            <p className="mb-3 text-xs text-ink/60">Wajib lengkap sebelum diajukan ke admin; boleh menyusul lewat tombol berkas di daftar event. PDF, JPG, atau PNG, maksimal 5 MB.</p>
            <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
              {documentTypes.map((type) => (
                <li key={type} className="grid gap-2 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] sm:items-center">
                  <label htmlFor={`${uid}-doc_${type}`} className="min-w-0">
                    <span className="block text-sm font-semibold">{eventDocumentLabels[type].label}</span>
                    <span className="block text-xs text-ink/60">{eventDocumentLabels[type].hint}</span>
                  </label>
                  <input
                    id={`${uid}-doc_${type}`}
                    name={`doc_${type}`}
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    className="block w-full min-w-0 cursor-pointer text-xs text-ink/70 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-ink/15 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-ink hover:file:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze"
                  />
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        {event && <p className="text-xs text-ink/70">Kolom opsional yang dikosongkan tetap memakai nilai sebelumnya.</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-4">
          <button type="button" onClick={onClose} disabled={submitting} className={ghostButton}>Batal</button>
          <button type="submit" disabled={submitting} className={primaryButton}>
            {saving && !external ? 'Mengunggah berkas…' : submitting ? 'Menyimpan…' : event ? 'Simpan perubahan' : 'Buat & lanjut ke denah'}
          </button>
        </div>
      </form>
    </OrganizerDialog>
  );
}
