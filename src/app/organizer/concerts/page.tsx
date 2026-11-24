'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Download,
  ArrowRight,
  Music,
  Check,
  Calendar,
  MapPin,
  RotateCw
} from 'lucide-react';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';
import monitoringService from '@/services/monitoringService';

export default function OrganizerConcertsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const toggleConcertSales = useMonitoringStore((state) => state.toggleConcertSales);
  const addConcert = useMonitoringStore((state) => state.addConcert);
  const fetchOrganizerData = useMonitoringStore((state) => state.fetchOrganizerData);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConcertName, setNewConcertName] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newQuota, setNewQuota] = useState('2000');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchOrganizerData()
      .then(() => {
        if (mounted) setIsLive(true);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [fetchOrganizerData]);

  // Filter concerts
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

  const totalSold = concerts.reduce((acc, c) => acc + (c.sold || 0), 0);
  const totalQuota = concerts.reduce((acc, c) => acc + (c.quota || 0), 0);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchOrganizerData();
      setIsLive(true);
    } catch {
      // offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newConcertName.trim()) return;
    addConcert({
      name: newConcertName,
      artist: newArtist || 'Festival Artists',
      location: newLocation || 'JIExpo Kemayoran, Jakarta',
      schedule: newSchedule || '15–17 Mei 2026',
      quota: parseInt(newQuota, 10) || 2000,
      priceFrom: 'Rp350.000',
      organizer: 'Organizer',
      salesOpen: false
    });

    try {
      await monitoringService.createOrganizerEventApi({
        title: newConcertName,
        summary: newArtist || newConcertName,
        description: `Festival musik spektakuler ${newConcertName}`,
        start_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
      });
      await fetchOrganizerData();
    } catch {
      // Local addition remains intact
    }

    setNewConcertName('');
    setNewArtist('');
    setNewLocation('');
    setNewSchedule('');
    setIsAddModalOpen(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Konser Saya</h1>
            {isLive ? (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-status-success/25 text-ink border border-status-success/40">
                LIVE BACKEND
              </span>
            ) : (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-blaze/10 text-blaze border border-blaze/30">
                {isLoading ? 'MEMUAT...' : 'DATABASE KONSER'}
              </span>
            )}
          </div>
          <p className="text-xs text-ink/60">
            Kelola konser yang diselenggarakan beserta tiket dan penjualannya.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-paper hover:bg-white border border-ink/10 text-ink text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blaze ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blaze hover:bg-tangerine text-ink text-xs font-semibold shadow-lg shadow-blaze/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Konser Baru</span>
          </button>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total konser saya" value={concerts.length.toString()} subtext="Java Festival Production" />
        <StatCard label="Total tiket terjual" value={totalSold.toLocaleString('id-ID')} subtext={`Dari ${totalQuota.toLocaleString('id-ID')} kuota total`} />
        <StatCard label="Status operasional" value="Aktif" subtext="Semua panggung siap" />
      </div>

      {/* Table Section */}
      <div className="p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Daftar Konser & Panggung</h2>
            <p className="text-xs text-ink/45">Daftar pertunjukan langsung dalam monitoring organizer</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
            >
              <option value="Semua">Semua status</option>
              <option value="Dibuka">Penjualan Dibuka</option>
              <option value="Ditutup">Penjualan Ditutup</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari konser atau artis..."
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
              {filteredConcerts.map((c) => {
                const pct = Math.round((c.sold / c.quota) * 100);
                return (
                  <tr key={c.id} className="hover:bg-ink/[0.03] transition-colors">
                    <td className="py-3 font-medium text-ink">
                      <Link href={`/concerts/${c.id}`} className="hover:text-blaze transition-colors">
                        <div>{c.name}</div>
                      </Link>
                      <div className="text-[11px] text-ink/45">{c.artist}</div>
                    </td>
                    <td className="py-3 text-ink/60 whitespace-nowrap">{c.schedule}</td>
                    <td className="py-3 text-ink/60">{c.location}</td>
                    <td className="py-3 whitespace-nowrap">
                      <div className="font-semibold text-ink">
                        {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-blaze">{pct}% terisi</div>
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-ink/10 p-6 space-y-4">
            <h3 className="text-base font-bold text-ink">Buat Konser Baru</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] text-ink/60 mb-1">Nama Konser</label>
                <input
                  type="text"
                  required
                  value={newConcertName}
                  onChange={(e) => setNewConcertName(e.target.value)}
                  placeholder="Contoh: Java Jazz Festival 2027"
                  className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div>
                <label className="block text-[11px] text-ink/60 mb-1">Artis / Headliner</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Stevie Wonder"
                  className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-blaze"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-ink/60 mb-1">Jadwal</label>
                  <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    placeholder="15 Mei 2027"
                    className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-blaze"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink/60 mb-1">Kuota Tiket</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    placeholder="3000"
                    className="w-full bg-paper border border-ink/10 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:border-blaze"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-paper text-xs font-semibold text-ink/60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-blaze hover:bg-tangerine text-xs font-semibold text-ink"
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
