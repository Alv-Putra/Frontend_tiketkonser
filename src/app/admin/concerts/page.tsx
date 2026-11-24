'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Download,
  ArrowRight,
  Filter,
  Check,
  Calendar,
  MapPin,
  RotateCw
} from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminConcertsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const toggleConcertSales = useMonitoringStore((state) => state.toggleConcertSales);
  const addConcert = useMonitoringStore((state) => state.addConcert);
  const createAndPublishConcert = useMonitoringStore((state) => state.createAndPublishConcert);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConcertName, setNewConcertName] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newQuota, setNewQuota] = useState('2000');
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newConcertName.trim()) return;
    setIsLoading(true);
    try {
      await createAndPublishConcert({
        name: newConcertName,
        artist: newArtist || newConcertName,
        location: newLocation || 'Jakarta',
        schedule: newSchedule || '1 Oktober 2026',
        quota: parseInt(newQuota, 10) || 1000,
        priceFrom: 500000,
      });
      await fetchAdminData();
      setNewConcertName('');
      setNewArtist('');
      setNewLocation('');
      setNewSchedule('');
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'Gagal menambahkan konser ke backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    alert('Daftar konser berhasil diekspor.');
  };

  return (
    <WorkspaceLayout title="Konser">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Kelola konser</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
              LIVE BACKEND
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Atur informasi konser, jadwal, dan pantau ketersediaan tiket langsung dari database.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-[#FFFFFF] text-xs font-semibold border border-[#3F3F46] transition-all cursor-pointer"
            title="Muat ulang data live backend"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF7A00]' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-[#09090B] text-xs font-semibold shadow-lg shadow-[#FF4D00]/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah konser</span>
          </button>
        </div>
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141417] border border-[#27272A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#FFFFFF]">Daftar konser</h2>
              <p className="text-xs text-[#71717A]">Pilihan admin</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
              >
                <option value="Semua">Semua status</option>
                <option value="Dibuka">Dibuka</option>
                <option value="Ditutup">Ditutup</option>
              </select>

              <button
                onClick={handleExport}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#2F2F33] border border-[#3F3F46] text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor daftar</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul konser atau artis..."
              className="w-full bg-[#0F0F12] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#71717A] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Jadwal</th>
                  <th className="pb-2.5">Lokasi</th>
                  <th className="pb-2.5">Penjualan</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredConcerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-[#71717A]">
                      Belum ada konser yang terdaftar. Klik tombol &quot;Tambah konser&quot; di atas untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  filteredConcerts.map((c) => {
                  const pct = Math.round((c.sold / c.quota) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-[#27272A]/50 transition-colors">
                      <td className="py-3 font-medium text-[#FFFFFF]">
                        <Link href={`/concerts/${c.id}`} className="hover:text-[#FF7A00] transition-colors font-semibold">
                          {c.name}
                        </Link>
                        <div className="text-[11px] text-[#71717A]">{c.artist}</div>
                      </td>
                      <td className="py-3 text-[#A1A1AA] whitespace-nowrap">{c.schedule}</td>
                      <td className="py-3 text-[#A1A1AA]">{c.location}</td>
                      <td className="py-3 whitespace-nowrap">
                        <div className="font-semibold text-[#FFFFFF]">
                          {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-[#FF7A00]">{pct}% terjual</div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={c.salesOpen ? 'Dibuka' : 'Ditutup'} />
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/concerts/${c.id}`}
                            className="px-2.5 py-1 rounded bg-[#2A1000] hover:bg-[#FF4D00] text-[11px] text-[#FF7A00] hover:text-[#09090B] font-medium transition-colors"
                          >
                            Detail
                          </Link>
                          <button
                            onClick={() => toggleConcertSales(c.id)}
                            type="button"
                            className="px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-[11px] text-[#FF7A00] font-medium transition-colors"
                          >
                            {c.salesOpen ? 'Tutup' : 'Buka'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* Important Notice */}
          <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
            <h2 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Penjualan yang perlu diperhatikan
            </h2>
            <div className="p-4 rounded-xl bg-[#27272A] border border-[#36202C] mb-3">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#36202C] text-[#FFA4B8] mb-1.5">
                HABIS TERJUAL
              </span>
              <div className="text-xs font-bold text-[#FFFFFF] mb-1">
                Coldplay: Music of the Spheres
              </div>
              <p className="text-xs text-[#A1A1AA]">
                5.000 tiket terjual. Penjualan sudah ditutup.
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF7A00] hover:text-[#FFD9BF]"
            >
              <span>Lihat pengaturan penjualan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Capacity Composition */}
          <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
            <h2 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Gambaran kapasitas
            </h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-[#FFFFFF]">{capacityPct}%</span>
              <span className="text-xs text-[#71717A]">dari kuota konser pilihan telah terjual</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#27272A] overflow-hidden mb-3">
              <div style={{ width: `${capacityPct}%` }} className="h-full bg-[#FF4D00] rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-[#A1A1AA]">
              <span>{totalSold.toLocaleString('id-ID')} tiket terjual</span>
              <span>{(totalQuota - totalSold).toLocaleString('id-ID')} tiket tersedia</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#71717A]">
            Daftar pilihan admin • Data contoh
          </div>
        </div>
      </div>

      {/* Add Concert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141417] border border-[#27272A] shadow-2xl p-6">
            <h2 className="text-base font-bold text-[#FFFFFF] mb-1">Tambah konser baru</h2>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Masukkan informasi konser untuk dimasukkan ke direktori pemantauan.
            </p>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Nama Konser</label>
                <input
                  type="text"
                  required
                  value={newConcertName}
                  onChange={(e) => setNewConcertName(e.target.value)}
                  placeholder="Contoh: Soundrenaline 2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Artis Utama</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Sheila on 7"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Jadwal</label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="Contoh: 15 November 2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Lokasi</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: GBK Madya, Jakarta"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Total Kuota Tiket</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F0F12] border border-[#27272A] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B]"
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
