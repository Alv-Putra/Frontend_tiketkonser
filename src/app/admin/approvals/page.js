'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Eye, Clock, Music } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Toast from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import festivalService from '@/services/festivalService';
import { FESTIVAL_STATUS } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/formatters';

const statusConfig = {
  [FESTIVAL_STATUS.PENDING_APPROVAL]: { label: 'Menunggu Persetujuan', variant: 'warning' },
  [FESTIVAL_STATUS.PUBLISHED]: { label: 'Dipublikasikan', variant: 'success' },
  [FESTIVAL_STATUS.REJECTED]: { label: 'Ditolak', variant: 'error' },
  [FESTIVAL_STATUS.DRAFT]: { label: 'Draft', variant: 'default' },
};

function ApprovalsContent() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(FESTIVAL_STATUS.PENDING_APPROVAL);
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    const load = async () => {
      const result = await festivalService.getCreatedFestivals();
      setFestivals(result);
      setLoading(false);
    };
    load();
  }, [selected]);

  const filtered = festivals.filter((f) => activeFilter === 'all' || f.status === activeFilter);

  const handleApprove = async () => {
    if (!selected) return;
    setProcessing(true);
    await festivalService.approveFestival(selected.id);
    setProcessing(false);
    setSelected(null);
    setToast({ isOpen: true, type: 'success', message: 'Festival berhasil dipublikasikan.' });
    const result = await festivalService.getCreatedFestivals();
    setFestivals(result);
  };

  const handleReject = async () => {
    if (!selected) return;
    setProcessing(true);
    await festivalService.rejectFestival(selected.id);
    setProcessing(false);
    setSelected(null);
    setToast({ isOpen: true, type: 'warning', message: 'Festival ditolak.' });
    const result = await festivalService.getCreatedFestivals();
    setFestivals(result);
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-56 mb-8" />
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
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-black">Persetujuan Festival</h1>
        <p className="text-text-muted text-sm mt-1">
          Tinjau festival yang diajukan oleh organizer sebelum dipublikasikan.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: FESTIVAL_STATUS.PENDING_APPROVAL, label: 'Menunggu' },
          { value: FESTIVAL_STATUS.PUBLISHED, label: 'Dipublikasikan' },
          { value: FESTIVAL_STATUS.REJECTED, label: 'Ditolak' },
          { value: 'all', label: 'Semua' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
              activeFilter === filter.value
                ? 'bg-gradient-primary text-primary-bg font-semibold'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Music}
          title="Tidak ada festival"
          description="Belum ada festival dalam kategori ini."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((festival) => {
            const config = statusConfig[festival.status] || statusConfig[FESTIVAL_STATUS.DRAFT];
            const sold = (festival.ticketTypes || []).reduce((s, t) => s + t.sold, 0);
            return (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary-bg border border-border rounded-[24px] p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[12px] bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${festival.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{festival.title}</h3>
                    <p className="text-xs text-text-muted">
                      {festival.artist} • {formatDate(festival.date)} • {festival.city}
                    </p>
                    <div className="mt-2">
                      <Badge variant={config.variant}>
                        {festival.status === FESTIVAL_STATUS.PENDING_APPROVAL && <Clock size={12} />}
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-xs text-text-muted">Mulai dari</p>
                    <p className="font-bold text-gradient">{formatCurrency(festival.priceStart)}</p>
                    <p className="text-xs text-text-muted mt-1">{sold} tiket terjual</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelected(festival)}>
                    <Eye size={14} />
                    Tinjau
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? selected.title : ''}
        size="lg"
      >
        {selected && (
          <div>
            <div className="h-48 rounded-[18px] bg-cover bg-center mb-6"
              style={{ backgroundImage: `url(${selected.image})` }}
            />
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-text-muted">Artis / Headliner</span>
                <span className="text-text-primary font-medium">{selected.artist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Genre</span>
                <span className="text-text-primary font-medium">{selected.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tanggal</span>
                <span className="text-text-primary font-medium">{formatDate(selected.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Venue</span>
                <span className="text-text-primary font-medium">{selected.venue}, {selected.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Organizer</span>
                <span className="text-text-primary font-medium">{selected.organizer?.name || '-'}</span>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary mb-3">Jenis Tiket</h4>
            <div className="bg-surface rounded-[18px] border border-border p-4 space-y-2 mb-6">
              {selected.ticketTypes.map((t) => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="text-text-muted">{t.name}</span>
                  <span className="text-text-primary font-medium">
                    {formatCurrency(t.price)} • {t.sold}/{t.quota}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-text-muted text-sm leading-relaxed mb-6">{selected.description}</p>

            {selected.status === FESTIVAL_STATUS.PENDING_APPROVAL ? (
              <div className="flex gap-3">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={processing}
                >
                  <CheckCircle2 size={16} />
                  Setujui & Publikasikan
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={processing}
                >
                  <XCircle size={16} />
                  Tolak
                </Button>
              </div>
            ) : (
              <Badge variant={statusConfig[selected.status]?.variant}>
                {statusConfig[selected.status]?.label}
              </Badge>
            )}
          </div>
        )}
      </Modal>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function ApprovalsPage() {
  return <ApprovalsContent />;
}