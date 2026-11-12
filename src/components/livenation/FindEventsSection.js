'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, Music4, RotateCcw, CalendarSearch } from 'lucide-react';
import useFestivalStore from '@/stores/festivalStore';
import EventCard from './EventCard';
import Skeleton from '@/components/ui/Skeleton';

const GENRES = ['Semua', 'Pop', 'Rock', 'Indie', 'Jazz', 'EDM'];

export default function FindEventsSection() {
  const { festivals, isLoading, fetchFestivals } = useFestivalStore();
  const [query, setQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    const stored = sessionStorage.getItem('ln-search');
    if (stored) sessionStorage.removeItem('ln-search');
    return stored || '';
  });
  const [genre, setGenre] = useState('Semua');
  const [location, setLocation] = useState('Semua');

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const cities = useMemo(() => {
    const set = new Set();
    festivals.forEach((f) => {
      if (f.city) set.add(f.city);
    });
    return ['Semua', ...Array.from(set).sort()];
  }, [festivals]);

  const upcoming = useMemo(() => {
    const q = query.trim().toLowerCase();
    return festivals
      .filter((f) => {
        if (q) {
          const match = [f.title, f.artist, f.venue, f.city, f.genre].some((field) =>
            String(field || '').toLowerCase().includes(q)
          );
          if (!match) return false;
        }
        if (genre && genre !== 'Semua') {
          if (String(f.genre || '').toLowerCase() !== genre.toLowerCase()) return false;
        }
        if (location && location !== 'Semua') {
          if (String(f.city || '').toLowerCase() !== location.toLowerCase()) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [festivals, query, genre, location]);

  const shown = upcoming.slice(0, 8);

  const hasFilters = query.trim() !== '' || genre !== 'Semua' || location !== 'Semua';

  const resetFilters = () => {
    setQuery('');
    setGenre('Semua');
    setLocation('Semua');
  };

  return (
    <section id="find-events" className="bg-[#0B0F19] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-50">
            WHAT&apos;S HAPPENING IN ASIA?
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            Temukan konser dan festival terdekat dengan memfilter genre, kota, atau
            nama artis favoritmu.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-[#111827] border border-slate-800 p-4 rounded-2xl shadow-xl mb-10 md:mb-14"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari artis atau acara"
                aria-label="Cari artis atau acara"
                className="w-full rounded-xl border border-slate-800 bg-[#0F172A] pl-11 pr-10 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Filter lokasi"
                className="w-full appearance-none rounded-xl border border-slate-800 bg-[#0F172A] pl-11 pr-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-[#111827] text-slate-50">
                    {city === 'Semua' ? 'Semua Kota' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div className="relative">
              <Music4
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-label="Filter genre"
                className="w-full appearance-none rounded-xl border border-slate-800 bg-[#0F172A] pl-11 pr-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-[#111827] text-slate-50">
                    {g === 'Semua' ? 'Semua Genre' : g}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex items-stretch">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className={
                  hasFilters
                    ? 'inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer w-full'
                    : 'inline-flex items-center justify-center gap-2 bg-slate-800/60 text-slate-500 border border-slate-800 font-medium px-4 py-2.5 rounded-xl cursor-not-allowed opacity-60 w-full'
                }
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </form>

        <div className="mb-8 md:mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-50">UPCOMING SHOWS</h3>
          {hasFilters && (
            <p className="text-sm text-slate-400 mt-1">
              {upcoming.length} hasil
              {query.trim() ? (
                <>
                  {' '}
                  untuk &ldquo;<span className="text-slate-200">{query.trim()}</span>&rdquo;
                </>
              ) : null}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <Skeleton className="h-4 w-1/3 mt-4" />
                <Skeleton className="h-5 w-3/4 mt-3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : shown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shown.map((festival) => (
              <EventCard key={festival.id} festival={festival} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111827] rounded-2xl border border-slate-800">
            <span className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-slate-800 text-violet-400">
              <CalendarSearch size={28} />
            </span>
            <p className="text-slate-50 font-semibold text-lg mt-5">Tidak ada acara yang cocok</p>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Coba kata kunci lain, seperti nama artis, venue, atau kota.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer mt-6"
            >
              <RotateCcw size={16} /> Reset Filter
            </button>
          </div>
        )}

        {!isLoading && shown.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/festivals"
              className="inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Lihat Semua Acara
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
