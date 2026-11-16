'use client';

import Link from 'next/link';
import { Home, Search, Ticket } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0D14] text-[#F4F5FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* 404 Visual */}
        <div className="relative mb-6">
          <div className="text-[120px] font-black leading-none select-none text-[#1B1E2C]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#2A2240] border border-[#362A54] text-[#A78BFA] flex items-center justify-center shadow-xl shadow-[#7953E8]/20">
              <Ticket className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-[#A7AEC3]">
            Halaman yang kamu tuju tidak tersedia atau jalurnya telah dialihkan ke dashboard monitoring.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <BackButton variant="button" label="Kembali" />

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white shadow-lg shadow-[#7953E8]/20 transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#2A2E40] text-xs font-semibold text-[#F4F5FA] transition-colors w-full sm:w-auto"
          >
            <Search className="w-4 h-4 text-[#A78BFA]" />
            <span>Dashboard Admin</span>
          </Link>
        </div>

        <p className="text-[11px] text-[#7F89A0] pt-6">
          ConserId © 2026. Platform Tiket Konser & Festival Musik Resmi.
        </p>
      </div>
    </div>
  );
}
