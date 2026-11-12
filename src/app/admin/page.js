'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, DollarSign, TrendingUp, Calendar, Music, ShoppingCart, ArrowUp, ArrowDown, Eye, MoreHorizontal, ChevronRight, Clock } from 'lucide-react';
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
  { id: 'ORD-001', customer: 'Budi Santoso', event: 'Java Jazz 2026', amount: 350000, status: 'Paid', time: '2 menit lalu' },
  { id: 'ORD-002', customer: 'Siti Rahma', event: 'Coldplay Tour', amount: 1700000, status: 'Pending', time: '5 menit lalu' },
  { id: 'ORD-003', customer: 'Ahmad Fauzi', event: 'Dewa 19 Reunion', amount: 500000, status: 'Paid', time: '12 menit lalu' },
  { id: 'ORD-004', customer: 'Dewi Lestari', event: 'Festival Musik 2026', amount: 250000, status: 'Cancelled', time: '1 jam lalu' },
  { id: 'ORD-005', customer: 'Rudi Hartono', event: 'Rich Brian Tour', amount: 400000, status: 'Pending', time: '2 jam lalu' },
];

const topEvents = [
  { name: 'Java Jazz Festival 2026', sold: 2350, quota: 3700, revenue: 'Rp 1.2B', trend: 15 },
  { name: 'Coldplay: Music of the Spheres', sold: 5000, quota: 5000, revenue: 'Rp 4.2B', trend: 0 },
  { name: 'Dewa 19 Reunion Tour', sold: 1800, quota: 3000, revenue: 'Rp 900M', trend: 8 },
];

const quickActions = [
  { label: 'Tambah Event', icon: Music, href: '/admin/concerts', color: 'primary' },
  { label: 'Lihat Pesanan', icon: ShoppingCart, href: '/admin/orders', color: 'secondary' },
  { label: 'Persetujuan', icon: Eye, href: '/admin/approvals', color: 'warning' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Selamat datang di ConserId Admin Panel</p>
        </div>
        <div className="flex items-center gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Button size="sm" variant={action.color === 'warning' ? 'outline' : 'primary'}>
                  <Icon size={16} />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-secondary-bg border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} className="text-primary-accent" />
              </div>
              <div>
                <h2 className="font-bold text-text-primary">Pesanan Terbaru</h2>
                <p className="text-xs text-text-muted">5 transaksi terakhir</p>
              </div>
            </div>
            <Link href="/admin/orders" className="text-sm text-primary-accent hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-surface/50 rounded-xl hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.status === 'Paid' ? 'bg-success/10' :
                    order.status === 'Pending' ? 'bg-warning/10' : 'bg-error/10'
                  }`}>
                    {order.status === 'Paid' ? (
                      <ArrowUp size={18} className="text-success" />
                    ) : order.status === 'Pending' ? (
                      <Clock size={18} className="text-warning" />
                    ) : (
                      <ArrowDown size={18} className="text-error" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{order.customer}</p>
                    <p className="text-xs text-text-muted">{order.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary text-sm">Rp{order.amount.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-text-muted">{order.time}</p>
                </div>
                <Badge variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'error'}>
                  {order.status === 'Paid' ? 'Lunas' : order.status === 'Pending' ? 'Menunggu' : 'Batal'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary-bg border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-primary-accent" />
              </div>
              <div>
                <h2 className="font-bold text-text-primary">Event Terpopuler</h2>
                <p className="text-xs text-text-muted">Penjualan tertinggi</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {topEvents.map((event, index) => (
              <motion.div
                key={event.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-primary line-clamp-1">{event.name}</h3>
                  {event.trend > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-success">
                      <ArrowUp size={12} /> {event.trend}%
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span>{event.sold.toLocaleString('id-ID')} / {event.quota.toLocaleString('id-ID')} sold</span>
                  <span className="font-medium text-primary-accent">{event.revenue}</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((event.sold / event.quota) * 100, 100)}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-primary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5"
      >
        <div className="bg-secondary-bg border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">Konversi Penjualan</span>
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
          </div>
          <p className="text-3xl font-bold text-text-primary mb-1">78.5%</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success flex items-center gap-1">
              <ArrowUp size={12} /> 5.2%
            </span>
            <span className="text-text-muted">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-secondary-bg border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">Avg. Order Value</span>
            <div className="w-8 h-8 bg-primary-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-primary-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold text-text-primary mb-1">Rp 458K</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-success flex items-center gap-1">
              <ArrowUp size={12} /> 12.8%
            </span>
            <span className="text-text-muted">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-secondary-bg border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">Tiket per Order</span>
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Ticket size={16} className="text-warning" />
            </div>
          </div>
          <p className="text-3xl font-bold text-text-primary mb-1">2.3</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-error flex items-center gap-1">
              <ArrowDown size={12} /> 0.2
            </span>
            <span className="text-text-muted">vs bulan lalu</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
