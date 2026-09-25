'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Music, Ticket, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/stores/authStore';
import { subscribeStorage, getStorageSnapshot } from '@/services/storageService';
import { formatCurrency } from '@/lib/formatters';

function StatCard({ icon: Icon, label, value, sub, delay }) {
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
      <p className="text-2xl font-black text-text-primary mb-1">{value}</p>
      {sub && <p className="text-xs text-text-muted">{sub}</p>}
    </motion.div>
  );
}

function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const { festivals: allFestivals, orders: allOrders } = useSyncExternalStore(
    subscribeStorage,
    getStorageSnapshot,
    getStorageSnapshot
  );

  const stats = useMemo(() => {
    const totalTickets = allFestivals.reduce((sum, f) =>
      sum + (f.ticketTypes || []).reduce((s, t) => s + t.sold, 0), 0);
    const totalRevenue = allOrders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    return {
      totalFestivals: allFestivals.length,
      totalTickets,
      totalRevenue,
      totalOrders: allOrders.length,
    };
  }, [allFestivals, allOrders]);

  const recentFestivals = useMemo(() => allFestivals.slice(0, 5), [allFestivals]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black mb-2">
          Selamat datang, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p className="text-text-muted">Dashboard pengelolaan festival & penjualan tiket.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Music} label="Total Festival" value={stats.totalFestivals} delay={0} />
        <StatCard icon={Ticket} label="Total Tiket Terjual" value={stats.totalTickets.toLocaleString('id-ID')} delay={0.05} />
        <StatCard icon={TrendingUp} label="Total Pendapatan" value={formatCurrency(stats.totalRevenue)} delay={0.1} />
        <StatCard icon={Users} label="Total Pesanan" value={stats.totalOrders} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-secondary-bg border border-border rounded-[24px] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Festival Terbaru</h2>
            <Link href="/organizer/festivals" className="text-sm text-primary-accent hover:underline">
              Kelola Semua
            </Link>
          </div>
          <div className="space-y-4">
            {recentFestivals.map((festival) => {
              const sold = (festival.ticketTypes || []).reduce((s, t) => s + t.sold, 0);
              const quota = (festival.ticketTypes || []).reduce((s, t) => s + t.quota, 0);
              const percentage = quota ? Math.round((sold / quota) * 100) : 0;
              return (
                <Link
                  key={festival.id}
                  href="/organizer/festivals"
                  className="flex items-center gap-4 p-4 rounded-[18px] bg-surface border border-border hover:border-primary-accent/40 transition-all"
                >
                  <div className="w-14 h-14 rounded-[12px] bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${festival.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary truncate">{festival.title}</p>
                    <p className="text-xs text-text-muted">{festival.venue}, {festival.city}</p>
                  </div>
                  <div className="hidden md:block w-40">
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                      <span>{percentage}%</span>
                      <span>{sold}/{quota} tiket</span>
                    </div>
                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-secondary-bg border border-border rounded-[24px] p-6"
        >
          <h2 className="font-bold text-lg mb-6">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link
              href="/organizer/festivals/create"
              className="block p-4 rounded-[18px] bg-gradient-primary text-primary-bg font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Buat Festival Baru
            </Link>
            <Link
              href="/organizer/checkin"
              className="block p-4 rounded-[18px] bg-surface border border-border text-center font-semibold text-text-primary hover:border-primary-accent/40 transition-all"
            >
              Check-in Tiket
            </Link>
            <Link
              href="/organizer/sales"
              className="block p-4 rounded-[18px] bg-surface border border-border text-center font-semibold text-text-primary hover:border-primary-accent/40 transition-all"
            >
              Lihat Data Penjualan
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrganizerDashboardPage() {
  return <DashboardContent />;
}