'use client';

import Link from 'next/link';
import { ArrowRight, Banknote, ClipboardCheck, CreditCard, Music, ShoppingBag, Users } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/lib/formatters';
import { fetchAdminDashboard } from '@/services/dashboardService';
import type { AdminDashboardData } from '@/types/dashboard';
import { DashboardFrame, DashboardHeader, DashboardLinks, DashboardNotice, DashboardStatus, MetricGrid, Panel, PanelHead, RefreshButton, ghostButton } from './DashboardKit';

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
const numberFormat = new Intl.NumberFormat('id-ID');
const orderStatus = {
  paid: { label: 'Lunas', tone: 'positive' },
  pending: { label: 'Menunggu pembayaran', tone: 'warning' },
  expired: { label: 'Kedaluwarsa', tone: 'neutral' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
  refunded: { label: 'Dikembalikan', tone: 'neutral' },
} as const;

function LatestOrders({ orders }: { orders: AdminDashboardData['recent_orders'] }) {
  return (
    <Panel>
      <PanelHead title="Pesanan terbaru" subtitle="Pesanan masuk dari seluruh platform." />
      {orders.length ? (
        <ul className="divide-y divide-ink/10">
          {orders.map((order) => (
            <li key={order.id} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="break-all text-sm font-semibold">{order.order_number}</p>
                <p className="break-all text-sm text-ink/65">{order.user.email}</p>
                <time dateTime={order.created_at} className="text-xs text-ink/65">{dateFormat.format(new Date(order.created_at))} WIB</time>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="text-sm font-semibold tabular-nums">{formatCurrency(order.total)}</span>
                <DashboardStatus {...(orderStatus[order.status] ?? { label: order.status })} />
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-ink/65">Belum ada pesanan.</p>}
    </Panel>
  );
}

function ApprovalCard({ pending }: { pending: number }) {
  return (
    <section className="ticket-notch rounded-2xl bg-ink p-6 text-paper sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-bold">Pengajuan konser</h2>
        <ClipboardCheck aria-hidden="true" className="size-6 shrink-0 text-tangerine" />
      </div>
      <p className="mt-3 font-display text-5xl font-extrabold tracking-tight tabular-nums">{numberFormat.format(pending)}</p>
      <p className="mb-5 mt-1 text-sm text-paper/80">{pending ? 'Konser menunggu persetujuan' : 'Semua pengajuan sudah ditinjau'}</p>
      <Link href="/admin/approvals" className={ghostButton}>Tinjau pengajuan <ArrowRight aria-hidden="true" className="size-4" /></Link>
    </section>
  );
}

export default function AdminDashboard() {
  const { data, status, refresh } = useDashboardData(fetchAdminDashboard);
  const totals = data?.totals;

  return (
    <DashboardFrame>
      <DashboardHeader title="Ringkasan platform" subtitle="Pantau pendapatan, pesanan, dan pengajuan konser.">
        <RefreshButton loading={status === 'loading'} refresh={refresh} />
      </DashboardHeader>

      {status === 'error' && <DashboardNotice error>{data ? 'Pembaruan gagal. Data terakhir masih ditampilkan. Pilih Segarkan untuk mencoba lagi.' : 'Ringkasan gagal dimuat. Pilih Segarkan untuk mencoba lagi.'}</DashboardNotice>}
      {status === 'loading' && !data && <DashboardNotice>Memuat ringkasan platform…</DashboardNotice>}

      {data && totals && (
        <>
          <MetricGrid items={[
            { label: 'Pendapatan dari pesanan lunas', value: formatCurrency(totals.paid_revenue), icon: Banknote },
            { label: 'Pesanan lunas', value: numberFormat.format(totals.paid_orders), icon: ShoppingBag },
            { label: 'Akun pengguna', value: numberFormat.format(totals.users), icon: Users, note: `${numberFormat.format(totals.organizers)} organizer terdaftar` },
            { label: 'Total konser', value: numberFormat.format(totals.events), icon: Music },
          ]} />
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <LatestOrders orders={data.recent_orders} />
            <ApprovalCard pending={totals.pending_events} />
          </div>
        </>
      )}

      <DashboardLinks items={[
        { label: 'Persetujuan konser', href: '/admin/approvals', icon: ClipboardCheck },
        { label: 'Kelola pengguna', href: '/admin/users', icon: Users },
        { label: 'Daftar konser', href: '/admin/concerts', icon: Music },
        { label: 'Log pesanan', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Pembayaran', href: '/admin/payments', icon: CreditCard },
      ]} />
    </DashboardFrame>
  );
}
