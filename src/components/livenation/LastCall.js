'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Clock } from 'lucide-react';
import useFestivalStore from '@/stores/festivalStore';
import { formatDateShort } from '@/lib/formatters';
import Skeleton from '@/components/ui/Skeleton';

export default function LastCall() {
  const { festivals, isLoading, fetchFestivals } = useFestivalStore();

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const picks = useMemo(() => {
    return festivals
      .map((f) => {
        const remaining = (f.ticketTypes || []).reduce(
          (sum, t) => sum + Math.max(0, t.quota - t.sold),
          0
        );
        return { ...f, remaining };
      })
      .filter((f) => f.ticketStatus === 'available' && f.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 3);
  }, [festivals]);

  return (
    <section className="bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-50">
            LAST CALL FOR TICKETS
          </h2>
          <p className="text-slate-400 mt-3">
            Tiket hampir habis. Amankan tempatmu sebelum kehabisan!
          </p>
        </div>

        {/* Urgency CTA banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/80 via-slate-900 to-violet-950/80 border border-violet-500/30 shadow-xl shadow-black/40 mb-10 md:mb-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 md:p-10">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/85">
                <Flame size={16} />
                Kuota Terbatas
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-3 break-words">
                {picks[0] ? `Tiket ${picks[0].title} hampir habis!` : 'Tiket konser favorit hampir habis!'}
              </h3>
              <p className="text-white/85 mt-2 max-w-xl">
                {picks[0]?.remaining
                  ? `Hanya tersisa ${picks[0].remaining} tiket untuk pertunjukan ini. Amankan tempatmu sekarang juga.`
                  : 'Sisa tiket untuk pertunjukan populer sangat terbatas. Dapatkan tiket resmi sekarang.'}
              </p>
            </div>
            <Link
              href={picks[0] ? `/festivals/${picks[0].id}` : '/festivals'}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-violet-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            >
              Pesan Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {picks.map((festival) => (
              <div
                key={festival.id}
                className="flex flex-col bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300 group"
              >
                <Link href={`/festivals/${festival.id}`} className="block group/card">
                  <div className="relative aspect-video overflow-hidden bg-[#0F172A]">
                    {festival.image ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover/card:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${festival.image})` }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-slate-500 text-xs">
                        Poster belum tersedia
                      </div>
                    )}
                    <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border-amber-500/30">
                      Hampir Habis
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col flex-1 min-w-0 p-6">
                  <h3 className="text-lg font-bold text-slate-50 mt-0 line-clamp-2 break-words">
                    <Link href={`/festivals/${festival.id}`} className="hover:text-violet-300 transition-colors">
                      {festival.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-1 truncate">
                    {festival.artist} · {festival.venue}
                  </p>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock size={14} className="shrink-0 text-slate-500" />
                    {formatDateShort(festival.date)}
                  </p>
                  <p className="text-sm text-rose-400 font-bold mt-3 inline-flex items-center gap-1.5">
                    <Flame size={14} className="shrink-0" />
                    Hanya {festival.remaining} tiket tersisa
                  </p>

                  <Link
                    href={`/festivals/${festival.id}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Lihat Detail <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
