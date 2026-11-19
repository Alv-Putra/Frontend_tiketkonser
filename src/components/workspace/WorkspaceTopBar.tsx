'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, Check, User, ArrowRight } from 'lucide-react';
import useMonitoringStore from '@/stores/monitoringStore';

export default function WorkspaceTopBar({ pageTitle }) {
  const router = useRouter();
  const workspace = useMonitoringStore((state) => state.workspace);
  const setWorkspace = useMonitoringStore((state) => state.setWorkspace);
  const searchQuery = useMonitoringStore((state) => state.searchQuery);
  const setSearchQuery = useMonitoringStore((state) => state.setSearchQuery);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isOrganizer = workspace === 'organizer';

  const handleSwitchRole = (role) => {
    setWorkspace(role);
    setProfileOpen(false);
    if (role === 'organizer') {
      router.push('/organizer');
    } else {
      router.push('/admin');
    }
  };

  return (
    <header className="h-20 bg-[#0F0F12] border-b border-[#27272A] px-6 lg:px-8 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-[#71717A]">Workspace</span>
        <span className="text-[#71717A]">/</span>
        <span className="text-[#FFFFFF] font-semibold">{pageTitle}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Global Workspace Search */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di workspace..."
            className="w-full bg-[#141417] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00] transition-colors"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            type="button"
            className="w-9 h-9 rounded-lg bg-[#141417] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4D00]" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#141417] border border-[#27272A] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#FFFFFF]">Notifikasi Operasional</span>
                <span className="text-[11px] text-[#FF7A00]">2 baru</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-[#27272A] text-xs">
                  <div className="text-[#FFFFFF] font-medium">2 Pembayaran perlu verifikasi</div>
                  <div className="text-[#A1A1AA] text-[11px] mt-0.5">Siti Rahma & Dian Pratama mengirim bukti transfer.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#27272A] text-xs">
                  <div className="text-[#FFFFFF] font-medium">Coldplay Tour habis terjual</div>
                  <div className="text-[#A1A1AA] text-[11px] mt-0.5">Penjualan tiket otomatis ditutup sesuai kuota 5.000.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            type="button"
            className="flex items-center gap-3 pl-3 pr-2.5 py-1.5 rounded-xl bg-[#141417] border border-[#27272A] hover:bg-[#27272A] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-xs">
              {isOrganizer ? 'J' : 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-[#FFFFFF]">
                {isOrganizer ? 'Java Festival Prod.' : 'Administrator'}
              </div>
              <div className="text-[10px] text-[#71717A]">
                {isOrganizer ? 'Organizer role' : 'Super admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141417] border border-[#27272A] shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-[11px] text-[#71717A] font-semibold uppercase">
                Ganti Workspace
              </div>
              <button
                onClick={() => handleSwitchRole('admin')}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  !isOrganizer ? 'bg-[#2A1000] text-[#FF7A00] font-medium' : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]'
                }`}
              >
                <span>Admin Workspace</span>
                {!isOrganizer && <Check className="w-3.5 h-3.5 text-[#FF7A00]" />}
              </button>
              <button
                onClick={() => handleSwitchRole('organizer')}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isOrganizer ? 'bg-[#2A1000] text-[#FF7A00] font-medium' : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]'
                }`}
              >
                <span>Organizer Workspace</span>
                {isOrganizer && <Check className="w-3.5 h-3.5 text-[#FF7A00]" />}
              </button>
              <div className="my-1 border-t border-[#27272A]" />
              <Link
                href="/"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A] transition-colors"
              >
                <span>Lihat Beranda</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
