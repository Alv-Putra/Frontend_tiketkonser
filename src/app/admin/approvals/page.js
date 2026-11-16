'use client';

import { useState, useEffect } from 'react';
import { RotateCw, CheckCircle2, ShieldCheck, ArrowRight, FileText, Check, AlertCircle } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminApprovalsPage() {
  const concerts = useMonitoringStore((state) => state.concerts);
  const approvals = useMonitoringStore((state) => state.approvals);
  const adminMetrics = useMonitoringStore((state) => state.adminMetrics);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);
  const approveEvent = useMonitoringStore((state) => state.approveEvent);
  const refreshMetrics = useMonitoringStore((state) => state.refreshMetrics);

  const [activeTab, setActiveTab] = useState('Menunggu');
  const [approvingId, setApprovingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdminData().catch(() => {});
  }, [fetchAdminData]);

  const publishedCount = concerts.filter((c) => c.salesOpen).length;

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAdminData();
    } catch {
      refreshMetrics();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    setApprovingId(eventId);
    try {
      await approveEvent(eventId);
      alert('Event berhasil disetujui dan dipublikasikan!');
    } catch {
      alert('Gagal menyetujui event');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <WorkspaceLayout title="Persetujuan Festival">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Persetujuan festival</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
              ADMIN APPROVALS
            </span>
          </div>
          <p className="text-xs text-[#A7AEC3]">
            Tinjau pengajuan organizer sebelum konser ditampilkan ke publik.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#1B1E2C] text-[#F4F5FA] text-xs font-semibold transition-all self-start md:self-auto cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#A78BFA] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Muat ulang</span>
        </button>
      </div>

      {/* Status Queue Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0)
          ? 'bg-[#2A2215] border-[#4A3B1B]'
          : 'bg-[#151824] border-[#193029]'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0)
            ? 'bg-[#3D2E17] text-[#F1C875]'
            : 'bg-[#193029] text-[#8DE2BD]'
        }`}>
          {approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0) ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className={`text-xs font-semibold ${
            approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0)
              ? 'text-[#F1C875]'
              : 'text-[#8DE2BD]'
          }`}>
            {approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0)
              ? `${approvals.length || adminMetrics.pendingApprovalsCount} festival menunggu persetujuan admin`
              : 'Semua beres. Tidak ada pengajuan tertunda.'}
          </div>
          <div className="text-xs text-[#A7AEC3]">
            {approvals.length > 0 || (adminMetrics.pendingApprovalsCount > 0)
              ? 'Tinjau informasi di bawah untuk menyetujui publikasi konser.'
              : 'Pengajuan baru dari organizer akan muncul di halaman ini.'}
          </div>
        </div>
      </div>

      {/* Main Content & Review Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals Queue */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#10121C] border border-[#1B1E2C] mb-6 self-start inline-flex">
              {[
                { label: 'Menunggu', count: approvals.length || adminMetrics.pendingApprovalsCount || 0 },
                { label: 'Dipublikasikan', count: publishedCount },
                { label: 'Ditolak', count: 0 },
                { label: 'Semua', count: (approvals.length || adminMetrics.pendingApprovalsCount || 0) + publishedCount }
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.label
                      ? 'bg-[#2A2240] text-[#A78BFA] font-semibold'
                      : 'text-[#A7AEC3] hover:text-[#F4F5FA]'
                  }`}
                >
                  {tab.label} <span className="opacity-70 ml-0.5">{tab.count}</span>
                </button>
              ))}
            </div>

            {activeTab === 'Menunggu' && approvals.length > 0 ? (
              <div className="space-y-3">
                {approvals.map((appr) => (
                  <div key={appr.id} className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-[#F4F5FA]">{appr.name || appr.title}</div>
                      <div className="text-xs text-[#A7AEC3] mt-0.5">
                        {appr.organizer || 'Organizer'} • {appr.location || 'Venue'}
                      </div>
                      <div className="text-[11px] text-[#7F89A0] mt-1">
                        Diajukan: {appr.date || 'Hari ini'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleApprove(appr.id)}
                        disabled={approvingId === appr.id}
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-[#193029] hover:bg-[#234B3E] border border-[#2E5C4E] text-xs font-semibold text-[#8DE2BD] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{approvingId === appr.id ? 'Memproses...' : 'Setujui Festival'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'Dipublikasikan' ? (
              <div className="space-y-3">
                {(concerts || []).filter((c) => c.salesOpen).map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-[#F4F5FA]">{c.name}</div>
                      <div className="text-xs text-[#A7AEC3] mt-0.5">{c.artist} • {c.location}</div>
                      <div className="text-[11px] text-[#7F89A0] mt-1">{c.schedule}</div>
                    </div>
                    <StatusBadge status="Dibuka" />
                  </div>
                ))}
              </div>
            ) : (
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
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A78BFA] hover:text-[#DCD1FF] cursor-pointer"
                >
                  <span>Lihat seluruh konser dipublikasikan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
