'use client';

import Image from 'next/image';
import Link from 'next/link';
import { m } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { Festival } from '@/types';
import { photoForEvent } from './data';

// Warna nama di atas foto bergantian agar deretan tiket tidak monoton.
const NAME_COLORS = ['text-white', 'text-blaze', 'text-paper', 'text-tangerine'];

const STATUS_LABEL: Record<string, string> = {
  sold_out: 'Habis',
  coming_soon: 'Segera',
};

function dateParts(iso?: string) {
  if (!iso) return { day: '??', month: 'TBA', weekday: 'Segera', year: '' };
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('id-ID', { day: '2-digit' }),
    month: d.toLocaleDateString('id-ID', { month: 'short' }).replace('.', ''),
    weekday: d.toLocaleDateString('id-ID', { weekday: 'short' }),
    year: String(d.getFullYear()),
  };
}

/** Nama besar di poster: artis utama, atau judul tanpa embel-embel tahun/tur. */
function posterName(event: Festival) {
  const base = (event.artist && event.artist.length <= 18 ? event.artist : event.title) || 'Live';
  return base.split(':')[0].replace(/\b(20\d\d|festival|tour|the)\b/gi, '').trim() || base;
}

export default function TicketCard({
  event,
  index,
  animateIn = false,
}: {
  event: Festival;
  index: number;
  animateIn?: boolean;
}) {
  const photo = photoForEvent(event);
  const nameColor = NAME_COLORS[index % NAME_COLORS.length];
  const { day, month, weekday, year } = dateParts(event.date);
  const status = STATUS_LABEL[event.ticketStatus as string];
  const name = posterName(event);
  // Nama panjang dikecilkan agar tetap utuh di poster.
  const nameSize = name.length > 16 ? 'text-[1.7rem]' : name.length > 10 ? 'text-[2.15rem]' : 'text-[2.8rem]';
  const code = `TX-${String(event.id).replace(/\W/g, '').slice(-4).toUpperCase().padStart(4, '0')}`;

  return (
    <m.article
      layout
      initial={animateIn ? { opacity: 0, scale: 0.85, rotate: -4 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: 6, transition: { duration: 0.2 } }}
      whileHover={{ y: -14, rotate: index % 2 ? 1.8 : -1.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="w-[290px] shrink-0 snap-start sm:w-[320px]"
      data-stub
    >
      <Link
        href={`/concerts/${event.id}`}
        prefetch={false}
        aria-label={`${event.title}, ${day} ${month} ${year}`}
        className="group block overflow-hidden rounded-[28px] bg-onyx ring-1 ring-line transition-[box-shadow] duration-300 hover:ring-2 hover:ring-blaze"
      >
        {/* Poster foto (JPEG asli, tanpa konversi format) */}
        <div className="relative h-48 overflow-hidden bg-line">
          <Image
            src={photo.src}
            alt=""
            fill
            unoptimized
            loading="lazy"
            sizes="320px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <p
            className={`absolute bottom-2 left-4 right-4 line-clamp-3 font-display ${nameSize} font-extrabold uppercase leading-[0.85] tracking-tighter ${nameColor} drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-translate-y-1`}
          >
            {name}
          </p>
          <span
            className={`absolute right-3 top-3 rotate-6 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
              status ? 'bg-ink/80 text-white' : 'bg-ink text-blaze'
            }`}
          >
            {status ?? event.genre ?? 'Live'}
          </span>
          <span className="absolute left-4 top-3 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/80">
            {code}
          </span>
        </div>

        {/* Perforasi */}
        <div className="relative h-0">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-ink" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-ink" />
          <span className="absolute left-5 right-5 top-0 border-t-2 border-dashed border-line" />
        </div>

        {/* Badan tiket */}
        <div className="flex gap-4 p-5">
          <div className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-ink py-2 text-center">
            <span className="text-[10px] font-bold uppercase text-mute">{weekday}</span>
            <span className="font-display text-3xl font-extrabold leading-none text-white">{day}</span>
            <span className="text-[11px] font-bold uppercase text-tangerine">{month}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-display text-lg font-extrabold leading-tight text-white">{event.title}</h3>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-mute">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{[event.venue, event.city].filter(Boolean).join(', ') || 'Indonesia'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-line px-5 pb-5 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mute">Mulai dari</p>
            <p className="font-display text-xl font-extrabold text-white">
              {event.priceStart ? formatCurrency(event.priceStart) : 'Gratis'}
            </p>
          </div>
          {/* Barcode dekoratif */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-9 w-16 opacity-60"
              style={{
                background:
                  'repeating-linear-gradient(90deg, #fff 0 2px, transparent 2px 4px, #fff 4px 5px, transparent 5px 8px, #fff 8px 11px, transparent 11px 13px)',
              }}
            />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blaze text-ink transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Link>
    </m.article>
  );
}
