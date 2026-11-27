'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FFFFFF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* 404 Visual */}
        <div className="relative mb-6">
          <div className="text-[120px] font-black leading-none select-none text-[#27272A]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-2xl bg-ink border border-line flex items-center justify-center shadow-xl p-3">
              <Image
                src="/LogoTixo.png"
                alt="Tixo"
                width={40}
                height={40}
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Halaman yang kamu tuju tidak tersedia atau jalurnya telah dialihkan ke dashboard monitoring.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <BackButton variant="button" label="Kembali" />

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B] shadow-lg shadow-[#FF4D00]/20 transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#141417] hover:bg-[#27272A] border border-[#3F3F46] text-xs font-semibold text-[#FFFFFF] transition-colors w-full sm:w-auto"
          >
            <Search className="w-4 h-4 text-[#FF7A00]" />
            <span>Dashboard Admin</span>
          </Link>
        </div>

        <p className="text-[11px] text-[#71717A] pt-6">
          Tixo © 2026. Platform Tiket Konser & Festival Musik Resmi.
        </p>
      </div>
    </div>
  );
}
