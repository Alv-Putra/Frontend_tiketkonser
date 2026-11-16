'use client';

import { useState } from 'react';
import { Plus, Search, Tag } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminCategoriesPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const addCategory = useMonitoringStore((state) => state.addCategory);

  const [search, setSearch] = useState('');
  const [concertFilter, setConcertFilter] = useState('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConcertId, setSelectedConcertId] = useState('c1');
  const [categoryName, setCategoryName] = useState('');
  const [categoryPrice, setCategoryPrice] = useState('500000');
  const [categoryQuota, setCategoryQuota] = useState('500');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Kategori tiket</h1>
          <p className="text-xs text-[#A7AEC3]">
            Atur kelas, harga, dan alokasi tiket untuk setiap konser.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all self-start md:self-auto"
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Kelas dan alokasi tiket</h2>
              <p className="text-xs text-[#7F89A0]">Daftar tiket berdasarkan konser</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={concertFilter}
                onChange={(e) => setConcertFilter(e.target.value)}
                className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
              >
                <option value="Semua">Semua konser</option>
                {concerts.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
              >
                <option value="Semua">Semua ketersediaan</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Habis">Habis</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas tiket atau nama konser..."
              className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Kelas Tiket</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Harga</th>
                  <th className="pb-2.5">Terjual / Kuota</th>
                  <th className="pb-2.5">Sisa</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {filteredCategories.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-[#1B1E2C]/50 transition-colors">
                    <td className="py-3 font-semibold text-[#F4F5FA]">{cat.name}</td>
                    <td className="py-3 text-[#A7AEC3] max-w-[180px] truncate">{cat.concertName}</td>
                    <td className="py-3 text-[#F4F5FA] font-medium">Rp{cat.price.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-[#A7AEC3]">
                      {cat.sold} / {cat.quota}
                    </td>
                    <td className="py-3 font-medium text-[#F4F5FA]">{cat.remaining} tersisa</td>
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
          <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
            <h2 className="text-xs font-semibold text-[#A7AEC3] uppercase tracking-wider mb-2">
              Rangkuman kelas tiket
            </h2>
            <p className="text-xs text-[#F4F5FA] font-medium mb-1">
              Alokasi tiket yang jelas, penjualan lebih terkontrol.
            </p>
            <p className="text-xs text-[#7F89A0] mb-4">
              Setiap kategori terhubung ke satu konser, dengan harga dan kuota tersendiri.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="text-xs font-semibold text-[#A78BFA]">VIP</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Akses premium, baris terdepan dan lounge</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="text-xs font-semibold text-[#F4F5FA]">Kategori 1 & 2</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Area bernomor dengan sudut pandang panggung utama</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="text-xs font-semibold text-[#8DE2BD]">Festival / Reguler</div>
                <div className="text-xs text-[#A7AEC3] mt-0.5">Area umum berdiri di depan panggung utama</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#7F89A0]">
            Data contoh • Kuota tersedia = kuota total − tiket terjual
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] shadow-2xl p-6">
            <h2 className="text-base font-bold text-[#F4F5FA] mb-1">Tambah kategori tiket</h2>
            <p className="text-xs text-[#A7AEC3] mb-4">
              Tentukan kelas tiket, harga, dan alokasi kuota.
            </p>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Pilih Konser</label>
                <select
                  value={selectedConcertId}
                  onChange={(e) => setSelectedConcertId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                >
                  {concerts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Contoh: Super VIP"
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={categoryPrice}
                  onChange={(e) => setCategoryPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Kuota Tiket</label>
                <input
                  type="number"
                  value={categoryQuota}
                  onChange={(e) => setCategoryQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white"
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
