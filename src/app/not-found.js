'use client';

import Link from 'next/link';
import { Home, Search, Music2 } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

const primaryButton =
  'inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 min-h-[44px] rounded-xl transition-all duration-200 cursor-pointer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 404 Visual */}
          <div className="text-center relative mb-10">
            <div className="text-[100px] md:text-[150px] font-black leading-none select-none bg-gradient-to-b from-slate-100 to-slate-500 bg-clip-text text-transparent">
              404
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center shadow-md shadow-violet-600/30">
              <Music2 size={38} className="text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-slate-400">
                Maaf, halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-slate-100 mb-3">Yang bisa kamu lakukan:</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Periksa kembali URL yang kamu masukkan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Kembali ke halaman sebelumnya</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>Jelajahi festival dan konser yang tersedia</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <BackButton variant="button" label="Kembali" />

              <Link href="/" className={primaryButton}>
                <Home size={18} />
                Kembali ke Beranda
              </Link>

              <Link href="/festivals" className={secondaryButton}>
                <Search size={18} />
                Jelajah Konser
              </Link>
            </div>
          </div>

          {/* Decorative */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-slate-800" />
            <Music2 size={16} className="text-slate-500" />
            <div className="w-12 h-px bg-slate-800" />
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            ConserId: Experience Live Music
          </p>
        </div>
      </div>
    </div>
  );
}
