'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import useFestivalStore from '@/stores/festivalStore';
import EventCard from './EventCard';
import Skeleton from '@/components/ui/Skeleton';

export default function FindEventsSection() {
  const { festivals, isLoading, fetchFestivals } = useFestivalStore();
  const [query, setQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    const stored = sessionStorage.getItem('ln-search');
    if (stored) sessionStorage.removeItem('ln-search');
    return stored || '';
  });

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const upcoming = useMemo(() => {
    const q = query.trim().toLowerCase();
    return festivals
      .filter((f) => {
        if (!q) return true;
        return [f.title, f.artist, f.venue, f.city, f.genre].some((field) =>
          String(field || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [festivals, query]);

  const shown = upcoming.slice(0, 8);

  return (
    <section id="find-events" className="font-ln bg-ln-bg scroll-mt-20">
      <div className="max-w-[1256px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="ln-h1 text-ln-text">WHAT&apos;S HAPPENING IN ASIA?</h2>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4 mb-10 md:mb-14"
        >
          <div className="relative flex-1 max-w-[480px] md:mx-auto w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ln-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Artist or Event"
              className="w-full rounded-full border border-ln-line bg-ln-surface pl-11 pr-10 py-3 text-base text-ln-text placeholder:text-ln-muted focus:outline-none focus:border-ln-primary transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ln-muted hover:text-ln-text cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ln-primary text-white font-bold px-8 py-3 hover:bg-ln-primary-dark transition-colors cursor-pointer"
          >
            Find Events
          </button>
        </form>

        <div className="mb-8 md:mb-10">
          <h3 className="ln-h2 text-ln-text">UPCOMING SHOWS</h3>
          {query && (
            <p className="text-sm text-ln-muted mt-1">
              {upcoming.length} hasil untuk &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="font-ln">
                <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : shown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {shown.map((festival) => (
              <EventCard key={festival.id} festival={festival} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-ln-surface rounded-[12px] border border-ln-line">
            <p className="text-ln-text font-semibold">Tidak ada acara yang cocok</p>
            <p className="text-ln-muted text-sm mt-1">
              Coba kata kunci lain &mdash; misalnya nama artis, venue, atau kota.
            </p>
            <button
              onClick={() => setQuery('')}
              className="mt-4 text-ln-primary text-sm font-bold underline cursor-pointer"
            >
              Hapus filter
            </button>
          </div>
        )}

        {!isLoading && shown.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/festivals"
              className="inline-flex items-center gap-2 text-ln-text text-sm font-bold border border-ln-text rounded-full px-6 py-3 hover:bg-ln-text hover:text-white transition-colors"
            >
              Lihat Semua Acara
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}