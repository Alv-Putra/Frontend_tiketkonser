'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Download,
  ArrowRight,
  Filter,
  Check,
  Calendar,
  MapPin
} from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminConcertsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const toggleConcertSales = useMonitoringStore((state) => state.toggleConcertSales);
  const addConcert = useMonitoringStore((state) => state.addConcert);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConcertName, setNewConcertName] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newQuota, setNewQuota] = useState('2000');

  const filteredConcerts = concerts.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.artist.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'Semua' ||
      (statusFilter === 'Dibuka' && c.salesOpen) ||
      (statusFilter === 'Ditutup' && !c.salesOpen);
    return matchSearch && matchStatus;
  });

  const totalSold = concerts.reduce((acc, c) => acc + c.sold, 0);
  const totalQuota = concerts.reduce((acc, c) => acc + c.quota, 0);
  const openedCount = concerts.filter((c) => c.salesOpen).length;
  const soldOutCount = concerts.filter((c) => !c.salesOpen || c.sold >= c.quota).length;
  const capacityPct = totalQuota > 0 ? ((totalSold / totalQuota) * 100).toFixed(1) : '0';

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newConcertName.trim()) return;
    addConcert({
      name: newConcertName,
      artist: newArtist || 'Berbagai Artis',
      location: newLocation || 'Jakarta',
      schedule: newSchedule || '1 Oktober 2026',
      quota: parseInt(newQuota, 10) || 1000,
      priceFrom: 'Rp500.000'
    });
    setNewConcertName('');
    setNewArtist('');
    setNewLocation('');
    setNewSchedule('');
    setIsAddModalOpen(false);
  };

  const handleExport = () => {
    alert('Daftar konser berhasil diekspor.');
  };

  return (
    <WorkspaceLayout title="Konser">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Kelola konser</h1>
          <p className="text-xs text-[#A7AEC3]">
            Atur informasi konser, jadwal, dan pantau penjualan tiket.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah konser</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Konser dipantau" value={concerts.length.toString()} subtext="Dalam daftar pilihan" />
        <StatCard label="Penjualan dibuka" value={openedCount.toString()} subtext="Dapat menerima pesanan" />
        <StatCard label="Tiket terjual" value={totalSold.toLocaleString('id-ID')} subtext={`Dari ${totalQuota.toLocaleString('id-ID')} kuota`} />
        <StatCard label="Habis terjual" value={soldOutCount.toString()} subtext="Coldplay Tour" />
      </div>

      {/* Main Grid: Concerts Table & Side Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Daftar konser</h2>
              <p className="text-xs text-[#7F89A0]">Pilihan admin</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
              >
                <option value="Semua">Semua status</option>
                <option value="Dibuka">Dibuka</option>
                <option value="Ditutup">Ditutup</option>
              </select>

              <button
                onClick={handleExport}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1E2C] hover:bg-[#232638] border border-[#2A2E40] text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor daftar</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul konser atau artis..."
              className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Jadwal</th>
                  <th className="pb-2.5">Lokasi</th>
                  <th className="pb-2.5">Penjualan</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {filteredConcerts.map((c) => {
                  const pct = Math.round((c.sold / c.quota) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-[#1B1E2C]/50 transition-colors">
                      <td className="py-3 font-medium text-[#F4F5FA]">
                        <Link href={`/concerts/${c.id}`} className="hover:text-[#A78BFA] transition-colors font-semibold">
                          {c.name}
                        </Link>
                        <div className="text-[11px] text-[#7F89A0]">{c.artist}</div>
                      </td>
                      <td className="py-3 text-[#A7AEC3] whitespace-nowrap">{c.schedule}</td>
                      <td className="py-3 text-[#A7AEC3]">{c.location}</td>
                      <td className="py-3 whitespace-nowrap">
                        <div className="font-semibold text-[#F4F5FA]">
                          {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-[#A78BFA]">{pct}% terjual</div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={c.salesOpen ? 'Dibuka' : 'Ditutup'} />
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/concerts/${c.id}`}
                            className="px-2.5 py-1 rounded bg-[#2A2240] hover:bg-[#7953E8] text-[11px] text-[#A78BFA] hover:text-white font-medium transition-colors"
                          >
                            Detail
                          </Link>
                          <button
                            onClick={() => toggleConcertSales(c.id)}
                            type="button"
                            className="px-2.5 py-1 rounded bg-[#1B1E2C] hover:bg-[#2A2E40] border border-[#2A2E40] text-[11px] text-[#A78BFA] font-medium transition-colors"
                          >
                            {c.salesOpen ? 'Tutup' : 'Buka'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* Important Notice */}
          <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
            <h2 className="text-xs font-semibold text-[#A7AEC3] uppercase tracking-wider mb-2">
              Penjualan yang perlu diperhatikan
            </h2>
            <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#36202C] mb-3">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#36202C] text-[#FFA4B8] mb-1.5">
                HABIS TERJUAL
              </span>
              <div className="text-xs font-bold text-[#F4F5FA] mb-1">
                Coldplay: Music of the Spheres
              </div>
              <p className="text-xs text-[#A7AEC3]">
                5.000 tiket terjual. Penjualan sudah ditutup.
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] hover:text-[#DCD1FF]"
            >
              <span>Lihat pengaturan penjualan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Capacity Composition */}
          <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
            <h2 className="text-xs font-semibold text-[#A7AEC3] uppercase tracking-wider mb-2">
              Gambaran kapasitas
            </h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-[#F4F5FA]">{capacityPct}%</span>
              <span className="text-xs text-[#7F89A0]">dari kuota konser pilihan telah terjual</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1B1E2C] overflow-hidden mb-3">
              <div style={{ width: `${capacityPct}%` }} className="h-full bg-[#7953E8] rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-[#A7AEC3]">
              <span>{totalSold.toLocaleString('id-ID')} tiket terjual</span>
              <span>{(totalQuota - totalSold).toLocaleString('id-ID')} tiket tersedia</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#7F89A0]">
            Daftar pilihan admin • Data contoh
          </div>
        </div>
      </div>

      {/* Add Concert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] shadow-2xl p-6">
            <h2 className="text-base font-bold text-[#F4F5FA] mb-1">Tambah konser baru</h2>
            <p className="text-xs text-[#A7AEC3] mb-4">
              Masukkan informasi konser untuk dimasukkan ke direktori pemantauan.
            </p>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Nama Konser</label>
                <input
                  type="text"
                  required
                  value={newConcertName}
                  onChange={(e) => setNewConcertName(e.target.value)}
                  placeholder="Contoh: Soundrenaline 2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Artis Utama</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Sheila on 7"
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Jadwal</label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="Contoh: 15 November 2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Lokasi</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: GBK Madya, Jakarta"
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7AEC3] mb-1">Total Kuota Tiket</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10121C] border border-[#1B1E2C] text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A7AEC3] hover:text-[#F4F5FA]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white"
                >
                  Simpan Konser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
