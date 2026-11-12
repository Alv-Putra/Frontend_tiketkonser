'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Ticket } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { formatDateShort, formatCurrency } from '@/lib/formatters';

export default function FestivalCardClient({ festival }) {
  const isSoldOut = festival.ticketStatus === 'sold_out';
  const ticketStatus = isSoldOut ? 'sold' : 'available';

  const statusLabel = isSoldOut
    ? 'Habis'
    : festival.ticketStatus === 'coming_soon'
      ? 'Segera'
      : 'Tersedia';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link
        href={`/festivals/${festival.id}`}
        className="flex flex-col h-full bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300 group"
      >
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          <img
            src={festival.image}
            alt={festival.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />
          <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end">
            {festival.featured && <Badge variant="featured">Featured</Badge>}
            <Badge variant={ticketStatus}>{statusLabel}</Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-violet-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDateShort(festival.date)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-50 line-clamp-2 mb-1 group-hover:text-violet-300 transition-colors">
            {festival.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1 mb-2">{festival.artist}</p>
          <p className="text-sm text-slate-400 flex items-center gap-1.5 mb-3">
            <MapPin size={14} className="shrink-0 text-slate-500" />
            <span className="truncate">{festival.venue}</span>
          </p>

          <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs text-slate-500 block">Mulai dari</span>
              <span className="text-lg font-bold text-white whitespace-nowrap">
                {formatCurrency(festival.priceStart)}
              </span>
            </div>

            {isSoldOut ? (
              <span className="inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-4 py-2 rounded-xl cursor-not-allowed opacity-60">
                <Ticket size={16} />
                Habis
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 bg-violet-600 group-hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors text-sm">
                Pesan
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
