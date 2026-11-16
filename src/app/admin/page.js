'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RotateCw
} from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminDashboardPage() {
  const adminMetrics = useMonitoringStore((state) => state.adminMetrics);
  const orders = useMonitoringStore((state) => state.orders);
  const concerts = useMonitoringStore((state) => state.concerts);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [period, setPeriod] = useState('1–30 April 2026');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchAdminData()
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
  }, [fetchAdminData]);

  const recentOrders = orders.slice(0, 5);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAdminData();
      setIsLive(true);
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    alert('Laporan platform ConserId (Periode: ' + period + ') berhasil diekspor.');
  };

  return (
    <WorkspaceLayout title="Dashboard">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Ringkasan platform</h1>
            {isLive ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
                LIVE BACKEND
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2A2240] text-[#A78BFA] border border-[#362A54]">
                {isLoading ? 'MEMUAT...' : 'DATA PLATFORM'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A7AEC3]">
            Selamat datang kembali. Ini performa ConserId hari ini langsung dari sistem.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#1B1E2C] text-[#F4F5FA] text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#A78BFA] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151824] border border-[#1B1E2C] text-xs font-medium text-[#F4F5FA] hover:bg-[#1B1E2C] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#7F89A0]" />
              <span>{period}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7F89A0]" />
            </button>
          </div>

          <button
            onClick={handleExport}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor laporan</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tiket terjual"
          value={adminMetrics.tiketTerjual.value}
          trendText={adminMetrics.tiketTerjual.change}
          trend={adminMetrics.tiketTerjual.trend}
          subtext={adminMetrics.tiketTerjual.period}
        />
        <StatCard
          label="Total pendapatan"
          value={adminMetrics.totalPendapatan.value}
          trendText={adminMetrics.totalPendapatan.change}
          trend={adminMetrics.totalPendapatan.trend}
          subtext={adminMetrics.totalPendapatan.period}
        />
        <StatCard
          label="Total pelanggan"
          value={adminMetrics.totalPelanggan.value}
          trendText={adminMetrics.totalPelanggan.change}
          trend={adminMetrics.totalPelanggan.trend}
          subtext={adminMetrics.totalPelanggan.period}
        />
        <StatCard
          label="Konser aktif"
          value={adminMetrics.konserAktif.value}
          trendText={adminMetrics.konserAktif.change}
          trend={adminMetrics.konserAktif.trend}
          subtext={adminMetrics.konserAktif.period}
        />
      </div>

      {/* Verification Notice Banner */}
      {adminMetrics.pendingPaymentsCount > 0 && (
        <div className="p-4 rounded-xl bg-[#151824] border border-[#332B1B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F1C875] shrink-0" />
            <div>
              <span className="text-xs font-semibold text-[#F4F5FA] mr-2">
                {adminMetrics.pendingPaymentsCount} pembayaran perlu diverifikasi
              </span>
              <span className="text-xs text-[#A7AEC3]">
                Periksa bukti pembayaran agar tiket dapat diterbitkan.
              </span>
            </div>
          </div>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F1C875] hover:text-[#F8DE9E] shrink-0"
          >
            <span>Tinjau pembayaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Middle Row: Ticket Sales Chart & Concert Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Sales Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Penjualan tiket</h2>
              <p className="text-xs text-[#7F89A0]">Tren tiket terjual selama April 2026</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A78BFA]">
              <span className="w-2 h-2 rounded-full bg-[#7953E8]" />
              <span>Tiket terjual</span>
            </div>
          </div>

          {/* Chart Graphic Bars */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {[
                { date: '01 Apr', height: '35%', count: '450' },
                { date: '05 Apr', height: '55%', count: '780' },
                { date: '08 Apr', height: '48%', count: '690' },
                { date: '12 Apr', height: '75%', count: '1.100' },
                { date: '15 Apr', height: '65%', count: '920' },
                { date: '19 Apr', height: '88%', count: '1.320' },
                { date: '22 Apr', height: '70%', count: '1.050' },
                { date: '26 Apr', height: '95%', count: '1.450' },
                { date: '29 Apr', height: '82%', count: '1.240' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B1E2C] border border-[#2A2E40] text-[10px] text-[#F4F5FA] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                    {bar.count} tiket
                  </div>
                  <div
                    style={{ height: bar.height }}
                    className="w-full max-w-[28px] rounded-t-md bg-[#7953E8] group-hover:bg-[#A78BFA] transition-all"
                  />
                  <span className="text-[10px] text-[#7F89A0]">{bar.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capacity Comparison */}
        <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[#F4F5FA]">Kapasitas konser</h2>
            <p className="text-xs text-[#7F89A0]">Terjual dibandingkan kuota tersedia</p>
          </div>

          <div className="space-y-4">
            {concerts.slice(0, 3).map((concert) => {
              const pct = Math.round((concert.sold / concert.quota) * 100);
              const isFull = pct >= 100;
              return (
                <div key={concert.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F4F5FA] truncate max-w-[170px]">
                      {concert.name}
                    </span>
                    <span className="font-semibold text-[#A78BFA]">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1B1E2C] overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-[#FFA4B8]' : 'bg-[#7953E8]'
                      }`}
                    />
                  </div>
                  <div className="text-[11px] text-[#7F89A0]">
                    {concert.sold.toLocaleString('id-ID')} / {concert.quota.toLocaleString('id-ID')} tiket
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#1B1E2C]">
            <Link
              href="/admin/concerts"
              className="inline-flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-[#DCD1FF] font-medium"
            >
              <span>Lihat seluruh konser</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Operational Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Pesanan terbaru</h2>
              <p className="text-xs text-[#7F89A0]">Daftar transaksi pelanggan terakhir</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs text-[#A78BFA] hover:text-[#DCD1FF] font-medium"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">ID Pesanan</th>
                  <th className="pb-2.5">Pelanggan</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#1B1E2C]/50 transition-colors">
                    <td className="py-3 font-semibold text-[#F4F5FA]">{ord.id}</td>
                    <td className="py-3 text-[#A7AEC3]">{ord.customer}</td>
                    <td className="py-3 text-[#F4F5FA]">{ord.concert}</td>
                    <td className="py-3 font-medium text-[#F4F5FA]">{ord.total}</td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Attention Cards */}
        <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F5FA] mb-1">Perlu perhatian</h2>
            <p className="text-xs text-[#7F89A0] mb-4">Aktivitas operasional yang memerlukan tindakan</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] flex items-start gap-3">
                <span className="text-lg font-bold text-[#F1C875]">
                  {String(adminMetrics.pendingPaymentsCount || 0).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#F4F5FA]">Pembayaran tertunda</div>
                  <div className="text-xs text-[#A7AEC3] mt-0.5">Verifikasi bukti transfer</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] flex items-start gap-3">
                <span className="text-lg font-bold text-[#FFA4B8]">
                  {String(adminMetrics.soldOutConcertsCount || 0).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#F4F5FA]">Konser habis terjual</div>
                  <div className="text-xs text-[#A7AEC3] mt-0.5">Kapasitas tiket telah tercapai</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] flex items-start gap-3">
                <span className="text-lg font-bold text-[#8DE2BD]">
                  {String(adminMetrics.pendingApprovalsCount || 0).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#F4F5FA]">Pengajuan festival</div>
                  <div className="text-xs text-[#A7AEC3] mt-0.5">
                    {adminMetrics.pendingApprovalsCount > 0
                      ? 'Menunggu peninjauan admin'
                      : 'Semua pengajuan sudah ditinjau'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1B1E2C] text-center text-[11px] text-[#7F89A0]">
            Ringkasan data operasional ConserId • Real-time backend sync
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
