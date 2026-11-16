'use client';

import { useState } from 'react';
import { QrCode, CheckCircle2, AlertCircle, Search, Users, ShieldCheck } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import useMonitoringStore from '@/stores/monitoringStore';

export default function OrganizerCheckinPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [checkedCount, setCheckedCount] = useState(1280);

  const handleScan = (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;

    setScannedResult({
      code: ticketCode.toUpperCase(),
      holder: 'Budi Santoso',
      concert: 'Java Jazz Festival 2026',
      category: 'Festival Standing (Gate A)',
      status: 'Valid / Siap Masuk',
      timestamp: new Date().toLocaleTimeString('id-ID')
    });
    setCheckedCount((prev) => prev + 1);
    setTicketCode('');
  };

  return (
    <WorkspaceLayout title="Check-in Tiket">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Check-in & Pemindaian Tiket</h1>
          <p className="text-xs text-[#A7AEC3]">
            Verifikasi tiket pengunjung di gerbang masuk konser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Penonton hadir" value={checkedCount.toLocaleString('id-ID')} subtext="Telah masuk gerbang" />
        <StatCard label="Total kuota festival" value="3.700" subtext="Java Jazz Festival 2026" />
        <StatCard label="Kecepatan verifikasi" value="~1.2 detik" subtext="Pemindaian QR instan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Form */}
        <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-5 h-5 text-[#A78BFA]" />
            <h2 className="text-sm font-semibold text-[#F4F5FA]">Pindai Kode QR atau Tiket</h2>
          </div>

          <form onSubmit={handleScan} className="space-y-3">
            <div>
              <label className="block text-[11px] text-[#A7AEC3] mb-1">
                Masukkan Kode Tiket / Scan Barcode
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder="Contoh: TKT-JJF-00123"
                  className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Verifikasi Masuk
            </button>
          </form>

          {scannedResult && (
            <div className="p-4 rounded-xl bg-[#193029] border border-[#8DE2BD]/30 space-y-2 mt-4 text-xs">
              <div className="flex items-center gap-2 text-[#8DE2BD] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tiket Valid - Silakan Masuk!</span>
              </div>
              <div className="space-y-1 text-[#F4F5FA] pt-1 border-t border-[#8DE2BD]/20">
                <div><span className="text-[#A7AEC3]">Kode:</span> {scannedResult.code}</div>
                <div><span className="text-[#A7AEC3]">Nama:</span> {scannedResult.holder}</div>
                <div><span className="text-[#A7AEC3]">Kategori:</span> {scannedResult.category}</div>
                <div><span className="text-[#A7AEC3]">Waktu:</span> {scannedResult.timestamp}</div>
              </div>
            </div>
          )}
        </div>

        {/* Live Gate Feed */}
        <div className="p-6 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <h2 className="text-sm font-semibold text-[#F4F5FA]">Aktivitas Gerbang Terbaru</h2>
          <div className="space-y-2 text-xs">
            {[
              { time: '14:22:10', code: 'TKT-9921', holder: 'Andi Wijaya', gate: 'Gate A - Regular' },
              { time: '14:21:45', code: 'TKT-8842', holder: 'Rina Kusuma', gate: 'Gate VIP - Priority' },
              { time: '14:20:12', code: 'TKT-7719', holder: 'Fajar Nugraha', gate: 'Gate B - Tribune' },
              { time: '14:18:50', code: 'TKT-6602', holder: 'Dewi Lestari', gate: 'Gate A - Regular' }
            ].map((feed, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#10121C] border border-[#1B1E2C] flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-[#F4F5FA]">{feed.holder} ({feed.code})</div>
                  <div className="text-[11px] text-[#7F89A0]">{feed.gate}</div>
                </div>
                <span className="text-[11px] font-bold text-[#8DE2BD]">{feed.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
