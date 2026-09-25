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
    <section id="first-to-know" className="font-ln bg-ln-bg pb-12 md:pb-16 scroll-mt-20">
      <div className="max-w-[1256px] mx-auto px-4 md:px-6">
        <div className="bg-ln-sky rounded-[12px] px-6 py-10 md:px-16 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ln-text">
                <PartyPopper size={16} />
                First To Know
              </span>
              <h2 className="ln-h1 text-ln-text mt-3">
                Dapatkan akses awal ke tiket konser favoritmu!
              </h2>
              <p className="text-base text-ln-text/80 mt-3 leading-relaxed">
                Daftar untuk menjadi yang pertama membeli tiket Presale untuk
                konser-konser terpanas di Indonesia. Terima juga info event
                terbaru dan penawaran khusus langsung ke emailmu.
              </p>
              {user ? (
                <Link
                  href="/my-tickets"
                  className="inline-flex items-center gap-2 mt-6 rounded-full bg-ln-dark text-white font-bold px-8 py-3 hover:bg-ln-text transition-colors"
                >
                  Lihat Tiket Saya
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 mt-6 rounded-full bg-ln-primary text-white font-bold px-8 py-3 hover:bg-ln-primary-dark transition-colors"
                >
                  Register Now
                </Link>
              )}
            </div>

            <div className="bg-ln-surface rounded-[10px] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-ln-sky text-ln-text">
                  <Mail size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-ln-text">Newsletter</h3>
                  <p className="text-sm text-ln-muted">Update event & penawaran spesial</p>
                </div>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-3 rounded-[6px] bg-ln-sky px-4 py-4">
                  <Check size={18} className="text-ln-primary shrink-0" />
                  <p className="text-sm text-ln-text font-semibold">
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
                    className="flex-1 rounded-full border border-ln-line bg-ln-surface px-5 py-3 text-sm text-ln-text outline-none focus:border-ln-primary transition-colors placeholder:text-ln-muted"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-ln-primary text-white font-bold px-6 py-3 text-sm hover:bg-ln-primary-dark transition-colors cursor-pointer"
                  >
                    Subscribe
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