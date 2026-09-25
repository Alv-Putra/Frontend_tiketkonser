'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Ticket, Users, Wallet } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import orderService from '@/services/orderService';
import festivalService from '@/services/festivalService';
import { storageDB } from '@/services/storageService';
import { mockFestivals } from '@/services/mockData';
import { formatCurrency, formatDateTime } from '@/lib/formatters';

function StatCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-secondary-bg border border-border rounded-[18px] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-accent/10 flex items-center justify-center">
          <Icon size={20} className="text-primary-accent" />
        </div>
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="text-2xl font-black text-text-primary">{value}</p>
    </motion.div>
  );
}

function SalesContent() {
  const [orders, setOrders] = useState([]);
  const [festivalSales, setFestivalSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const allOrders = await orderService.getOrdersByUser('all');
      const festivals = storageDB.festivals && storageDB.festivals.length ? storageDB.festivals : mockFestivals;

      const sales = festivals.map((f) => {
        const festivalOrders = allOrders.filter((o) => o.festivalId === f.id && o.status === 'paid');
        const sold = (f.ticketTypes || []).reduce((s, t) => s + t.sold, 0);
        const revenue = festivalOrders.reduce((sum, o) => sum + o.total, 0);
        return { ...f, sold, revenue, orderCount: festivalOrders.length };
      }).sort((a, b) => b.revenue - a.revenue);

      setOrders(allOrders.filter((o) => o.status === 'paid'));
      setFestivalSales(sales);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSold = festivalSales.reduce((sum, f) => sum + f.sold, 0);
  const totalQuota = festivalSales.reduce((sum, f) => sum + (f.ticketTypes || []).reduce((s, t) => s + t.quota, 0), 0);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black">Data Penjualan</h1>
        <p className="text-text-muted text-sm mt-1">Pantau performa penjualan tiket festival kamu.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Total Pendapatan" value={formatCurrency(totalRevenue)} delay={0} />
        <StatCard icon={Ticket} label="Tiket Terjual" value={totalSold.toLocaleString('id-ID')} delay={0.05} />
        <StatCard icon={Wallet} label="Omzet per Festival" value={`${festivalSales.length} festival`} delay={0.1} />
        <StatCard icon={Users} label="Total Pendapatan Escrow" value={formatCurrency(totalRevenue)} delay={0.15} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary-bg border border-border rounded-[24px] p-6"
      >
        <h2 className="font-bold text-lg mb-6">Performa per Festival</h2>
        {festivalSales.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {festivalSales.map((f) => {
              const percentage = totalQuota ? Math.round((f.sold / totalQuota) * 100) : 0;
              return (
                <div key={f.id} className="p-4 rounded-[18px] bg-surface border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-text-primary">{f.title}</p>
                      <p className="text-xs text-text-muted">{f.venue}, {f.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gradient">{formatCurrency(f.revenue)}</p>
                      <p className="text-xs text-text-muted">{f.orderCount} pesanan</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                    <span>{f.sold}/{f.ticketTypes?.reduce((s, t) => s + t.quota, 0) || 0} tiket terjual</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 bg-secondary-bg border border-border rounded-[24px] overflow-hidden"
      >
        <div className="p-6 pb-0">
          <h2 className="font-bold text-lg">Pesanan Terbayar Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="p-5 font-medium">No. Pesanan</th>
                <th className="p-5 font-medium">Festival</th>
                <th className="p-5 font-medium">Tanggal</th>
                <th className="p-5 font-medium">Metode</th>
                <th className="p-5 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="p-5 font-mono text-xs text-text-secondary">{o.orderNumber}</td>
                  <td className="p-5 text-text-primary">{o.festivalTitle}</td>
                  <td className="p-5 text-text-secondary whitespace-nowrap">
                    {formatDateTime(o.paidAt || o.createdAt)}
                  </td>
                  <td className="p-5">
                    <Badge variant="primary">{o.paymentMethod || '-'}</Badge>
                  </td>
                  <td className="p-5 font-bold text-text-primary">{formatCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default function SalesPage() {
  return <SalesContent />;
}