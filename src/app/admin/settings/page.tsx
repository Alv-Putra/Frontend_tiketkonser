'use client';

import { useState } from 'react';
import { Info, Lock, Unlock, AlertCircle } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminSettingsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const toggleConcertSales = useMonitoringStore((state) => state.toggleConcertSales);

  const [statusFilter, setStatusFilter] = useState('Semua');

  const filteredConcerts = concerts.filter((c) => {
    if (statusFilter === 'Dibuka') return c.salesOpen;
    if (statusFilter === 'Ditutup') return !c.salesOpen;
    return true;
  });

  return (
    <WorkspaceLayout title="Pengaturan Penjualan">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Pengaturan penjualan</h1>
          <p className="text-xs text-[#A1A1AA]">
            Kontrol ketersediaan tiket dan status penjualan setiap konser.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#141417] border border-[#27272A] rounded-xl px-3 py-2 text-xs font-medium text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00] self-start md:self-auto"
        >
          <option value="Semua">Semua status penjualan</option>
          <option value="Dibuka">Penjualan dibuka</option>
          <option value="Ditutup">Penjualan ditutup</option>
        </select>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-xl bg-[#141417] border border-[#3F3F46] flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#27272A] text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
          i
        </div>
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          Menutup penjualan menghentikan pemesanan baru. Pesanan yang sudah dibuat tetap tersimpan.
        </p>
      </div>

      {/* Concert Sales Management Cards */}
      <div className="space-y-4">
        {filteredConcerts.map((c) => {
          const isFull = c.sold >= c.quota;
          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#141417] border border-[#27272A] hover:border-[#3F3F46] transition-colors space-y-4"
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
                <div>
                  <h3 className="text-base font-bold text-[#FFFFFF]">{c.name}</h3>
                  <div className="text-xs text-[#A1A1AA] mt-0.5">
                    {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')} tiket terjual
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        c.salesOpen ? 'bg-[#8DE2BD]' : 'bg-[#FFA4B8]'
                      }`}
                    />
                    <span className="text-xs font-semibold text-[#FFFFFF]">
                      {c.salesOpen ? 'Penjualan dibuka' : 'Penjualan ditutup'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleConcertSales(c.id)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      c.salesOpen
                        ? 'bg-[#36202C] hover:bg-[#4a2b3c] text-[#FFA4B8] border border-[#FFA4B8]/20'
                        : 'bg-[#193029] hover:bg-[#25463b] text-[#8DE2BD] border border-[#8DE2BD]/20'
                    }`}
                  >
                    {c.salesOpen ? 'Tutup penjualan' : 'Buka penjualan'}
                  </button>
                </div>
              </div>

              {/* Category Breakdown Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(c.categories || []).map((cat) => {
                  const isCatOut = cat.remaining <= 0;
                  return (
                    <div
                      key={cat.id}
                      className="p-3.5 rounded-xl bg-[#27272A] border border-[#3F3F46] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FFFFFF]">{cat.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            isCatOut
                              ? 'bg-[#36202C] text-[#FFA4B8]'
                              : 'bg-[#193029] text-[#8DE2BD]'
                          }`}
                        >
                          {isCatOut ? 'Habis' : `${cat.remaining} tersisa`}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A1A1AA]">
                        {cat.sold} terjual • {cat.quota} kuota
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-[#71717A] pt-2">
        Perubahan status penjualan berlaku untuk seluruh kategori dalam konser yang sama.
      </div>
    </WorkspaceLayout>
  );
}
