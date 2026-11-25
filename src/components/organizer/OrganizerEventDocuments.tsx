'use client';

import { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { CheckCircle2, CircleDashed, ExternalLink, Upload } from 'lucide-react';
import { DashboardNotice, ease, ghostButton } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fieldErrorsFrom } from '@/lib/api';
import { fetchOrganizerEventDocuments, uploadOrganizerEventDocument } from '@/services/dashboardService';
import type { EventDocumentType, OrganizerDashboardEvent } from '@/types/dashboard';
import OrganizerDialog from './OrganizerDialog';

export const eventDocumentLabels: Record<EventDocumentType, { label: string; hint: string }> = {
  cooperation_agreement: { label: 'Perjanjian kerja sama (PKS)', hint: 'Kontrak dengan venue atau mitra penyelenggara.' },
  venue_permit: { label: 'Izin venue', hint: 'Surat izin pemakaian tempat acara.' },
  crowd_permit: { label: 'Izin keramaian', hint: 'Izin keramaian dari kepolisian.' },
  artist_confirmation: { label: 'Konfirmasi artis', hint: 'Surat kesediaan tampil dari artis atau manajemen.' },
  liability_statement: { label: 'SPTJM', hint: 'Surat pernyataan tanggung jawab mutlak.' },
};

const types = Object.keys(eventDocumentLabels) as EventDocumentType[];
const size = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' });

/** Ganti kode berkas di pesan backend dengan nama yang dikenal organizer. */
export function readableDocumentError(message: string) {
  return types.reduce((text, type) => text.replaceAll(type, eventDocumentLabels[type].label), message);
}

export default function OrganizerEventDocuments({ event, onClose }: { event: OrganizerDashboardEvent; onClose: () => void }) {
  const reduced = useReducedMotion();
  const { data, status, refresh } = useDashboardData(() => fetchOrganizerEventDocuments(event.id));
  const [uploading, setUploading] = useState<EventDocumentType | null>(null);
  const [errors, setErrors] = useState<Partial<Record<EventDocumentType, string>>>({});
  const editable = event.status === 'draft' || event.status === 'rejected';
  const done = types.filter((type) => data?.some((document) => document.type === type)).length;

  async function upload(type: EventDocumentType, file: File | undefined) {
    if (!file) return;
    setUploading(type);
    setErrors((current) => ({ ...current, [type]: undefined }));
    try {
      await uploadOrganizerEventDocument(event.id, type, file);
      await refresh();
    } catch (error) {
      const message = fieldErrorsFrom(error).file ?? (error instanceof Error ? error.message : 'Berkas gagal diunggah.');
      setErrors((current) => ({ ...current, [type]: message }));
    } finally {
      setUploading(null);
    }
  }

  return (
    <OrganizerDialog title={`Berkas verifikasi ${event.title}`} onClose={onClose} busy={uploading !== null} className="max-w-2xl">
      <div className="space-y-5 p-5 sm:p-7">
        <header>
          <h2 className="font-display text-2xl font-extrabold leading-tight">Berkas verifikasi</h2>
          <p className="mt-1 text-sm text-ink/70">
            {editable
              ? 'Lengkapi kelima berkas sebelum mengajukan konser ke admin. Format PDF, JPG, atau PNG, maksimal 5 MB.'
              : 'Berkas hanya bisa diganti saat konser berstatus draf atau ditolak.'}
          </p>
        </header>

        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">{event.title}</span>
            <span className="tabular-nums text-ink/70" aria-live="polite">{done} dari {types.length} berkas</span>
          </div>
          <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
            <m.div
              className="h-full origin-left rounded-full bg-blaze"
              initial={false}
              animate={{ scaleX: done / types.length }}
              transition={{ duration: reduced ? 0 : 0.6, ease }}
            />
          </div>
        </div>

        {status === 'loading' && !data && <DashboardNotice>Memuat berkas…</DashboardNotice>}
        {status === 'error' && <DashboardNotice error>Berkas gagal dimuat. Tutup lalu buka lagi untuk mencoba.</DashboardNotice>}

        {data && (
          <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
            {types.map((type) => {
              const document = data.find((item) => item.type === type);
              const inputId = `berkas-${type}`;
              return (
                <li key={type} className="flex flex-wrap items-center gap-3 p-4">
                  {document
                    ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-ink" fill="var(--color-status-success)" />
                    : <CircleDashed aria-hidden="true" className="size-5 shrink-0 text-ink/40" />}
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="text-sm font-semibold">
                      {eventDocumentLabels[type].label}
                      <span className="sr-only">{document ? ', sudah diunggah' : ', belum diunggah'}</span>
                    </p>
                    <p className="mt-0.5 break-words text-xs text-ink/60">
                      {document
                        ? `${document.original_name}, ${size.format(document.size / 1024 / 1024)} MB, ${date.format(new Date(document.uploaded_at))}`
                        : eventDocumentLabels[type].hint}
                    </p>
                    {errors[type] && <p role="alert" className="mt-1 text-xs font-semibold text-[#EF4444]">{errors[type]}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {document && (
                      <a href={document.url} target="_blank" rel="noopener noreferrer" className={`${ghostButton} min-h-10 px-3 text-xs`}>
                        <ExternalLink aria-hidden="true" className="size-3.5" />Lihat
                      </a>
                    )}
                    {editable && (
                      <>
                        <input
                          id={inputId}
                          type="file"
                          accept="application/pdf,image/jpeg,image/png"
                          className="peer sr-only"
                          disabled={uploading !== null}
                          onChange={(e) => { void upload(type, e.target.files?.[0]); e.target.value = ''; }}
                        />
                        <label
                          htmlFor={inputId}
                          className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blaze peer-disabled:cursor-default peer-disabled:opacity-55 border border-ink/15 bg-white hover:border-blaze`}
                        >
                          <Upload aria-hidden="true" className="size-3.5" />
                          {uploading === type ? 'Mengunggah…' : document ? 'Ganti' : 'Unggah'}
                          <span className="sr-only"> {eventDocumentLabels[type].label}</span>
                        </label>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex justify-end">
          <button type="button" className={ghostButton} disabled={uploading !== null} onClick={onClose}>Selesai</button>
        </div>
      </div>
    </OrganizerDialog>
  );
}
