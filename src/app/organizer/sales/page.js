'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import useMonitoringStore from '@/stores/monitoringStore';

export default function OrganizerSalesPage() {
  const organizerMetrics = useMonitoringStore((state) => state.organizerMetrics);
  const concerts = useMonitoringStore((state) => state.concerts);

  const handleDownload = () => {
    alert('Laporan rincian penjualan tiket berhasil diunduh.');
  };

  return (
    <WorkspaceLayout title="Laporan Penjualan">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Laporan Penjualan Tiket</h1>
          <p className="text-xs text-[#A7AEC3]">
            Rincian pendapatan kotor, tiket terbayar, dan performa per kategori konser.
          </p>
        </div>

        <button
          onClick={handleDownload}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all self-start md:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor CSV / Excel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total tiket terjual" value={organizerMetrics.tiketTerjual.value} subtext="Dari seluruh kategori tiket" />
        <StatCard label="Total pendapatan bersih" value={organizerMetrics.pendapatanTiket.value} subtext="Dana telah diproses ke rekening" />
        <StatCard label="Tingkat okupansi" value={`${organizerMetrics.tiketTerjual.percentage}%`} subtext="Kapasitas venue terisi" />
      </div>

      <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
        <h2 className="text-sm font-semibold text-[#F4F5FA]">Rincian Penjualan Mingguan</h2>
        <div className="h-44 flex items-end justify-around gap-4 px-4 pt-6 pb-2">
          {organizerMetrics.weeklySales.map((w, idx) => {
            const heightPct = Math.round((w.sold / 800) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[#F4F5FA]">{w.sold}</span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[48px] rounded-t-md bg-[#7953E8]"
                />
                <span className="text-[11px] text-[#7F89A0]">{w.week}</span>
              </div>
            );
          })}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
