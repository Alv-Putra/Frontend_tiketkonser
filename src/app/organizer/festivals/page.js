'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import festivalService from '@/services/festivalService';
import { FESTIVAL_STATUS } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

const statusConfig = {
  [FESTIVAL_STATUS.PENDING_APPROVAL]: { label: 'Menunggu Persetujuan', variant: 'warning' },
  [FESTIVAL_STATUS.APPROVED]: { label: 'Disetujui', variant: 'success' },
  [FESTIVAL_STATUS.REJECTED]: { label: 'Ditolak', variant: 'error' },
  [FESTIVAL_STATUS.PUBLISHED]: { label: 'Dipublikasikan', variant: 'success' },
  [FESTIVAL_STATUS.DRAFT]: { label: 'Draft', variant: 'default' },
};

function FestivalsContent() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const result = await festivalService.getAllFestivals();
      setFestivals(result);
      setLoading(false);
    };
    load();
  }, []);

  const getStatusConfig = (status) => statusConfig[status] || statusConfig[FESTIVAL_STATUS.DRAFT];

  const filtered = festivals.filter((f) =>
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.artist.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Festival Saya</h1>
          <p className="text-text-muted text-sm mt-1">Kelola festival dan periode penjualannya.</p>
        </div>
        <Link href="/organizer/festivals/create">
          <Button>
            <Plus size={16} />
            Buat Festival
          </Button>
        </Link>
      </motion.div>

      <div className="relative mb-6 max-w-md">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Search size={16} />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari festival..."
          className="w-full bg-secondary-bg border border-border rounded-full pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all duration-200"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Music}
          title="Belum ada festival"
          description="Buat festival pertamamu untuk menjual tiket."
        />
      ) : (
        <div className="bg-secondary-bg border border-border rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-muted">
                  <th className="p-5 font-medium">Festival</th>
                  <th className="p-5 font-medium">Tanggal</th>
                  <th className="p-5 font-medium">Lokasi</th>
                  <th className="p-5 font-medium">Nilai Penjualan</th>
                  <th className="p-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((festival) => {
                  const config = getStatusConfig(festival.status);
                  const sold = (festival.ticketTypes || []).reduce((s, t) => s + t.sold, 0);
                  return (
                    <tr key={festival.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                      <td className="p-5">
                        <Link href={`/organizer/festivals/${festival.id}`} className="flex items-center gap-3 group">
                          <div className="w-12 h-12 rounded-[12px] bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url(${festival.image})` }}
                          />
                          <div>
                            <p className="font-semibold text-text-primary group-hover:text-primary-accent transition-colors">
                              {festival.title}
                            </p>
                            <p className="text-xs text-text-muted">{festival.artist}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-5 text-text-secondary whitespace-nowrap">
                        {formatDate(festival.date)}
                      </td>
                      <td className="p-5 text-text-secondary">{festival.city}</td>
                      <td className="p-5 text-text-secondary">
                        {sold} tiket
                      </td>
                      <td className="p-5">
                        <Badge variant={config.variant}>
                          {festival.status === FESTIVAL_STATUS.PENDING_APPROVAL && <Clock size={12} />}
                          {config.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizerFestivalsPage() {
  return <FestivalsContent />;
}