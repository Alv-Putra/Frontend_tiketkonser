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
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
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
    <WorkspaceLayout title="Konser Saya">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Konser Saya</h1>
            {isLive ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
                LIVE BACKEND
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2A2240] text-[#A78BFA] border border-[#362A54]">
                {isLoading ? 'MEMUAT...' : 'DATABASE KONSER'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A7AEC3]">
            Kelola konser yang diselenggarakan beserta tiket dan penjualannya.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#1B1E2C] text-[#F4F5FA] text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#A78BFA] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all cursor-pointer"
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
      <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F5FA]">Daftar Konser & Panggung</h2>
            <p className="text-xs text-[#7F89A0]">Daftar pertunjukan langsung dalam monitoring organizer</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
            >
              <option value="Semua">Semua status</option>
              <option value="Dibuka">Penjualan Dibuka</option>
              <option value="Ditutup">Penjualan Ditutup</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari konser atau artis..."
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
                      <Link href={`/concerts/${c.id}`} className="hover:text-[#A78BFA] transition-colors">
                        <div>{c.name}</div>
                      </Link>
                      <div className="text-[11px] text-[#7F89A0]">{c.artist}</div>
                    </td>
                    <td className="py-3 text-[#A7AEC3] whitespace-nowrap">{c.schedule}</td>
                    <td className="py-3 text-[#A7AEC3]">{c.location}</td>
                    <td className="py-3 whitespace-nowrap">
                      <div className="font-semibold text-[#F4F5FA]">
                        {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-[#A78BFA]">{pct}% terisi</div>
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151824] border border-[#1B1E2C] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F4F5FA]">Buat Konser Baru</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#A7AEC3] mb-1">Nama Konser</label>
                <input
                  type="text"
                  required
                  value={newConcertName}
                  onChange={(e) => setNewConcertName(e.target.value)}
                  placeholder="Contoh: Java Jazz Festival 2027"
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A7AEC3] mb-1">Artis / Headliner</label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Contoh: Stevie Wonder"
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#A7AEC3] mb-1">Jadwal</label>
                  <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    placeholder="15 Mei 2027"
                    className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A7AEC3] mb-1">Kuota Tiket</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    placeholder="3000"
                    className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl px-3 py-2 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#10121C] text-xs font-semibold text-[#A7AEC3]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white"
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
