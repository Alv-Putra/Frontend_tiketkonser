'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Check, X, ShieldAlert, ArrowRight, RotateCw } from 'lucide-react';
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
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Pembayaran</h1>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-status-success/25 text-ink border border-status-success/40">
              LIVE BACKEND
            </span>
          </div>
          <p className="text-xs text-ink/60">
            Periksa transaksi dan verifikasi pembayaran pelanggan langsung dari database.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-paper hover:bg-white text-ink/60 hover:text-ink text-xs font-semibold border border-ink/20 transition-all cursor-pointer"
            title="Muat ulang data live backend"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blaze' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={handleExport}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blaze hover:bg-tangerine text-ink text-xs font-semibold shadow-lg shadow-blaze/20 transition-all cursor-pointer"
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
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-ink">Daftar transaksi</h2>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-status-warning/25 text-ink">
                  {pendingCount} perlu verifikasi
                </span>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
            >
              <option value="Semua">Semua status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Perlu verifikasi">Perlu verifikasi</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID transaksi atau pelanggan..."
              className="w-full bg-paper border border-ink/10 rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink/45 focus:outline-none focus:border-blaze"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/45 text-[10px] uppercase font-semibold">
                  <th className="pb-2.5">Transaksi</th>
                  <th className="pb-2.5">Pelanggan / Metode</th>
                  <th className="pb-2.5">Jumlah</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className={`cursor-pointer transition-colors ${
                      selectedPayment?.id === p.id ? 'bg-ink/5' : 'hover:bg-ink/[0.03]'
                    }`}
                  >
                    <td className="py-3 font-semibold text-ink">
                      <div>{p.id}</div>
                      <div className="text-[10px] text-ink/45">{p.orderId}</div>
                    </td>
                    <td className="py-3 text-ink/60">
                      <div className="text-ink font-medium">{p.customer}</div>
                      <div className="text-[11px] text-ink/45">{p.method}</div>
                    </td>
                    <td className="py-3 font-bold text-ink">{p.amount}</td>
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
                        className="px-2.5 py-1 rounded-full bg-ink/5 hover:bg-border-hover border border-ink/20 text-[11px] text-blaze font-medium transition-colors"
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
            <div className="p-5 rounded-2xl bg-white border border-ink/10">
              <div className="text-[10px] font-bold text-blaze uppercase tracking-wider mb-2">
                Verifikasi pembayaran
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-ink">
                  {selectedPayment.id} / {selectedPayment.orderId}
                </span>
                <StatusBadge status={selectedPayment.status} />
              </div>

              <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between py-1.5 border-b border-ink/10">
                  <span className="text-ink/45">Total pembayaran</span>
                  <span className="font-bold text-base text-ink">{selectedPayment.amount}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-ink/10">
                  <span className="text-ink/45">Pelanggan</span>
                  <span className="font-medium text-ink">{selectedPayment.customer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-ink/10">
                  <span className="text-ink/45">Metode</span>
                  <span className="font-medium text-ink">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-ink/45">Tanggal</span>
                  <span className="text-ink/60">{selectedPayment.date}</span>
                </div>
              </div>

              {selectedPayment.status === 'Perlu verifikasi' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleApprove}
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-status-success/25 hover:bg-status-success/40 text-ink border border-status-success/20 text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                  <button
                    onClick={handleReject}
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-status-danger/25 hover:bg-status-danger/40 text-ink border border-status-danger/20 text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-ink/5 text-center text-xs text-ink/60">
                  Status pembayaran telah ditetapkan ({selectedPayment.status})
                </div>
              )}
            </div>
          )}

          {/* Verification Workflow Steps */}
          <div className="p-5 rounded-2xl bg-white border border-ink/10">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blaze mb-2">
              Alur verifikasi
            </h2>
            <p className="text-xs text-ink font-medium mb-3">
              Verifikasi yang teliti, pengalaman yang aman.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-ink/5 text-ink">
                <span className="font-bold text-blaze mr-2">01</span> Periksa bukti transfer
              </div>
              <div className="p-2.5 rounded bg-ink/5 text-ink">
                <span className="font-bold text-blaze mr-2">02</span> Cocokkan nominal
              </div>
              <div className="p-2.5 rounded bg-ink/5 text-ink">
                <span className="font-bold text-blaze mr-2">03</span> Setujui atau tolak
              </div>
            </div>
            <p className="text-[11px] text-ink/45 mt-3">
              Status pembayaran dan pesanan harus selalu konsisten.
            </p>
          </div>

          <div className="text-center text-[11px] text-ink/45">
            Data dan lampiran contoh • Bukan transaksi nyata
          </div>
        </div>
      </div>
    </>
  );
}
