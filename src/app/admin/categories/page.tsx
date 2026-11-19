'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag, RotateCw } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
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
    <WorkspaceLayout title="Kategori Tiket">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Kategori tiket</h1>
          <p className="text-xs text-[#A1A1AA]">
            Atur kelas, harga, dan alokasi tiket untuk setiap konser.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-[#09090B] text-xs font-semibold shadow-lg shadow-[#FF4D00]/20 transition-all self-start md:self-auto"
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141417] border border-[#27272A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#FFFFFF]">Kelas dan alokasi tiket</h2>
              <p className="text-xs text-[#71717A]">Daftar tiket berdasarkan konser</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={concertFilter}
                onChange={(e) => setConcertFilter(e.target.value)}
                className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
              >
                <option value="Semua">Semua konser</option>
                {concerts.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
              >
                <option value="Semua">Semua ketersediaan</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Habis">Habis</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas tiket atau nama konser..."
              className="w-full bg-[#0F0F12] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#71717A] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Kelas Tiket</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Harga</th>
                  <th className="pb-2.5">Terjual / Kuota</th>
                  <th className="pb-2.5">Sisa</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredCategories.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-[#27272A]/50 transition-colors">
                    <td className="py-3 font-semibold text-[#FFFFFF]">{cat.name}</td>
                    <td className="py-3 text-[#A1A1AA] max-w-[180px] truncate">{cat.concertName}</td>
                    <td className="py-3 text-[#FFFFFF] font-medium">Rp{cat.price.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-[#A1A1AA]">
                      {cat.sold} / {cat.quota}
                    </td>
                    <td className="py-3 font-medium text-[#FFFFFF]">{cat.remaining} tersisa</td>
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
          <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
            <h2 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Rangkuman kelas tiket
            </h2>
            <p className="text-xs text-[#FFFFFF] font-medium mb-1">
              Alokasi tiket yang jelas, penjualan lebih terkontrol.
            </p>
            <p className="text-xs text-[#71717A] mb-4">
              Setiap kategori terhubung ke satu konser, dengan harga dan kuota tersendiri.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                <div className="text-xs font-semibold text-[#FF7A00]">VIP</div>
                <div className="text-xs text-[#A1A1AA] mt-0.5">Akses premium, baris terdepan dan lounge</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                <div className="text-xs font-semibold text-[#FFFFFF]">Kategori 1 & 2</div>
                <div className="text-xs text-[#A1A1AA] mt-0.5">Area bernomor dengan sudut pandang panggung utama</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                <div className="text-xs font-semibold text-[#8DE2BD]">Festival / Reguler</div>
                <div className="text-xs text-[#A1A1AA] mt-0.5">Area umum berdiri di depan panggung utama</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#71717A]">
            Data contoh • Kuota tersedia = kuota total − tiket terjual
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141417] border border-[#27272A] shadow-2xl p-6">
            <h2 className="text-base font-bold text-[#FFFFFF] mb-1">Tambah kategori tiket</h2>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Tentukan kelas tiket, harga, dan alokasi kuota.
            </p>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Pilih Konser</label>
                <select
                  value={selectedConcertId}
                  onChange={(e) => setSelectedConcertId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                >
                  {concerts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Contoh: Super VIP"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={categoryPrice}
                  onChange={(e) => setCategoryPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Kuota Tiket</label>
                <input
                  type="number"
                  value={categoryQuota}
                  onChange={(e) => setCategoryQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B]"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
