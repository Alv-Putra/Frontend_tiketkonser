'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag, RotateCw } from 'lucide-react';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminCategoriesPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const addCategory = useMonitoringStore((state) => state.addCategory);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [search, setSearch] = useState('');
  const [concertFilter, setConcertFilter] = useState('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConcertId, setSelectedConcertId] = useState('c1');
  const [categoryName, setCategoryName] = useState('');
  const [categoryPrice, setCategoryPrice] = useState('500000');
  const [categoryQuota, setCategoryQuota] = useState('500');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdminData().catch(() => {});
  }, [fetchAdminData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAdminData();
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const allCategories = [];
  concerts.forEach((c) => {
    (c.categories || []).forEach((cat) => {
      allCategories.push({
        ...cat,
        concertId: c.id,
        concertName: c.name
      });
    });
  });

  const filteredCategories = allCategories.filter((cat) => {
    const matchSearch =
      !search ||
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.concertName.toLowerCase().includes(search.toLowerCase());

    const matchConcert = concertFilter === 'Semua' || cat.concertName === concertFilter;

    const matchAvail =
      availabilityFilter === 'Semua' ||
      (availabilityFilter === 'Tersedia' && cat.remaining > 0) ||
      (availabilityFilter === 'Habis' && cat.remaining <= 0);

    return matchSearch && matchConcert && matchAvail;
  });

  const totalQuota = allCategories.reduce((acc, cat) => acc + (cat.quota || 0), 0);
  const totalSold = allCategories.reduce((acc, cat) => acc + (cat.sold || 0), 0);
  const totalRemaining = Math.max(0, totalQuota - totalSold);
  const soldPct = totalQuota > 0 ? ((totalSold / totalQuota) * 100).toFixed(1) : '0';
  const availableCount = allCategories.filter((cat) => cat.remaining > 0).length;

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    addCategory(selectedConcertId, {
      name: categoryName,
      price: parseInt(categoryPrice, 10) || 500000,
      quota: parseInt(categoryQuota, 10) || 500,
      remaining: parseInt(categoryQuota, 10) || 500,
      sold: 0,
      status: 'Tersedia'
    });
    setCategoryName('');
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Kategori tiket</h1>
          <p className="text-xs text-ink/60">
            Atur kelas, harga, dan alokasi tiket untuk setiap konser.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blaze hover:bg-tangerine text-ink text-xs font-semibold shadow-lg shadow-blaze/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah kategori</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Kategori tiket" value={allCategories.length.toString()} subtext="Dari seluruh konser aktif" />
        <StatCard label="Total kuota" value={totalQuota.toLocaleString('id-ID')} subtext="Semua kelas tiket" />
        <StatCard label="Tiket terjual" value={totalSold.toLocaleString('id-ID')} subtext={`${soldPct}% dari kuota`} />
        <StatCard label="Tiket tersedia" value={totalRemaining.toLocaleString('id-ID')} subtext={`${availableCount} kategori tersedia`} />
      </div>

      {/* Main Grid: Categories Table & Rangkuman Kelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Kelas dan alokasi tiket</h2>
              <p className="text-xs text-ink/45">Daftar tiket berdasarkan konser</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={concertFilter}
                onChange={(e) => setConcertFilter(e.target.value)}
                className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
              >
                <option value="Semua">Semua konser</option>
                {concerts.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
              >
                <option value="Semua">Semua ketersediaan</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Habis">Habis</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas tiket atau nama konser..."
              className="w-full bg-paper border border-ink/10 rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink/45 focus:outline-none focus:border-blaze"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/45 text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Kelas Tiket</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Harga</th>
                  <th className="pb-2.5">Terjual / Kuota</th>
                  <th className="pb-2.5">Sisa</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredCategories.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-ink/[0.03] transition-colors">
                    <td className="py-3 font-semibold text-ink">{cat.name}</td>
                    <td className="py-3 text-ink/60 max-w-[180px] truncate">{cat.concertName}</td>
                    <td className="py-3 text-ink font-medium">Rp{cat.price.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-ink/60">
                      {cat.sold} / {cat.quota}
                    </td>
                    <td className="py-3 font-medium text-ink">{cat.remaining} tersisa</td>
                    <td className="py-3">
                      <StatusBadge status={cat.remaining > 0 ? 'Tersedia' : 'Habis'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Summary */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-ink/10">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blaze mb-2">
              Rangkuman kelas tiket
            </h2>
            <p className="text-xs text-ink font-medium mb-1">
              Alokasi tiket yang jelas, penjualan lebih terkontrol.
            </p>
            <p className="text-xs text-ink/45 mb-4">
              Setiap kategori terhubung ke satu konser, dengan harga dan kuota tersendiri.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-paper border border-ink/10">
                <div className="text-xs font-semibold text-blaze">VIP</div>
                <div className="text-xs text-ink/60 mt-0.5">Akses premium, baris terdepan dan lounge</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-paper border border-ink/10">
                <div className="text-xs font-semibold text-ink">Kategori 1 & 2</div>
                <div className="text-xs text-ink/60 mt-0.5">Area bernomor dengan sudut pandang panggung utama</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-paper border border-ink/10">
                <div className="text-xs font-semibold text-ink">Festival / Reguler</div>
                <div className="text-xs text-ink/60 mt-0.5">Area umum berdiri di depan panggung utama</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-ink/45">
            Data contoh • Kuota tersedia = kuota total − tiket terjual
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-ink/10 p-6">
            <h2 className="font-display text-base font-bold text-ink mb-1">Tambah kategori tiket</h2>
            <p className="text-xs text-ink/60 mb-4">
              Tentukan kelas tiket, harga, dan alokasi kuota.
            </p>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Pilih Konser</label>
                <select
                  value={selectedConcertId}
                  onChange={(e) => setSelectedConcertId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                >
                  {concerts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Contoh: Super VIP"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={categoryPrice}
                  onChange={(e) => setCategoryPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Kuota Tiket</label>
                <input
                  type="number"
                  value={categoryQuota}
                  onChange={(e) => setCategoryQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-ink/60 hover:text-ink"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-blaze hover:bg-tangerine text-xs font-semibold text-ink"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
