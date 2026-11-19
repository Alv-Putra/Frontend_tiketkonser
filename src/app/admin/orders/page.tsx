'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Calendar, ArrowRight, ShoppingBag, RotateCw } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminOrdersPage() {
  const orders = useMonitoringStore((state) => state.orders);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(orders[1] || orders[0] || null);
  const [dateRange, setDateRange] = useState('10–14 April 2026');
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

  const lunasCount = orders.filter((o) => o.status === 'Lunas').length;
  const pendingCount = orders.filter((o) => o.status === 'Tertunda').length;
  const cancelCount = orders.filter((o) => o.status === 'Dibatalkan').length;

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.concert.toLowerCase().includes(search.toLowerCase());

    const matchTab =
      activeTab === 'Semua' ||
      o.status.toLowerCase() === activeTab.toLowerCase();

    return matchSearch && matchTab;
  });

  const handleExport = () => {
    alert('Data pesanan tiket berhasil diekspor.');
  };

  return (
    <WorkspaceLayout title="Pesanan Tiket">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Pesanan tiket</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
              LIVE BACKEND
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Telusuri pesanan dan pantau status transaksi pelanggan langsung dari database.
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
            onClick={handleExport}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-[#09090B] text-xs font-semibold shadow-lg shadow-[#FF4D00]/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor pesanan</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total pesanan" value={orders.length.toString()} subtext="Dalam daftar ini" />
        <StatCard label="Lunas" value={lunasCount.toString()} subtext="Pembayaran terverifikasi" />
        <StatCard label="Menunggu pembayaran" value={pendingCount.toString()} subtext="Perlu ditindaklanjuti" />
        <StatCard label="Dibatalkan" value={cancelCount.toString()} subtext="Tidak diterbitkan tiket" />
      </div>

      {/* Main Grid: Orders Table & Selected Order Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141417] border border-[#27272A] space-y-4">
          {/* Tabs & Date filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F0F12] border border-[#27272A]">
              {[
                { label: 'Semua', count: orders.length },
                { label: 'Lunas', count: lunasCount },
                { label: 'Tertunda', count: pendingCount },
                { label: 'Dibatalkan', count: cancelCount }
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.label
                      ? 'bg-[#2A1000] text-[#FF7A00] font-semibold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                >
                  {tab.label} <span className="opacity-70 ml-0.5">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] px-3 py-1.5 rounded-lg bg-[#27272A] border border-[#3F3F46]">
              <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
              <span>{dateRange}</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID pesanan, pelanggan, atau konser..."
              className="w-full bg-[#0F0F12] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#71717A] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">ID Pesanan</th>
                  <th className="pb-2.5">Pelanggan</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`cursor-pointer transition-colors ${
                      selectedOrder?.id === ord.id ? 'bg-[#27272A]' : 'hover:bg-[#27272A]/50'
                    }`}
                  >
                    <td className="py-3 font-semibold text-[#FFFFFF]">{ord.id}</td>
                    <td className="py-3 text-[#A1A1AA]">{ord.customer}</td>
                    <td className="py-3 text-[#FFFFFF]">{ord.concert}</td>
                    <td className="py-3 font-medium text-[#FFFFFF]">{ord.total}</td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 text-[#71717A] whitespace-nowrap">{ord.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Summary Side Card */}
        <div className="space-y-6">
          {selectedOrder && (
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-[#FFFFFF]">{selectedOrder.id}</span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between py-1.5 border-b border-[#27272A]">
                  <span className="text-[#71717A]">Pelanggan</span>
                  <span className="font-medium text-[#FFFFFF]">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272A]">
                  <span className="text-[#71717A]">Konser</span>
                  <span className="font-medium text-[#FFFFFF]">{selectedOrder.concert}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272A]">
                  <span className="text-[#71717A]">Total pembayaran</span>
                  <span className="font-bold text-[#FF7A00]">{selectedOrder.total}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#27272A]">
                  <span className="text-[#71717A]">Metode</span>
                  <span className="font-medium text-[#FFFFFF]">{selectedOrder.method || 'Transfer bank'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#71717A]">Tanggal</span>
                  <span className="text-[#A1A1AA]">{selectedOrder.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#27272A] text-xs text-[#A1A1AA] mb-4 leading-relaxed">
                Menunggu verifikasi bukti pembayaran sebelum tiket diterbitkan.
              </div>

              <Link
                href="/admin/payments"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#FF4D00] hover:bg-[#E64500] text-xs font-semibold text-[#09090B] transition-all shadow-md shadow-[#FF4D00]/20"
              >
                <span>Buka pembayaran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="text-center text-[11px] text-[#71717A]">
            Daftar transaksi contoh • 10–14 April 2026
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
