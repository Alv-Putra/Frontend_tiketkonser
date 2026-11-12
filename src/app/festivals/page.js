'use client';

import { useState, useEffect, useDeferredValue, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Music } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import FestivalCardClient from '@/components/festivals/FestivalCardClient';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import useFestivalStore from '@/stores/festivalStore';
import { GENRE_OPTIONS, SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

const inputClass =
  'w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200';

const selectClass =
  'w-full bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 cursor-pointer transition-all duration-200';

export default function FestivalsPage() {
  const { filteredFestivals, isLoading, fetchFestivals, applyFilters } = useFestivalStore();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const { check } = useRateLimit({ maxAttempts: 30, windowMs: 60000 });

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  useEffect(() => {
    const loadCities = async () => {
      setCitiesLoading(true);
      try {
        const res = await fetch('https://wilayah.id/api/provinces.json');
        const provinces = await res.json();
        const cities = provinces.map((p) => p.name);
        setCityOptions(cities);
      } catch {
        setCityOptions(['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Kalimantan Timur']);
      } finally {
        setCitiesLoading(false);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    applyFilters({
      query: deferredQuery,
      genre,
      city,
      sort,
      priceRange,
    });
  }, [deferredQuery, genre, city, sort, priceRange, applyFilters]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setGenre('');
    setCity('');
    setSort('newest');
    setPriceRange(null);
  }, []);

  const hasActiveFilters = query || genre || city || priceRange;

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 text-slate-50">
            <span className="text-gradient">Daftar Festival</span>
          </h1>
          <p className="text-slate-400">
            Temukan festival dan konser favoritmu
          </p>
        </motion.div>

        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl shadow-xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Search size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari konser atau artis..."
                className={inputClass}
                aria-label="Cari festival"
              />
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectClass}
              aria-label="Filter lokasi"
            >
              <option value="">{citiesLoading ? 'Memuat kota...' : 'Semua Lokasi'}</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={selectClass}
              aria-label="Filter kategori"
            >
              <option value="">Semua Kategori</option>
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={selectClass}
              aria-label="Urutkan"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={priceRange ? `${priceRange.min}-${priceRange.max}` : ''}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setPriceRange(e.target.value ? { min, max } : null);
              }}
              className={selectClass}
              aria-label="Filter rentang harga"
            >
              <option value="">Semua Harga</option>
              {PRICE_RANGES.map((r) => (
                <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>
              ))}
            </select>

            <Button
              variant="secondary"
              onClick={resetFilters}
              className="sm:col-span-1"
              leftIcon={X}
            >
              Reset
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-3 text-slate-500">
              <span className="text-xs">
                {filteredFestivals.length} hasil ditemukan
              </span>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
              >
                <X size={12} />
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                <Skeleton className="h-48 mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#111827] border border-slate-800 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-[#0F172A] border border-slate-800 flex items-center justify-center mb-4">
              <Music size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Tidak ada festival
            </h3>
            <p className="text-slate-400 max-w-md mb-6">
              Tidak ada konser yang sesuai dengan pencarian. Coba ubah kata kunci atau
              atur ulang filter kamu.
            </p>
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFestivals.map((festival, i) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="h-full"
              >
                <FestivalCardClient festival={festival} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
