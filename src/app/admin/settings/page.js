'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Unlock, Lock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';

const initialEvents = [
  { id: 1, name: 'Java Jazz Festival 2026', salesOpen: true, quota: 3700, sold: 2350, classes: [
    { name: 'VIP', quota: 200, sold: 150 },
    { name: 'Kategori 1', quota: 500, sold: 400 },
    { name: 'Kategori 2', quota: 1000, sold: 600 },
    { name: 'Festival', quota: 2000, sold: 1200 },
  ]},
  { id: 2, name: 'Coldplay: Music of the Spheres', salesOpen: false, quota: 5000, sold: 5000, classes: [
    { name: 'VIP', quota: 500, sold: 500 },
    { name: 'Reguler', quota: 4500, sold: 4500 },
  ]},
  { id: 3, name: 'Dewa 19 Reunion Tour', salesOpen: true, quota: 3000, sold: 1800, classes: [
    { name: 'VIP', quota: 500, sold: 350 },
    { name: 'Reguler', quota: 2500, sold: 1450 },
  ]},
];

export default function Settings() {
  const [events, setEvents] = useState(initialEvents);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const toggleSales = (id) => {
    setEvents(events.map((e) => e.id === id ? { ...e, salesOpen: !e.salesOpen } : e));
    const event = events.find((e) => e.id === id);
    setToast({ show: true, message: `Penjualan "${event.name}" berhasil ${event.salesOpen ? 'ditutup' : 'dibuka'}`, type: 'success' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Pengaturan</h1>
        <p className="text-text-muted text-sm mt-1">Kelola kuota tiket dan status penjualan</p>
      </div>

      <div className="space-y-5">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-bg border border-border rounded-[18px] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{event.name}</h3>
                <p className="text-sm text-text-muted">
                  {event.sold.toLocaleString('id-ID')} / {event.quota.toLocaleString('id-ID')} tiket terjual
                </p>
              </div>
              <button
                onClick={() => toggleSales(event.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm font-medium transition-all cursor-pointer ${
                  event.salesOpen
                    ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
                    : 'bg-error/10 text-error border border-error/20 hover:bg-error/20'
                }`}
              >
                {event.salesOpen ? <Unlock size={14} /> : <Lock size={14} />}
                {event.salesOpen ? 'Penjualan Dibuka' : 'Penjualan Ditutup'}
              </button>
            </div>

            <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min((event.sold / event.quota) * 100, 100)}%` }}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-3">Kelas Tiket</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {event.classes.map((cls) => (
                  <div key={cls.name} className="bg-surface rounded-[12px] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">{cls.name}</span>
                      <Badge variant={cls.quota - cls.sold > 0 ? 'available' : 'sold'}>
                        {cls.quota - cls.sold > 0 ? `${(cls.quota - cls.sold).toLocaleString('id-ID')} tersisa` : 'Habis'}
                      </Badge>
                    </div>
                    <div className="w-full h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cls.quota - cls.sold > 0 ? 'bg-secondary-accent' : 'bg-error'}`}
                        style={{ width: `${(cls.sold / cls.quota) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-text-muted mt-2">
                      <span>{cls.sold.toLocaleString('id-ID')} terjual</span>
                      <span>{cls.quota.toLocaleString('id-ID')} kuota</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
