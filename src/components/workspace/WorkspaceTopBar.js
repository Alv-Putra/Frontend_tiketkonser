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
    <header className="h-20 bg-[#10121C] border-b border-[#1B1E2C] px-6 lg:px-8 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-[#7F89A0]">Workspace</span>
        <span className="text-[#7F89A0]">/</span>
        <span className="text-[#F4F5FA] font-semibold">{pageTitle}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Global Workspace Search */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di workspace..."
            className="w-full bg-[#151824] border border-[#1B1E2C] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8] transition-colors"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            type="button"
            className="w-9 h-9 rounded-lg bg-[#151824] border border-[#1B1E2C] flex items-center justify-center text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7953E8]" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#151824] border border-[#1B1E2C] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#F4F5FA]">Notifikasi Operasional</span>
                <span className="text-[11px] text-[#A78BFA]">2 baru</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-[#1B1E2C] text-xs">
                  <div className="text-[#F4F5FA] font-medium">2 Pembayaran perlu verifikasi</div>
                  <div className="text-[#A7AEC3] text-[11px] mt-0.5">Siti Rahma & Dian Pratama mengirim bukti transfer.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#1B1E2C] text-xs">
                  <div className="text-[#F4F5FA] font-medium">Coldplay Tour habis terjual</div>
                  <div className="text-[#A7AEC3] text-[11px] mt-0.5">Penjualan tiket otomatis ditutup sesuai kuota 5.000.</div>
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
            className="flex items-center gap-3 pl-3 pr-2.5 py-1.5 rounded-xl bg-[#151824] border border-[#1B1E2C] hover:bg-[#1B1E2C] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2A2240] text-[#A78BFA] flex items-center justify-center font-bold text-xs">
              {isOrganizer ? 'J' : 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-[#F4F5FA]">
                {isOrganizer ? 'Java Festival Prod.' : 'Administrator'}
              </div>
              <div className="text-[10px] text-[#7F89A0]">
                {isOrganizer ? 'Organizer role' : 'Super admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7F89A0]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#151824] border border-[#1B1E2C] shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-[11px] text-[#7F89A0] font-semibold uppercase">
                Ganti Workspace
              </div>
              <button
                onClick={() => handleSwitchRole('admin')}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  !isOrganizer ? 'bg-[#2A2240] text-[#A78BFA] font-medium' : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                }`}
              >
                <span>Admin Workspace</span>
                {!isOrganizer && <Check className="w-3.5 h-3.5 text-[#A78BFA]" />}
              </button>
              <button
                onClick={() => handleSwitchRole('organizer')}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isOrganizer ? 'bg-[#2A2240] text-[#A78BFA] font-medium' : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                }`}
              >
                <span>Organizer Workspace</span>
                {isOrganizer && <Check className="w-3.5 h-3.5 text-[#A78BFA]" />}
              </button>
              <div className="my-1 border-t border-[#1B1E2C]" />
              <Link
                href="/"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C] transition-colors"
              >
                <span>Lihat Beranda</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7F89A0]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
