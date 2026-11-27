'use client';

import { CheckCircle2, CircleDashed } from 'lucide-react';
import { DashboardFrame, DashboardHeader, DashboardNotice, DashboardStatus, Panel, PanelHead, RefreshButton } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchOrganizerProfile } from '@/services/dashboardService';
import type { OrganizerProfile } from '@/types/dashboard';

const statuses: Record<OrganizerProfile['status'], { label: string; tone: 'positive' | 'warning' | 'danger'; note: string }> = {
  verified: { label: 'Terverifikasi', tone: 'positive', note: 'Kamu bisa membuat konser, mengatur kelas tiket, dan melakukan check-in.' },
  pending: { label: 'Menunggu verifikasi', tone: 'warning', note: 'Admin sedang memeriksa berkas legalitasmu. Konser baru bisa dibuat setelah akun diverifikasi.' },
  rejected: { label: 'Ditolak', tone: 'danger', note: 'Verifikasi ditolak admin. Hubungi tim Tixo untuk memperbaiki berkas.' },
  suspended: { label: 'Ditangguhkan', tone: 'danger', note: 'Akun organizer ditangguhkan. Hubungi tim Tixo untuk informasi lebih lanjut.' },
};

const documentLabels: Record<OrganizerProfile['documents'][number]['type'], string> = {
  business_entity: 'Akta badan usaha',
  nib: 'NIB',
  npwp: 'NPWP perusahaan',
  pic_ktp: 'KTP penanggung jawab',
};

const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-ink/60">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-semibold">{children ?? <span className="font-normal text-ink/45">Belum diisi</span>}</dd>
    </div>
  );
}

export default function OrganizerSettingsPage() {
  const { data, status, refresh } = useDashboardData(fetchOrganizerProfile);
  const state = data && statuses[data.status];

  return (
    <DashboardFrame>
      <DashboardHeader title="Pengaturan" subtitle="Profil perusahaan dan status verifikasi akun organizermu.">
        <RefreshButton loading={status === 'loading'} refresh={refresh} />
      </DashboardHeader>

      {status === 'loading' && !data && <DashboardNotice>Memuat profil organizer…</DashboardNotice>}
      {status === 'error' && <DashboardNotice error>{data ? 'Pembaruan gagal. Data terakhir masih ditampilkan.' : 'Profil organizer gagal dimuat. Pilih Segarkan untuk mencoba lagi.'}</DashboardNotice>}

      {data && (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Panel>
            <PanelHead title="Profil perusahaan" />
            <dl className="divide-y divide-ink/10">
              <Row label="Nama perusahaan">{data.company_name}</Row>
              <Row label="Link profil">tixo.id/{data.slug}</Row>
              <Row label="Email akun">{data.account_email}</Row>
              <Row label="Email kontak">{data.email}</Row>
              <Row label="Telepon">{data.phone}</Row>
              <Row label="Website">{data.website}</Row>
              <Row label="Alamat">{data.address}</Row>
              <Row label="Tentang">{data.description}</Row>
              <Row label="Terdaftar sejak">{date.format(new Date(data.created_at))}</Row>
            </dl>
          </Panel>

          <div className="space-y-4">
            <Panel>
              <PanelHead title="Status verifikasi" />
              <DashboardStatus label={state.label} tone={state.tone} />
              <p className="mt-3 text-sm text-ink/70">{state.note}</p>
              {data.verified_at && <p className="mt-2 text-xs text-ink/55">Diverifikasi {date.format(new Date(data.verified_at))}</p>}
            </Panel>

            <Panel>
              <PanelHead title="Berkas legalitas" subtitle={`${data.documents.filter(({ uploaded }) => uploaded).length} dari ${data.documents.length} berkas sudah diunggah.`} />
              <ul className="space-y-2.5 text-sm">
                {data.documents.map(({ type, uploaded }) => (
                  <li key={type} className="flex items-center gap-2.5">
                    {uploaded
                      ? <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" fill="var(--color-status-success)" />
                      : <CircleDashed aria-hidden="true" className="size-4 shrink-0 text-ink/40" />}
                    <span className={uploaded ? '' : 'text-ink/55'}>{documentLabels[type] ?? type}</span>
                    <span className="sr-only">{uploaded ? ', sudah diunggah' : ', belum diunggah'}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </DashboardFrame>
  );
}
