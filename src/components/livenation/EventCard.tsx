'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDateShort, formatCurrency } from '@/lib/formatters';

function statusLabel(festival) {
  if (festival.ticketStatus === 'sold_out') return { text: 'Sold Out', color: 'var(--color-ln-surface)' };
  if (festival.ticketStatus === 'coming_soon') return { text: 'Coming Soon', color: 'var(--color-ln-sky)' };
  return { text: 'On Sale', color: 'var(--color-ln-accent)' };
}

export default function EventCard({ festival }) {
  const status = statusLabel(festival);

  return (
    <Link href={`/festivals/${festival.id}`} className="group flex flex-col font-ln">
      <div className="relative aspect-[16/9] rounded-[8px] overflow-hidden bg-ln-line">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: `url(${festival.image})` }}
        />
        <span
          className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[11px] font-bold text-ln-text leading-[1.33]"
          style={{ backgroundColor: status.color }}
        >
          {status.text}
        </span>
        <span className="absolute bottom-2 right-2 z-10 grid place-items-center w-8 h-8 rounded-full bg-ln-surface text-ln-primary shadow group-hover:scale-110 transition-transform">
          <ArrowRight size={16} />
        </span>
      </div>

      <div className="pt-4">
        <h3 className="text-base font-bold text-ln-text leading-snug line-clamp-2 group-hover:text-ln-primary transition-colors">
          {festival.title}
        </h3>
        <p className="text-sm text-ln-muted line-clamp-1 mt-1">{festival.artist}</p>
        <p className="text-sm text-ln-muted line-clamp-1 mt-2">
          {formatDateShort(festival.date)} · {festival.venue}
        </p>

        <div className="flex items-center justify-between border-t border-ln-line mt-3 pt-3">
          <span className="text-sm text-ln-text">Mulai dari</span>
          <span className="text-sm font-bold text-ln-primary">
            {formatCurrency(festival.priceStart)}
          </span>
        </div>
      </div>
    </Link>
  );
}