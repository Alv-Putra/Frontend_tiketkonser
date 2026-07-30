'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Music, Calendar, SlidersHorizontal, X, DollarSign, TicketCheck } from 'lucide-react';

const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Bali', 'Medan', 'Makassar'];
const genres = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip Hop', 'R&B', 'Indie', 'Metal', 'Dangdut', 'K-Pop'];
const priceRanges = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: '< Rp100.000', min: 0, max: 100000 },
  { label: 'Rp100rb - Rp500rb', min: 100000, max: 500000 },
  { label: 'Rp500rb - Rp1jt', min: 500000, max: 1000000 },
  { label: '> Rp1.000.000', min: 1000000, max: Infinity },
];
const ticketStatuses = ['Semua Status', 'Available', 'Sold Out'];
const sortOptions = ['Terbaru', 'Terdekat', 'Harga Termurah', 'Harga Termahal', 'Paling Populer'];

export default function SearchFilter({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [genre, setGenre] = useState('');
  const [date, setDate] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [ticketStatus, setTicketStatus] = useState('Semua Status');
  const [sort, setSort] = useState('Terbaru');
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = () => {
    onFilterChange?.({ search, city, genre, date, priceRange, ticketStatus, sort });
  };

  const triggerChange = (key, value) => {
    onFilterChange?.({ search, city, genre, date, priceRange, ticketStatus, sort, [key]: value });
  };

  const resetFilters = () => {
    setSearch('');
    setCity('');
    setGenre('');
    setDate('');
    setPriceRange('');
    setTicketStatus('Semua Status');
    setSort('Terbaru');
    onFilterChange?.({ search: '', city: '', genre: '', date: '', priceRange: '', ticketStatus: 'Semua Status', sort: 'Terbaru' });
  };

  const hasFilters = city || genre || date || priceRange || ticketStatus !== 'Semua Status';

  return (
    <section className="py-12 -mt-20 relative z-30">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-secondary-bg border border-border rounded-[18px] p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari konser, artis, atau venue..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); triggerChange('search', e.target.value); }}
                className="w-full bg-surface border border-border rounded-[12px] pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-[12px] border transition-colors cursor-pointer ${
                showFilters || hasFilters ? 'bg-primary-accent/10 border-primary-accent/30 text-primary-accent' : 'bg-surface border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <MapPin size={14} /> Kota
                  </label>
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); triggerChange('city', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors"
                  >
                    <option value="">Semua Kota</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <Music size={14} /> Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => { setGenre(e.target.value); triggerChange('genre', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors"
                  >
                    <option value="">Semua Genre</option>
                    {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <Calendar size={14} /> Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); triggerChange('date', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <DollarSign size={14} /> Rentang Harga
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => { setPriceRange(e.target.value); triggerChange('priceRange', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors"
                  >
                    {priceRanges.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <TicketCheck size={14} /> Status Tiket
                  </label>
                  <select
                    value={ticketStatus}
                    onChange={(e) => { setTicketStatus(e.target.value); triggerChange('ticketStatus', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors"
                  >
                    {ticketStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <SlidersHorizontal size={14} /> Urutkan
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); triggerChange('sort', e.target.value); }}
                    className="w-full bg-surface border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary-accent/50 transition-colors"
                  >
                    {sortOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-4 flex items-center gap-1.5 text-sm text-primary-accent hover:text-primary-accent/80 transition-colors cursor-pointer"
                >
                  <X size={14} />
                  Reset Filter
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
