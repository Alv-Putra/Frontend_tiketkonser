'use client';

import { ClipboardList, Music, QrCode, Ticket } from 'lucide-react';
import { DashboardFrame, DashboardHeader, DashboardLinks } from '@/components/workspace/DashboardKit';
import OrganizerEventPicker from './OrganizerEventPicker';
import OrganizerEventSales from './OrganizerEventSales';

export default function OrganizerDashboard({ salesOnly = false }: { salesOnly?: boolean }) {
  return (
    <DashboardFrame>
      <DashboardHeader title={salesOnly ? 'Laporan penjualan tiket' : 'Ringkasan konser'} subtitle="Pantau pembayaran tiket dan kuota konsermu." />
      <OrganizerEventPicker>{(event) => <OrganizerEventSales key={event.id} event={event} />}</OrganizerEventPicker>
      {!salesOnly && <DashboardLinks items={[
        { label: 'Konser saya', href: '/organizer/concerts', icon: Music },
        { label: 'Kelola kelas tiket', href: '/organizer/categories', icon: Ticket },
        { label: 'Laporan penjualan', href: '/organizer/sales', icon: ClipboardList },
        { label: 'Check-in tiket', href: '/organizer/checkin', icon: QrCode },
      ]} />}
    </DashboardFrame>
  );
}
