'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { formatDateShort, formatCurrency } from '@/lib/formatters';

function statusLabel(festival) {
  if (festival.ticketStatus === 'sold_out') {
    return {
      text: 'Habis',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    };
  }
  if (festival.ticketStatus === 'coming_soon') {
    return {
      text: 'Segera',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    };
  }

  const types = festival.ticketTypes || [];
  const quota = types.reduce((sum, t) => sum + (t.quota || 0), 0);
  const sold = types.reduce((sum, t) => sum + (t.sold || 0), 0);
  if (quota > 0 && quota - sold <= Math.max(1, Math.floor(quota * 0.15))) {
    return {
      text: 'Hampir Habis',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    };
  }

  return {
    text: 'Tersedia',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };
}

export default function EventCard({ festival }) {
  const status = statusLabel(festival);
  const soldOut = festival.ticketStatus === 'sold_out';
  const comingSoon = festival.ticketStatus === 'coming_soon';

  return (
    <article className="flex flex-col h-full bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300 group">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Link
          href={`/festivals/${festival.id}`}
          className="block w-full h-full"
          aria-label={festival.title}
        >
          {festival.image ? (
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${festival.image})` }}
            />
          ) : (
            <div className="w-full h-full bg-[#0F172A] grid place-items-center text-slate-500 text-xs">
              Poster belum tersedia
            </div>
          )}
        </Link>
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        <span
          className={`absolute top-3 right-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${status.badge}`}
        >
          {status.text}
        </span>
      </div>

      <div className="flex flex-col flex-1 min-w-0 p-4">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider truncate">
          {formatDateShort(festival.date)}
        </p>

        <h3 className="text-lg font-bold text-slate-50 line-clamp-2 mt-1.5 break-words group-hover:text-violet-300 transition-colors">
          <Link href={`/festivals/${festival.id}`}>{festival.title}</Link>
        </h3>

        {festival.artist && (
          <p className="text-sm text-slate-400 line-clamp-1 mt-1 truncate">{festival.artist}</p>
        )}

        <p className="text-sm text-slate-400 mt-2 flex items-start gap-1.5 min-w-0">
          <MapPin size={15} className="shrink-0 mt-0.5 text-slate-500" />
          <span className="line-clamp-1 break-words">{festival.venue}</span>
        </p>

        <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-xs text-slate-400">Mulai dari</span>
            <span className="block text-lg font-bold text-white truncate">
              {formatCurrency(festival.priceStart)}
            </span>
          </div>

          {soldOut || comingSoon ? (
            <span className="inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-5 py-2.5 rounded-xl cursor-not-allowed opacity-60 whitespace-nowrap">
              {soldOut ? 'Habis' : 'Segera'}
            </span>
          ) : (
            <Link
              href={`/festivals/${festival.id}`}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold px-4 py-2 min-h-[40px] rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Pesan <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
