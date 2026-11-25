'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchOrganizerDashboardEvents } from '@/services/dashboardService';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { DashboardNotice, RefreshButton, ghostButton } from '@/components/workspace/DashboardKit';
import Select from '@/components/ui/Select';

export const eventDate = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' });

function EventPage({ page, onPage, children }: { page: number; onPage: (page: number) => void; children: (event: OrganizerDashboardEvent) => ReactNode }) {
  const { data, status, refresh } = useDashboardData(() => fetchOrganizerDashboardEvents(page));
  const [selected, setSelected] = useState('');
  const event = data?.data.find(({ id }) => id === selected) ?? data?.data[0];
  const hasPagination = page > 1 || (data?.totalPages ?? 0) > 1;

  return (
    <>
      <section className="ticket-notch min-w-0 rounded-2xl bg-ink p-6 text-paper sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1 basis-52">
            <label htmlFor="dashboard-event" className="mb-2 block text-sm font-semibold">Konser yang dipantau</label>
            <Select
              id="dashboard-event"
              variant="field"
              className="max-w-md"
              value={event?.id ?? ''}
              disabled={!event}
              onChange={setSelected}
              placeholder={status === 'loading' ? 'Memuat konser…' : 'Tidak ada konser di halaman ini'}
              options={data?.data.map((item) => ({ value: item.id, label: item.title })) ?? []}
            />
          </div>
          <RefreshButton loading={status === 'loading'} refresh={refresh} />
        </div>
        {hasPagination && (
          <nav aria-label="Halaman daftar konser" className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" className={ghostButton} disabled={page === 1} onClick={() => onPage(page - 1)}>Sebelumnya</button>
            <span className="px-2 text-sm">Halaman {page}{data?.totalPages > 0 && ` dari ${data.totalPages}`}</span>
            <button type="button" className={ghostButton} disabled={!data || page >= data.totalPages} onClick={() => onPage(page + 1)}>Berikutnya</button>
          </nav>
        )}
      </section>
      {status === 'error' && <DashboardNotice error>Daftar konser gagal diperbarui. Pilih Segarkan untuk mencoba lagi.</DashboardNotice>}
      {status === 'ready' && !event && <DashboardNotice>Belum ada konser di halaman ini.</DashboardNotice>}
      {event && children(event)}
    </>
  );
}

export default function OrganizerEventPicker({ children }: { children: (event: OrganizerDashboardEvent) => ReactNode }) {
  const [page, setPage] = useState(1);
  return <EventPage key={page} page={page} onPage={setPage}>{children}</EventPage>;
}
