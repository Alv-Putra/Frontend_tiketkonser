'use client';

import { ClipboardCheck, CreditCard, Music, ShoppingBag, Users } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchAdminDashboard } from '@/services/dashboardService';
import AdminDashboardSummary from './AdminDashboardSummary';
import { DashboardFrame, DashboardHeader, DashboardLinks, DashboardNotice, RefreshButton } from './DashboardKit';

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

      {data && totals && <AdminDashboardSummary totals={totals} orders={data.recent_orders} />}

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
