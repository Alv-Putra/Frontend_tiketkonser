'use client';

import { ClipboardCheck, CreditCard, Music, ShoppingBag, Users } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchAdminCharts, fetchAdminDashboard } from '@/services/dashboardService';
import { DashboardLinks, DashboardNotice, RefreshButton } from '@/components/workspace/DashboardKit';
import DashboardOverview from '@/components/workspace/DashboardOverview';
import AdminDashboardSummary from './AdminDashboardSummary';

export default function AdminDashboard() {
  const { data, status, refresh } = useDashboardData(fetchAdminDashboard);

  return (
    <DashboardOverview
      title="Dashboard admin"
      subtitle="Pantau penjualan, aktivitas platform, dan pengajuan konser."
      load={fetchAdminCharts}
    >
      <section aria-labelledby="operasional-platform" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="operasional-platform" className="font-display text-xl font-extrabold">Operasional platform</h2>
          <RefreshButton loading={status === 'loading'} refresh={refresh} />
        </div>
        {status === 'error' && (
          <DashboardNotice error>{data ? 'Pembaruan gagal. Data terakhir masih ditampilkan.' : 'Ringkasan platform gagal dimuat. Pilih Segarkan untuk mencoba lagi.'}</DashboardNotice>
        )}
        {status === 'loading' && !data && <DashboardNotice>Memuat ringkasan platform…</DashboardNotice>}
        {data && <AdminDashboardSummary totals={data.totals} orders={data.recent_orders} />}
      </section>

      <DashboardLinks items={[
        { label: 'Persetujuan konser', href: '/admin/approvals', icon: ClipboardCheck },
        { label: 'Kelola pengguna', href: '/admin/users', icon: Users },
        { label: 'Daftar konser', href: '/admin/concerts', icon: Music },
        { label: 'Log pesanan', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Pembayaran', href: '/admin/payments', icon: CreditCard },
      ]} />
    </DashboardOverview>
  );
}
