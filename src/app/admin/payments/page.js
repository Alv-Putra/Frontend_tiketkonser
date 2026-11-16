'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Check, X, ShieldAlert, ArrowRight, RotateCw } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminPaymentsPage() {
  const payments = useMonitoringStore((state) => state.payments);
  const verifyPayment = useMonitoringStore((state) => state.verifyPayment);
  const fetchAdminData = useMonitoringStore((state) => state.fetchAdminData);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedPayment, setSelectedPayment] = useState(
    payments.find((p) => p.status === 'Perlu verifikasi') || payments[0] || null
  );
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

  const verifiedCount = payments.filter((p) => p.status === 'Terverifikasi').length;
  const pendingCount = payments.filter((p) => p.status === 'Perlu verifikasi').length;
  const failedCount = payments.filter((p) => p.status === 'Gagal').length;

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      !search ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'Semua' ||
      p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const handleApprove = () => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.id, true);
    setSelectedPayment({
      ...selectedPayment,
      status: 'Terverifikasi'
    });
  };

  const handleReject = () => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.id, false);
    setSelectedPayment({
      ...selectedPayment,
      status: 'Gagal'
    });
  };

  const handleExport = () => {
    alert('Daftar transaksi pembayaran berhasil diekspor.');
  };

  return (
    <WorkspaceLayout title="Pembayaran">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Pembayaran</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
              LIVE BACKEND
            </span>
          </div>
          <p className="text-xs text-[#A7AEC3]">
            Periksa transaksi dan verifikasi pembayaran pelanggan langsung dari database.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1B1E2C] hover:bg-[#2A2E40] text-[#A7AEC3] hover:text-[#F4F5FA] text-xs font-semibold border border-[#2A2E40] transition-all cursor-pointer"
            title="Muat ulang data live backend"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#A78BFA]' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={handleExport}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#7953E8] hover:bg-[#673EE0] text-white text-xs font-semibold shadow-lg shadow-[#7953E8]/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor transaksi</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total transaksi" value={payments.length.toString()} subtext="Rp4.800.000" />
        <StatCard label="Terverifikasi" value={verifiedCount.toString()} subtext="Rp2.200.000" />
        <StatCard label="Perlu verifikasi" value={pendingCount.toString()} subtext="Rp2.100.000" />
        <StatCard label="Gagal" value={failedCount.toString()} subtext="Rp500.000" />
      </div>

      {/* Main Grid: Payments Table & Verification Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#F4F5FA]">Daftar transaksi</h2>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#332B1B] text-[#F1C875]">
                  {pendingCount} perlu verifikasi
                </span>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
            >
              <option value="Semua">Semua status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Perlu verifikasi">Perlu verifikasi</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID transaksi atau pelanggan..."
              className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Transaksi</th>
                  <th className="pb-2.5">Pelanggan / Metode</th>
                  <th className="pb-2.5">Jumlah</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1E2C]">
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className={`cursor-pointer transition-colors ${
                      selectedPayment?.id === p.id ? 'bg-[#1B1E2C]' : 'hover:bg-[#1B1E2C]/50'
                    }`}
                  >
                    <td className="py-3 font-semibold text-[#F4F5FA]">
                      <div>{p.id}</div>
                      <div className="text-[10px] text-[#7F89A0]">{p.orderId}</div>
                    </td>
                    <td className="py-3 text-[#A7AEC3]">
                      <div className="text-[#F4F5FA] font-medium">{p.customer}</div>
                      <div className="text-[11px] text-[#7F89A0]">{p.method}</div>
                    </td>
                    <td className="py-3 font-bold text-[#F4F5FA]">{p.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(p);
                        }}
                        type="button"
                        className="px-2.5 py-1 rounded bg-[#1B1E2C] hover:bg-[#2A2E40] border border-[#2A2E40] text-[11px] text-[#A78BFA] font-medium transition-colors"
                      >
                        Periksa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Side Card */}
        <div className="space-y-6">
          {selectedPayment && (
            <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
              <div className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider mb-2">
                Verifikasi pembayaran
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#F4F5FA]">
                  {selectedPayment.id} / {selectedPayment.orderId}
                </span>
                <StatusBadge status={selectedPayment.status} />
              </div>

              <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Total pembayaran</span>
                  <span className="font-bold text-base text-[#F4F5FA]">{selectedPayment.amount}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Pelanggan</span>
                  <span className="font-medium text-[#F4F5FA]">{selectedPayment.customer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B1E2C]">
                  <span className="text-[#7F89A0]">Metode</span>
                  <span className="font-medium text-[#F4F5FA]">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7F89A0]">Tanggal</span>
                  <span className="text-[#A7AEC3]">{selectedPayment.date}</span>
                </div>
              </div>

              {selectedPayment.status === 'Perlu verifikasi' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleApprove}
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#193029] hover:bg-[#25463b] text-[#8DE2BD] border border-[#8DE2BD]/20 text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                  <button
                    onClick={handleReject}
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#36202C] hover:bg-[#4a2b3c] text-[#FFA4B8] border border-[#FFA4B8]/20 text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#1B1E2C] text-center text-xs text-[#A7AEC3]">
                  Status pembayaran telah ditetapkan ({selectedPayment.status})
                </div>
              )}
            </div>
          )}

          {/* Verification Workflow Steps */}
          <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
            <h2 className="text-xs font-semibold text-[#A7AEC3] uppercase tracking-wider mb-2">
              Alur verifikasi
            </h2>
            <p className="text-xs text-[#F4F5FA] font-medium mb-3">
              Verifikasi yang teliti, pengalaman yang aman.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#1B1E2C] text-[#F4F5FA]">
                <span className="font-bold text-[#A78BFA] mr-2">01</span> Periksa bukti transfer
              </div>
              <div className="p-2.5 rounded bg-[#1B1E2C] text-[#F4F5FA]">
                <span className="font-bold text-[#A78BFA] mr-2">02</span> Cocokkan nominal
              </div>
              <div className="p-2.5 rounded bg-[#1B1E2C] text-[#F4F5FA]">
                <span className="font-bold text-[#A78BFA] mr-2">03</span> Setujui atau tolak
              </div>
            </div>
            <p className="text-[11px] text-[#7F89A0] mt-3">
              Status pembayaran dan pesanan harus selalu konsisten.
            </p>
          </div>

          <div className="text-center text-[11px] text-[#7F89A0]">
            Data dan lampiran contoh • Bukan transaksi nyata
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
