'use client';

import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

const initialOrders = [
  { id: 'ORD-001', customer: 'Budi Santoso', email: 'budi@email.com', event: 'Java Jazz 2026', class: 'Festival', qty: 2, amount: 700000, status: 'Lunas', date: '2026-04-10' },
  { id: 'ORD-002', customer: 'Siti Rahma', email: 'siti@email.com', event: 'Coldplay Tour', class: 'VIP', qty: 1, amount: 1700000, status: 'Tertunda', date: '2026-04-11' },
  { id: 'ORD-003', customer: 'Ahmad Fauzi', email: 'ahmad@email.com', event: 'Dewa 19 Reunion', class: 'Reguler', qty: 3, amount: 1500000, status: 'Lunas', date: '2026-04-12' },
  { id: 'ORD-004', customer: 'Dewi Lestari', email: 'dewi@email.com', event: 'Festival Musik 2026', class: 'Festival', qty: 2, amount: 500000, status: 'Dibatalkan', date: '2026-04-13' },
  { id: 'ORD-005', customer: 'Rudi Hartono', email: 'rudi@email.com', event: 'Rich Brian Tour', class: 'Reguler', qty: 1, amount: 400000, status: 'Tertunda', date: '2026-04-14' },
];

const statusOptions = ['Semua', 'Lunas', 'Tertunda', 'Dibatalkan'];

const statusVariant = {
  'Lunas': 'success',
  'Tertunda': 'warning',
  'Dibatalkan': 'error',
};

export default function OrderManagement() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.event.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Pesanan</h1>
        <p className="text-text-muted text-sm mt-1">Lihat semua pesanan tiket</p>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Cari ID, pelanggan, atau event..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-[12px] text-xs font-medium transition-colors cursor-pointer ${statusFilter === s ? 'bg-primary-accent/10 text-primary-accent border border-primary-accent/20' : 'bg-surface text-text-secondary hover:text-text-primary border border-border'}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada pesanan" description="Coba sesuaikan pencarian atau filter Anda." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID Pesanan', 'Pelanggan', 'Event', 'Jumlah', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{order.event}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">Rp{order.amount.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[order.status] || 'default'}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{order.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-secondary-accent transition-colors cursor-pointer"><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detail Pesanan">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['ID Pesanan', selectedOrder.id], ['Pelanggan', selectedOrder.customer], ['Email', selectedOrder.email], ['Event', selectedOrder.event], ['Kelas', selectedOrder.class], ['Jml Tiket', selectedOrder.qty], ['Total', `Rp${selectedOrder.amount.toLocaleString('id-ID')}`], ['Status', selectedOrder.status], ['Tanggal', selectedOrder.date]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="text-sm text-text-primary font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
