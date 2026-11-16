'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Calendar,
  ArrowRight,
  Check,
  AlertTriangle,
  ChevronDown,
  RotateCw
} from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function OrganizerDashboardPage() {
  const activeConcertId = useMonitoringStore((state) => state.activeConcertId);
  const setActiveConcert = useMonitoringStore((state) => state.setActiveConcert);
  const organizerMetrics = useMonitoringStore((state) => state.organizerMetrics);
  const concerts = useMonitoringStore((state) => state.concerts);
  const toggleConcertSales = useMonitoringStore((state) => state.toggleConcertSales);
  const fetchOrganizerData = useMonitoringStore((state) => state.fetchOrganizerData);

  const [concertDropdownOpen, setConcertDropdownOpen] = useState(false);
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

  const activeConcert = organizerMetrics?.concert || concerts[0] || {
    id: 'c1',
    name: 'Belum ada konser',
    schedule: '-',
    location: '-',
    sold: 0,
    quota: 0,
    salesOpen: false,
    categories: []
  };
  const isSalesOpen = activeConcert.salesOpen;

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

  const handleDownload = () => {
    alert('Laporan performa penjualan untuk "' + activeConcert.name + '" berhasil diunduh.');
  };

  const handleToggleSales = () => {
    toggleConcertSales(activeConcert.id);
  };

  return (
    <WorkspaceLayout title="Dashboard Organizer">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Panggungmu, dalam kendali.</h1>
            {isLive ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
                LIVE BACKEND
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2A2240] text-[#A78BFA] border border-[#362A54]">
                {isLoading ? 'MEMUAT...' : 'ORGANIZER WORKSPACE'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A7AEC3]">
            Pantau performa dan operasional konser buatanmu langsung dari database backend.
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
            onClick={handleDownload}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh laporan</span>
          </button>
        </div>
      </div>

      {/* Monitored Concert Banner */}
      <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider mb-1">
            KONSER YANG DIPANTAU
          </div>
          <div className="text-lg font-bold text-[#F4F5FA] mb-1">{activeConcert.name}</div>
          <div className="text-xs text-[#A7AEC3] flex flex-wrap items-center gap-2">
            <span>{activeConcert.schedule}</span>
            <span>•</span>
            <span>{activeConcert.location}</span>
            <span>•</span>
            <span className={isSalesOpen ? 'text-[#8DE2BD]' : 'text-[#FFA4B8]'}>
              ● {isSalesOpen ? 'Penjualan dibuka' : 'Penjualan ditutup'}
            </span>
          </div>
        </div>

        {/* Change Monitored Concert Dropdown */}
        <div className="relative">
          <button
            onClick={() => setConcertDropdownOpen(!concertDropdownOpen)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B1E2C] hover:bg-[#232638] border border-[#2A2E40] text-xs font-medium text-[#F4F5FA] transition-colors"
          >
            <span>Ganti konser</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7F89A0]" />
          </button>

          {concertDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#151824] border border-[#1B1E2C] shadow-2xl p-2 z-50">
              {concerts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConcert(c.id);
                    setConcertDropdownOpen(false);
                  }}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                    c.id === activeConcert.id
                      ? 'bg-[#2A2240] text-[#A78BFA] font-semibold'
                      : 'text-[#A7AEC3] hover:text-[#F4F5FA] hover:bg-[#1B1E2C]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {c.id === activeConcert.id && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Tiket terjual"
          value={organizerMetrics.tiketTerjual.value}
          subtext={`dari ${organizerMetrics.tiketTerjual.total} tiket • ${organizerMetrics.tiketTerjual.percentage}% kuota terisi`}
        />
        <StatCard
          label="Pendapatan tiket"
          value={organizerMetrics.pendapatanTiket.value}
          subtext={organizerMetrics.pendapatanTiket.label}
        />
        <StatCard
          label="Tiket tersedia"
          value={organizerMetrics.tiketTersedia.value}
          subtext={organizerMetrics.tiketTersedia.note}
        />
      </div>

      {/* Middle: Weekly Sales & Operational Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Tren penjualan tiket</h2>
              <p className="text-xs text-[#7F89A0]">Tiket terkonfirmasi per minggu</p>
            </div>
            <div className="text-xs text-[#A7AEC3] px-2.5 py-1 rounded bg-[#1B1E2C] border border-[#2A2E40]">
              April 2026
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-around gap-4 px-4">
              {organizerMetrics.weeklySales.map((w, idx) => {
                const heightPct = Math.round((w.sold / 800) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <span className="text-xs font-semibold text-[#F4F5FA]">{w.sold}</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] rounded-t-md bg-[#7953E8] group-hover:bg-[#A78BFA] transition-all"
                    />
                    <span className="text-[11px] text-[#7F89A0]">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operational Checklist */}
        <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F5FA] mb-1">Kesiapan konser</h2>
            <p className="text-xs text-[#7F89A0] mb-4">Selesaikan persiapan sebelum hari-H.</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="w-5 h-5 rounded-full bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs text-[#F4F5FA]">Detail konser dipublikasikan</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="w-5 h-5 rounded-full bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs text-[#F4F5FA]">4 kategori tiket tersedia</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="w-5 h-5 rounded-full bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs text-[#F4F5FA]">Artis dan jadwal ditetapkan</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1E2C] border border-[#332B1B]">
                <div className="w-5 h-5 rounded-full bg-[#332B1B] text-[#F1C875] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <span className="text-xs text-[#F4F5FA]">Pantau sisa kuota VIP</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1B1E2C] text-center text-[11px] text-[#7F89A0]">
            Java Festival Production • Hanya menampilkan konser milik organizer
          </div>
        </div>
      </div>

      {/* Bottom: Quota per Class & Sales Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quota per class table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Kuota per kelas tiket</h2>
              <p className="text-xs text-[#7F89A0]">Rincian alokasi dan penjualan kategori</p>
            </div>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1 text-xs text-[#A78BFA] hover:text-[#DCD1FF] font-medium"
            >
              <span>Kelola kategori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Kategori</th>
                  <th className="pb-2.5">Harga</th>
                  <th className="pb-2.5">Penjualan</th>
                  <th className="pb-2.5">Sisa</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {(activeConcert.categories || []).map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#1B1E2C]/50 transition-colors">
                    <td className="py-3 font-semibold text-[#F4F5FA]">{cat.name}</td>
                    <td className="py-3 text-[#A7AEC3]">Rp{cat.price.toLocaleString('id-ID')}</td>
                    <td className="py-3 font-medium text-[#F4F5FA]">
                      {cat.sold} / {cat.quota}
                    </td>
                    <td className="py-3 text-[#A7AEC3]">{cat.remaining} tersisa</td>
                    <td className="py-3">
                      <StatusBadge status={cat.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Control */}
        <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F5FA] mb-2">Kontrol penjualan</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isSalesOpen ? 'bg-[#8DE2BD]' : 'bg-[#FFA4B8]'}`} />
              <span className="text-xs font-semibold text-[#F4F5FA]">
                {isSalesOpen ? 'Penjualan dibuka' : 'Penjualan ditutup'}
              </span>
            </div>
            <p className="text-xs text-[#A7AEC3] leading-relaxed mb-4">
              {isSalesOpen
                ? 'Tiket dapat dibeli oleh pelanggan. Menutup penjualan akan menghentikan pemesanan baru untuk konser ini.'
                : 'Penjualan tiket saat ini ditutup. Membuka penjualan akan memungkinkan pesanan baru masuk kembali.'}
            </p>
          </div>

          <button
            onClick={handleToggleSales}
            type="button"
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
              isSalesOpen
                ? 'bg-[#36202C] hover:bg-[#4a2b3c] text-[#FFA4B8] border border-[#FFA4B8]/20'
                : 'bg-[#193029] hover:bg-[#25463b] text-[#8DE2BD] border border-[#8DE2BD]/20'
            }`}
          >
            {isSalesOpen ? 'Tutup penjualan tiket' : 'Buka penjualan tiket'}
          </button>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
