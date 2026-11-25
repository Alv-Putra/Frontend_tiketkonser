'use client';

import { useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { Bell, CalendarDays, Check, CreditCard, ShoppingBag, type LucideIcon } from 'lucide-react';
import { DashboardFrame, DashboardHeader, DashboardNotice, RefreshButton, ease, ghostButton } from '@/components/workspace/DashboardKit';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchNotifications, markNotificationRead } from '@/services/dashboardService';
import type { WorkspaceNotification } from '@/types/dashboard';

const icons: Record<string, LucideIcon> = { order: ShoppingBag, payment: CreditCard, event: CalendarDays };
const time = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

function NotificationItem({ item, index, onRead }: { item: WorkspaceNotification; index: number; onRead: (id: string) => Promise<void> }) {
  const reduced = useReducedMotion();
  const [saving, setSaving] = useState(false);
  const Icon = icons[item.type] ?? Bell;

  return (
    <m.li
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : index * 0.04, ease }}
      className={`flex gap-3 p-4 sm:gap-4 sm:p-5 ${item.is_read ? '' : 'bg-blaze/5'}`}
    >
      <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.is_read ? 'bg-paper text-ink/60' : 'bg-blaze text-ink'}`}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold">
          {!item.is_read && <span className="sr-only">Belum dibaca: </span>}
          {item.title}
        </p>
        {item.message && <p className="mt-1 break-words text-sm text-ink/70">{item.message}</p>}
        <time dateTime={item.created_at} className="mt-1.5 block text-xs text-ink/55">{time.format(new Date(item.created_at))}</time>
      </div>
      {!item.is_read && (
        <button
          type="button"
          disabled={saving}
          onClick={async () => { setSaving(true); await onRead(item.id).finally(() => setSaving(false)); }}
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-md border border-ink/15 bg-white px-3 text-xs font-semibold hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze disabled:opacity-55"
        >
          <Check aria-hidden="true" className="size-3.5" />{saving ? 'Menyimpan…' : 'Tandai dibaca'}
        </button>
      )}
    </m.li>
  );
}

function NotificationPage({ page, onPage }: { page: number; onPage: (page: number) => void }) {
  const { data, status, refresh } = useDashboardData(() => fetchNotifications(page));
  const [failed, setFailed] = useState(false);

  async function read(id: string) {
    setFailed(false);
    try {
      await markNotificationRead(id);
      await refresh();
    } catch {
      setFailed(true);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/70" aria-live="polite">
          {data ? `${data.unread} belum dibaca dari ${data.total} notifikasi` : ''}
        </p>
        <RefreshButton loading={status === 'loading'} refresh={refresh} />
      </div>
      {failed && <DashboardNotice error>Notifikasi gagal ditandai dibaca. Coba lagi.</DashboardNotice>}
      {status === 'loading' && !data && <DashboardNotice>Memuat notifikasi…</DashboardNotice>}
      {status === 'error' && <DashboardNotice error>{data ? 'Pembaruan gagal. Data terakhir masih ditampilkan.' : 'Notifikasi gagal dimuat. Pilih Segarkan untuk mencoba lagi.'}</DashboardNotice>}
      {data && (data.data.length ? (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          {data.data.map((item, index) => <NotificationItem key={item.id} item={item} index={index} onRead={read} />)}
        </ul>
      ) : <DashboardNotice>Belum ada notifikasi. Kabar soal pesanan, pembayaran, dan konsermu akan muncul di sini.</DashboardNotice>)}
      {(page > 1 || (data?.totalPages ?? 0) > 1) && (
        <nav aria-label="Halaman notifikasi" className="flex flex-wrap items-center gap-2">
          <button type="button" className={ghostButton} disabled={page === 1} onClick={() => onPage(page - 1)}>Sebelumnya</button>
          <span className="px-2 text-sm">Halaman {page}{data?.totalPages > 0 && ` dari ${data.totalPages}`}</span>
          <button type="button" className={ghostButton} disabled={!data || page >= data.totalPages} onClick={() => onPage(page + 1)}>Berikutnya</button>
        </nav>
      )}
    </>
  );
}

export default function OrganizerNotifications() {
  const [page, setPage] = useState(1);
  return (
    <DashboardFrame>
      <DashboardHeader title="Notifikasi" subtitle="Kabar terbaru soal pesanan, pembayaran, dan konsermu." />
      <NotificationPage key={page} page={page} onPage={setPage} />
    </DashboardFrame>
  );
}
