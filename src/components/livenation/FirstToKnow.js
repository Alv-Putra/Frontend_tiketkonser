'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, PartyPopper } from 'lucide-react';
import useAuthStore from '@/stores/authStore';

export default function FirstToKnow() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const user = useAuthStore((state) => state.user);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <section id="first-to-know" className="bg-[#0B0F19] pb-16 sm:pb-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#111827] border border-slate-800 px-6 py-10 md:px-12 md:py-14">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-400">
                <PartyPopper size={16} />
                First To Know
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-50 mt-3 break-words">
                Dapatkan akses awal ke tiket konser favoritmu!
              </h2>
              <p className="text-slate-400 mt-3 leading-relaxed">
                Daftar untuk menjadi yang pertama membeli tiket Presale untuk
                konser-konser terpanas di Indonesia. Terima juga info event
                terbaru dan penawaran khusus langsung ke emailmu.
              </p>
              {user ? (
                <Link
                  href="/my-tickets"
                  className="inline-flex items-center justify-center gap-2 mt-6 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Lihat Tiket Saya
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 mt-6 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Daftar Sekarang
                </Link>
              )}
            </div>

            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-slate-800 text-violet-400 shrink-0">
                  <Mail size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-50">Newsletter</h3>
                  <p className="text-sm text-slate-400">Update event & penawaran spesial</p>
                </div>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-4">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <p className="text-sm text-slate-100 font-semibold">
                    Berhasil! Kamu sudah terdaftar di newsletter kami.
                  </p>
                </div>
              ) : (
                <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Alamat email kamu"
                    aria-label="Alamat email kamu"
                    className="flex-1 min-w-0 rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 text-sm text-slate-50 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Langganan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
