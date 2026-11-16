'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Calendar, ArrowRight, ShoppingBag } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminOrdersPage() {
  const orders = useMonitoringStore((state) => state.orders);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(orders[1] || orders[0] || null);
  const [dateRange, setDateRange] = useState('10–14 April 2026');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Pesanan tiket</h1>
          <p className="text-xs text-[#A7AEC3]">
            Telusuri pesanan dan pantau status transaksi pelanggan.
          </p>
        </div>

        <button
          onClick={handleExport}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor pesanan</span>
        </button>
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          {/* Tabs & Date filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10121C] border border-[#1B1E2C]">
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
                      ? 'bg-[#2A2240] text-[#A78BFA] font-semibold'
                      : 'text-[#A7AEC3] hover:text-[#F4F5FA]'
                  }`}
                >
                  {tab.label} <span className="opacity-70 ml-0.5">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A7AEC3] px-3 py-1.5 rounded-lg bg-[#1B1E2C] border border-[#2A2E40]">
              <Calendar className="w-3.5 h-3.5 text-[#7F89A0]" />
              <span>{dateRange}</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID pesanan, pelanggan, atau konser..."
              className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">ID Pesanan</th>
                  <th className="pb-2.5">Pelanggan</th>
                  <th className="pb-2.5">Konser</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`cursor-pointer transition-colors ${
                      selectedOrder?.id === ord.id ? 'bg-[#1B1E2C]' : 'hover:bg-[#1B1E2C]/50'
                    }`}
                  >
                    <td className="py-3 font-semibold text-[#F4F5FA]">{ord.id}</td>
                    <td className="py-3 text-[#A7AEC3]">{ord.customer}</td>
                    <td className="py-3 text-[#F4F5FA]">{ord.concert}</td>
                    <td className="py-3 font-medium text-[#F4F5FA]">{ord.total}</td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 text-[#7F89A0] whitespace-nowrap">{ord.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Summary Side Card */}
        <div className="space-y-6">
          {selectedOrder && (
            <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-[#F4F5FA]">{selectedOrder.id}</span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Pelanggan</span>
                  <span className="font-medium text-[#F4F5FA]">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Konser</span>
                  <span className="font-medium text-[#F4F5FA]">{selectedOrder.concert}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Total pembayaran</span>
                  <span className="font-bold text-[#A78BFA]">{selectedOrder.total}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Metode</span>
                  <span className="font-medium text-[#F4F5FA]">{selectedOrder.method || 'Transfer bank'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7F89A0]">Tanggal</span>
                  <span className="text-[#A7AEC3]">{selectedOrder.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1B1E2C] text-xs text-[#A7AEC3] mb-4 leading-relaxed">
                Menunggu verifikasi bukti pembayaran sebelum tiket diterbitkan.
              </div>

              <Link
                href="/admin/payments"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white transition-all shadow-md shadow-[#7953E8]/20"
              >
                <span>Buka pembayaran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="text-center text-[11px] text-[#7F89A0]">
            Daftar transaksi contoh • 10–14 April 2026
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
