'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';

const initialPayments = [
  { id: 'PAY-001', order: 'ORD-001', customer: 'Budi Santoso', method: 'GoPay', amount: 700000, status: 'Terverifikasi', date: '2026-04-10' },
  { id: 'PAY-002', order: 'ORD-002', customer: 'Siti Rahma', method: 'Transfer Bank', amount: 1700000, status: 'Tertunda', date: '2026-04-11' },
  { id: 'PAY-003', order: 'ORD-003', customer: 'Ahmad Fauzi', method: 'OVO', amount: 1500000, status: 'Terverifikasi', date: '2026-04-12' },
  { id: 'PAY-004', order: 'ORD-004', customer: 'Dewi Lestari', method: 'DANA', amount: 500000, status: 'Gagal', date: '2026-04-13' },
  { id: 'PAY-005', order: 'ORD-005', customer: 'Rudi Hartono', method: 'Transfer Bank', amount: 400000, status: 'Tertunda', date: '2026-04-14' },
];

const statusVariant = {
  'Terverifikasi': 'success',
  'Tertunda': 'warning',
  'Gagal': 'error',
};

export default function PaymentManagement() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const filtered = payments.filter((p) =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.customer.toLowerCase().includes(search.toLowerCase()) ||
    p.order.toLowerCase().includes(search.toLowerCase())
  );

  const verifyPayment = (id) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: 'Terverifikasi' } : p));
    setToast({ show: true, message: 'Pembayaran berhasil diverifikasi', type: 'success' });
    setSelectedPayment(null);
  };

  const rejectPayment = (id) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: 'Gagal' } : p));
    setToast({ show: true, message: 'Pembayaran ditolak', type: 'error' });
    setSelectedPayment(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Pembayaran</h1>
        <p className="text-text-muted text-sm mt-1">Verifikasi dan kelola transaksi pembayaran</p>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cari pembayaran..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full max-w-xs bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada pembayaran" description="Coba pencarian lain." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID Pembayaran', 'Pesanan', 'Pelanggan', 'Metode', 'Jumlah', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="font-heading text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">{payment.id}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{payment.order}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{payment.customer}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{payment.method}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">Rp{payment.amount.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[payment.status] || 'default'}>{payment.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{payment.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedPayment(payment)} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-secondary-accent transition-colors cursor-pointer"><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Detail Pembayaran">
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[['ID Pembayaran', selectedPayment.id], ['ID Pesanan', selectedPayment.order], ['Pelanggan', selectedPayment.customer], ['Metode', selectedPayment.method], ['Jumlah', `Rp${selectedPayment.amount.toLocaleString('id-ID')}`], ['Status', selectedPayment.status], ['Tanggal', selectedPayment.date]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="text-sm text-text-primary font-medium">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-[12px] p-4 text-center">
              <p className="text-sm text-text-muted mb-2">Bukti Pembayaran</p>
              <div className="w-full h-40 bg-secondary-bg rounded-[12px] border border-border flex items-center justify-center text-text-muted text-sm">
                [Tempat Screenshot Pembayaran]
              </div>
            </div>

            {selectedPayment.status === 'Tertunda' && (
              <div className="flex gap-3">
                <Button variant="success" className="flex-1" onClick={() => verifyPayment(selectedPayment.id)}>
                  <CheckCircle size={16} /> Verifikasi
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => rejectPayment(selectedPayment.id)}>
                  <XCircle size={16} /> Tolak
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
