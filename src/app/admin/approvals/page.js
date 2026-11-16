'use client';

import { useState } from 'react';
import { RotateCw, CheckCircle2, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminApprovalsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const approvals = useMonitoringStore((state) => state.approvals);
  const refreshMetrics = useMonitoringStore((state) => state.refreshMetrics);

  const [activeTab, setActiveTab] = useState('Menunggu');

  const publishedCount = concerts.filter((c) => c.salesOpen).length;

  const handleRefresh = () => {
    refreshMetrics();
    alert('Antrean pengajuan festival telah diperbarui.');
  };

  return (
    <WorkspaceLayout title="Persetujuan Festival">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Persetujuan festival</h1>
          <p className="text-xs text-[#A7AEC3]">
            Tinjau pengajuan organizer sebelum konser ditampilkan ke publik.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#1B1E2C] text-[#F4F5FA] text-xs font-semibold transition-all self-start md:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Muat ulang</span>
        </button>
      </div>

      {/* Status Queue Banner */}
      <div className="p-4 rounded-xl bg-[#151824] border border-[#193029] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#193029] text-[#8DE2BD] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-[#8DE2BD]">Semua beres. Tidak ada pengajuan tertunda.</div>
          <div className="text-xs text-[#A7AEC3]">Pengajuan baru dari organizer akan muncul di halaman ini.</div>
        </div>
      </div>

      {/* Main Content & Review Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals Queue */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10121C] border border-[#1B1E2C] mb-6 self-start inline-flex">
              {[
                { label: 'Menunggu', count: approvals.length },
                { label: 'Dipublikasikan', count: publishedCount },
                { label: 'Ditolak', count: 0 },
                { label: 'Semua', count: publishedCount }
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

            {/* Empty State Card matching Figma */}
            <div className="py-12 px-4 text-center rounded-xl bg-[#10121C] border border-[#1B1E2C]">
              <div className="w-12 h-12 rounded-2xl bg-[#151824] text-[#A78BFA] border border-[#2A2E40] flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#F4F5FA] mb-1">Belum ada festival yang perlu ditinjau</h3>
              <p className="text-xs text-[#A7AEC3] max-w-md mx-auto leading-relaxed mb-4">
                Saat organizer mengirim pengajuan baru, kamu bisa memeriksa detail dan memberikan persetujuan di sini.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('Dipublikasikan')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A78BFA] hover:text-[#DCD1FF]"
              >
                <span>Lihat seluruh pengajuan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-4 text-center text-[11px] text-[#7F89A0]">
            Keadaan kosong mengikuti referensi • Belum ada pengajuan menunggu
          </div>
        </div>

        {/* Review Guide Side Card */}
        <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-[#A7AEC3] uppercase tracking-wider mb-1">
              Sebelum menyetujui
            </h2>
            <p className="text-xs text-[#F4F5FA] font-semibold mb-3">
              Pastikan informasi berikut sudah lengkap.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="font-bold text-[#A78BFA] mb-0.5">01 Informasi konser</div>
                <div className="text-[#A7AEC3]">Judul, deskripsi, dan poster jelas.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="font-bold text-[#A78BFA] mb-0.5">02 Jadwal & lokasi</div>
                <div className="text-[#A7AEC3]">Tanggal dan tempat sesuai.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
                <div className="font-bold text-[#A78BFA] mb-0.5">03 Artis & penampil</div>
                <div className="text-[#A7AEC3]">Lineup dan kesiapan jadwal terkonfirmasi.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Submission Flow 3 Phases */}
      <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
        <h2 className="text-sm font-semibold text-[#F4F5FA] mb-4">Alur pengajuan yang transparan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
            <div className="text-xs font-bold text-[#A78BFA] mb-1">1. Diajukan organizer</div>
            <p className="text-xs text-[#A7AEC3] leading-relaxed">
              Organizer melengkapi detail konser dan mengirimkannya untuk ditinjau.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
            <div className="text-xs font-bold text-[#A78BFA] mb-1">2. Ditinjau admin</div>
            <p className="text-xs text-[#A7AEC3] leading-relaxed">
              Admin memeriksa kelengkapan data dan kesesuaian informasi konser.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40]">
            <div className="text-xs font-bold text-[#8DE2BD] mb-1">3. Keputusan diberikan</div>
            <p className="text-xs text-[#A7AEC3] leading-relaxed">
              Konser disetujui untuk dipublikasikan atau dikembalikan dengan alasan.
            </p>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
