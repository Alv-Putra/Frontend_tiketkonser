'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, DollarSign, TrendingUp, Calendar, Music, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const stats = [
  { icon: Ticket, label: 'Tiket Terjual', value: '12.450', change: 12.5, color: 'primary-accent' },
  { icon: DollarSign, label: 'Total Pendapatan', value: 'Rp 8,2M', change: 18.3, color: 'success' },
  { icon: Users, label: 'Total Pelanggan', value: '8.920', change: 8.1, color: 'secondary-accent' },
  { icon: TrendingUp, label: 'Event Aktif', value: '24', change: -2.4, color: 'warning' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Budi Santoso', event: 'Java Jazz 2026', amount: 350000, status: 'Paid' },
  { id: 'ORD-002', customer: 'Siti Rahma', event: 'Coldplay Tour', amount: 1700000, status: 'Pending' },
  { id: 'ORD-003', customer: 'Ahmad Fauzi', event: 'Dewa 19 Reunion', amount: 500000, status: 'Paid' },
  { id: 'ORD-004', customer: 'Dewi Lestari', event: 'Festival Musik 2026', amount: 250000, status: 'Cancelled' },
  { id: 'ORD-005', customer: 'Rudi Hartono', event: 'Rich Brian Tour', amount: 400000, status: 'Pending' },
];

const topEvents = [
  { name: 'Java Jazz Festival 2026', sold: 2350, quota: 3700, revenue: 'Rp 1.2B' },
  { name: 'Coldplay: Music of the Spheres', sold: 5000, quota: 5000, revenue: 'Rp 4.2B' },
  { name: 'Dewa 19 Reunion Tour', sold: 1800, quota: 3000, revenue: 'Rp 900M' },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Ringkasan platform konser Anda</p>
        </div>
            <Link href="/admin/concerts">
          <Button size="sm">
            <Music size={16} />
            Tambah Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-secondary-bg border border-border rounded-[18px] p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Pesanan Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID Pesanan', 'Pelanggan', 'Event', 'Jumlah', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs text-text-muted uppercase tracking-wider font-medium px-3 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="px-3 py-3 text-sm text-text-primary">{order.id}</td>
                    <td className="px-3 py-3 text-sm text-text-primary">{order.customer}</td>
                    <td className="px-3 py-3 text-sm text-text-secondary">{order.event}</td>
                    <td className="px-3 py-3 text-sm text-text-primary">Rp{order.amount.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-3">
                      <Badge variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'error'}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-right">
            <Link href="/admin/orders" className="text-sm text-secondary-accent hover:underline">Lihat Semua Pesanan</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-bg border border-border rounded-[18px] p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Event Terpopuler</h2>
          <div className="space-y-4">
            {topEvents.map((event) => (
              <div key={event.name} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <h3 className="text-sm font-medium text-text-primary mb-2">{event.name}</h3>
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span>{event.sold.toLocaleString()} / {event.quota.toLocaleString()} sold</span>
                  <span>{event.revenue}</span>
                </div>
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${Math.min((event.sold / event.quota) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
