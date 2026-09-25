'use client';

import { useState, useEffect, useDeferredValue, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Music } from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import FestivalCardClient from '@/components/festivals/FestivalCardClient';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import useFestivalStore from '@/stores/festivalStore';
import { GENRE_OPTIONS, SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants';
import useRateLimit from '@/hooks/useRateLimit';

export default function FestivalsPage() {
  const { filteredFestivals, isLoading, fetchFestivals, applyFilters } = useFestivalStore();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
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
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-gradient">Daftar Festival</span>
          </h1>
          <p className="text-text-secondary">
            Temukan festival dan konser favoritmu
          </p>
        </motion.div>

        <div className="bg-secondary-bg border border-border rounded-[24px] p-5 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Search size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari festival, artis, atau venue..."
                className="w-full bg-surface border border-border rounded-full pl-12 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all duration-200"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-surface border border-border rounded-full px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'border-primary-accent text-primary-accent' : ''}
              >
                <SlidersHorizontal size={16} />
                Filter
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 pt-5 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                  Genre Musik
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-surface border border-border rounded-full px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
                >
                  <option value="">Semua Genre</option>
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                  Kota / Daerah
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface border border-border rounded-full px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
                >
                  <option value="">Semua Kota</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">
                  Rentang Harga
                </label>
                <select
                  value={priceRange ? `${priceRange.min}-${priceRange.max}` : ''}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setPriceRange(e.target.value ? { min, max } : null);
                  }}
                  className="w-full bg-surface border border-border rounded-full px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
                >
                  <option value="">Semua Harga</option>
                  {PRICE_RANGES.map((r) => (
                    <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {filteredFestivals.length} hasil ditemukan
              </span>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-error hover:underline cursor-pointer"
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
              <div key={i} className="bg-secondary-bg border border-border rounded-[18px] p-4">
                <Skeleton className="h-48 mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredFestivals.length === 0 ? (
          <EmptyState
            icon={Music}
            title="Tidak ada festival"
            description="Tidak ada konser yang sesuai dengan pencarian."
            actionLabel="Reset Filter"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFestivals.map((festival, i) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
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