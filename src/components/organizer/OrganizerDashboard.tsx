'use client';

import { ClipboardList, Music, QrCode, Ticket } from 'lucide-react';
import { DashboardFrame, DashboardHeader, DashboardLinks } from '@/components/workspace/DashboardKit';
import DashboardOverview from '@/components/workspace/DashboardOverview';
import { fetchOrganizerCharts } from '@/services/dashboardService';
import OrganizerEventPicker from './OrganizerEventPicker';
import OrganizerEventSales from './OrganizerEventSales';

function ConcertDetails({ salesOnly = false }: { salesOnly?: boolean }) {
  return (
    <section aria-labelledby="detail-penjualan-konser" className="space-y-3">
      <h2 id="detail-penjualan-konser" className="font-display text-xl font-extrabold">
        {salesOnly ? 'Pilih konser untuk analisis' : 'Rincian per konser'}
      </h2>
      <OrganizerEventPicker>
        {(event) => <OrganizerEventSales key={event.id} event={event} />}
      </OrganizerEventPicker>
    </section>
  );
}

export default function OrganizerDashboard({ salesOnly = false }: { salesOnly?: boolean }) {
  if (salesOnly) {
    return (
      <DashboardFrame>
        <DashboardHeader title="Laporan Penjualan Tiket" subtitle="Analisis pendapatan dan performa penjualan per konser musik." />
        <ConcertDetails salesOnly />
      </DashboardFrame>
    );
  }

  return (
    <DashboardOverview
      title="Dashboard organizer"
      subtitle="Pantau penjualan tiket dan performa konsermu."
      load={fetchOrganizerCharts}
      showTopConcerts
    >
      <ConcertDetails />
      <DashboardLinks items={[
        { label: 'Kelola konser', href: '/organizer/concerts', icon: Music },
        { label: 'Kelola kelas tiket', href: '/organizer/categories', icon: Ticket },
        { label: 'Laporan penjualan', href: '/organizer/sales', icon: ClipboardList },
        { label: 'Check-in tiket', href: '/organizer/checkin', icon: QrCode },
      ]} />
    </DashboardOverview>
  );
}
