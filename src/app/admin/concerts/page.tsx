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
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';
import { closeOnBackdrop } from '@/lib/backdrop';

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
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Kelola konser</h1>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-status-success/25 text-ink border border-status-success/40">
              LIVE BACKEND
            </span>
          </div>
          <p className="text-xs text-ink/60">
            Atur informasi konser, jadwal, dan pantau ketersediaan tiket langsung dari database.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-paper hover:bg-white text-ink/60 hover:text-ink text-xs font-semibold border border-ink/20 transition-all cursor-pointer"
            title="Muat ulang data live backend"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blaze' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blaze hover:bg-tangerine text-ink text-xs font-semibold shadow-lg shadow-blaze/20 transition-all cursor-pointer"
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Daftar konser</h2>
              <p className="text-xs text-ink/45">Pilihan admin</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
              >
                <option value="Semua">Semua status</option>
                <option value="Dibuka">Dibuka</option>
                <option value="Ditutup">Ditutup</option>
              </select>

              <button
                onClick={handleExport}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper hover:bg-white border border-ink/10 text-xs font-medium text-ink/60 hover:text-ink transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor daftar</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul konser atau artis..."
              className="w-full bg-paper border border-ink/10 rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink/45 focus:outline-none focus:border-blaze"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/45 text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Jadwal</th>
                  <th className="pb-2.5">Lokasi</th>
                  <th className="pb-2.5">Penjualan</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredConcerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-ink/45">
                      Belum ada konser yang terdaftar. Klik tombol &quot;Tambah konser&quot; di atas untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  filteredConcerts.map((c) => {
                  const pct = Math.round((c.sold / c.quota) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-ink/[0.03] transition-colors">
                      <td className="py-3 font-medium text-ink">
                        <Link href={`/concerts/${c.id}`} className="hover:text-blaze transition-colors font-semibold">
                          {c.name}
                        </Link>
                        <div className="text-[11px] text-ink/45">{c.artist}</div>
                      </td>
                      <td className="py-3 text-ink/60 whitespace-nowrap">{c.schedule}</td>
                      <td className="py-3 text-ink/60">{c.location}</td>
                      <td className="py-3 whitespace-nowrap">
                        <div className="font-semibold text-ink">
                          {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-blaze">{pct}% terjual</div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={c.salesOpen ? 'Dibuka' : 'Ditutup'} />
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/concerts/${c.id}`}
                            className="px-2.5 py-1 rounded-full bg-blaze/10 hover:bg-blaze text-[11px] text-blaze hover:text-ink font-medium transition-colors"
                          >
                            Detail
                          </Link>
                          <button
                            onClick={() => toggleConcertSales(c.id)}
                            type="button"
                            className="px-2.5 py-1 rounded-full bg-ink/5 hover:bg-border-hover border border-ink/20 text-[11px] text-blaze font-medium transition-colors"
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
          <div className="p-5 rounded-2xl bg-white border border-ink/10">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blaze mb-2">
              Penjualan yang perlu diperhatikan
            </h2>
            <div className="p-4 rounded-xl bg-ink/5 border border-transparent mb-3">
              <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold bg-status-danger/25 text-ink mb-1.5">
                HABIS TERJUAL
              </span>
              <div className="text-xs font-bold text-ink mb-1">
                Coldplay: Music of the Spheres
              </div>
              <p className="text-xs text-ink/60">
                5.000 tiket terjual. Penjualan sudah ditutup.
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blaze hover:text-brand-violet-light"
            >
              <span>Lihat pengaturan penjualan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Capacity Composition */}
          <div className="p-5 rounded-2xl bg-white border border-ink/10">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blaze mb-2">
              Gambaran kapasitas
            </h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-ink">{capacityPct}%</span>
              <span className="text-xs text-ink/45">dari kuota konser pilihan telah terjual</span>
            </div>
            <div className="w-full h-2 rounded-full bg-ink/5 overflow-hidden mb-3">
              <div style={{ width: `${capacityPct}%` }} className="h-full bg-blaze rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-ink/60">
              <span>{totalSold.toLocaleString('id-ID')} tiket terjual</span>
              <span>{(totalQuota - totalSold).toLocaleString('id-ID')} tiket tersedia</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-ink/45">
            Daftar pilihan admin • Data contoh
          </div>
        </div>
      </div>

      {/* Add Concert Modal */}
      {isAddModalOpen && (
        <div {...closeOnBackdrop(() => setIsAddModalOpen(false))} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-ink/10 p-6">
            <h2 className="font-display text-base font-bold text-ink mb-1">Tambah konser baru</h2>
            <p className="text-xs text-ink/60 mb-4">
              Masukkan informasi konser untuk dimasukkan ke direktori pemantauan.
            </p>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Nama Konser</label>
                <input
                  type="text"
                  required
                  value={newConcertName}
                  onChange={(e) => setNewConcertName(e.target.value)}
                  placeholder="Contoh: Soundrenaline 2026"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Artis Utama</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Sheila on 7"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Jadwal</label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="Contoh: 15 November 2026"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: GBK Madya, Jakarta"
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Total Kuota Tiket</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-ink/60 hover:text-ink"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-blaze hover:bg-tangerine text-xs font-semibold text-ink"
                >
                  Simpan Konser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
