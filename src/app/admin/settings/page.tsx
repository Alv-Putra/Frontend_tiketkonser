'use client';

import { useState } from 'react';
import { Info, Lock, Unlock, AlertCircle } from 'lucide-react';
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
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Pengaturan penjualan</h1>
          <p className="text-xs text-ink/60">
            Kontrol ketersediaan tiket dan status penjualan setiap konser.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-paper border border-ink/10 rounded-full px-3 py-2 text-xs font-medium text-ink focus:outline-none focus:border-blaze self-start md:self-auto"
        >
          <option value="Semua">Semua status penjualan</option>
          <option value="Dibuka">Penjualan dibuka</option>
          <option value="Ditutup">Penjualan ditutup</option>
        </select>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-xl bg-paper border border-ink/20 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-ink/5 text-blaze flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
          i
        </div>
        <p className="text-xs text-ink/60 leading-relaxed">
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
              className="p-5 rounded-2xl bg-white border border-ink/10 transition-colors hover:border-ink/20 space-y-4"
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ink/10">
                <div>
                  <h3 className="text-base font-bold text-ink">{c.name}</h3>
                  <div className="text-xs text-ink/60 mt-0.5">
                    {c.sold.toLocaleString('id-ID')} / {c.quota.toLocaleString('id-ID')} tiket terjual
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        c.salesOpen ? 'bg-status-success' : 'bg-status-danger'
                      }`}
                    />
                    <span className="text-xs font-semibold text-ink">
                      {c.salesOpen ? 'Penjualan dibuka' : 'Penjualan ditutup'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleConcertSales(c.id)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      c.salesOpen
                        ? 'bg-status-danger/25 hover:bg-status-danger/40 text-ink border border-status-danger/20'
                        : 'bg-status-success/25 hover:bg-status-success/40 text-ink border border-status-success/20'
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
                      className="p-3.5 rounded-2xl bg-paper border border-ink/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">{cat.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            isCatOut
                              ? 'bg-status-danger/25 text-ink'
                              : 'bg-status-success/25 text-ink'
                          }`}
                        >
                          {isCatOut ? 'Habis' : `${cat.remaining} tersisa`}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink/60">
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

      <div className="text-center text-[11px] text-ink/45 pt-2">
        Perubahan status penjualan berlaku untuk seluruh kategori dalam konser yang sama.
      </div>
    </>
  );
}
