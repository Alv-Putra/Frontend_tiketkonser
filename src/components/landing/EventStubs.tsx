'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import type { Festival } from '@/types';
import SplitHeading from './SplitHeading';
import TicketCard from './TicketCard';

const MIN_EVENTS = 8;
const MAX_EVENTS = 12;
const ALL = 'Semua';

/**
 * Event dari backend ditampilkan lebih dulu. Bila jumlahnya sedikit,
 * dilengkapi event tayang dari data lokal agar etalase tidak kosong.
 */
async function loadEvents(): Promise<Festival[]> {
  // Dimuat saat dibutuhkan agar data mock tidak ikut bundle awal halaman.
  const { default: festivalService } = await import('@/services/festivalService');
  const [live, local] = await Promise.all([
    festivalService.getPublishedFestivals({ useApi: true }).catch(() => [] as Festival[]),
    festivalService.getPublishedFestivals().catch(() => [] as Festival[]),
  ]);
  const seen = new Set<string>();
  const merged: Festival[] = [];
  for (const event of [...live, ...(live.length >= MIN_EVENTS ? [] : local)]) {
    const key = String(event.title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(event);
  }
  return merged.slice(0, MAX_EVENTS);
}

function SkeletonStub() {
  return <div className="h-[420px] w-[290px] shrink-0 animate-pulse rounded-[28px] bg-onyx sm:w-[320px]" />;
}

export default function EventStubs() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Festival[] | null>(null);
  const [genre, setGenre] = useState(ALL);

  // Ambil event saat browser senggang (setelah konten utama tampil), agar data mock
  // tidak membebani muatan awal halaman.
  useEffect(() => {
    let active = true;
    const start = () =>
      loadEvents()
        .then((items) => active && setEvents(items))
        .catch(() => active && setEvents([]));
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 800);
    return () => {
      active = false;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  // Kartu baru dianimasikan hanya setelah filter diganti (bukan saat pertama tampil).
  const [animateCards, setAnimateCards] = useState(false);
  const pickGenre = (g: string) => {
    setAnimateCards(true);
    setGenre(g);
  };

  const genres = useMemo(() => {
    const list = Array.from(new Set((events ?? []).map((e) => e.genre).filter(Boolean))) as string[];
    return [ALL, ...list];
  }, [events]);

  const visible = useMemo(
    () => (events ?? []).filter((e) => genre === ALL || e.genre === genre),
    [events, genre]
  );

  // Geser native (scroll-snap): tanpa pin atau animasi terikat scroll halaman.
  const [progress, setProgress] = useState(0);
  const onTrackScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0;
    onTrackScroll();
  }, [visible.length]);

  return (
    <section ref={section} id="event" className="scroll-mt-24 overflow-hidden border-b border-line py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SplitHeading className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Lagi <span className="text-blaze">rame</span> di Tixo
          </SplitHeading>
          <p className="max-w-xs text-mute">
            {events ? `${events.length} event siap dikejar.` : 'Memuat event…'} Tiketnya dibeli di app, detailnya bisa
            kamu intip di sini.
          </p>
        </div>

        {/* Filter genre: pil oranye meluncur ke genre aktif (Framer layoutId). */}
        <div role="tablist" aria-label="Filter genre" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {genres.map((g) => {
            const active = g === genre;
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => pickGenre(g)}
                className={`relative shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                  active ? 'border-blaze text-ink' : 'border-line text-mute hover:border-tangerine hover:text-white'
                }`}
              >
                {active && (
                  <m.span
                    layoutId="genre-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-blaze"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{g}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={track}
        onScroll={onTrackScroll}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {events === null ? (
          Array.from({ length: 4 }, (_, i) => <SkeletonStub key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {visible.map((event, i) => (
              <TicketCard key={event.id} event={event} index={i} animateIn={animateCards} />
            ))}
            <m.a
              layout
              key="more"
              href="#penonton"
              className="grid min-h-[420px] w-[290px] shrink-0 snap-start place-items-center rounded-[28px] border-2 border-dashed border-tangerine p-8 text-center transition-colors hover:bg-blaze/10 sm:w-[320px]"
            >
              <span>
                <span className="block font-display text-4xl font-extrabold uppercase leading-none text-tangerine">
                  Masih banyak
                  <br />
                  di app →
                </span>
                <span className="mt-3 block text-sm text-mute">Unduh Tixo untuk lihat semua event</span>
              </span>
            </m.a>
          </AnimatePresence>
        )}

        {events !== null && events.length === 0 && (
          <p className="py-16 text-mute">Belum ada event yang tayang. Jadilah organizer pertama.</p>
        )}
      </div>

      {/* Indikator posisi geser */}
      <div className="mx-auto mt-4 flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-mute">Geser →</span>
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-blaze to-tangerine transition-transform duration-150"
            style={{ transform: `scaleX(${Math.max(0.06, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}
