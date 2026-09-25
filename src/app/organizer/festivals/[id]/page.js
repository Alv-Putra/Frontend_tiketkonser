'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Trash2, Ticket, Calendar, MapPin, Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import festivalService from '@/services/festivalService';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { FESTIVAL_STATUS } from '@/lib/constants';

const statusConfig = {
  [FESTIVAL_STATUS.PENDING_APPROVAL]: { label: 'Menunggu Persetujuan', variant: 'warning' },
  [FESTIVAL_STATUS.PUBLISHED]: { label: 'Dipublikasikan', variant: 'success' },
  [FESTIVAL_STATUS.REJECTED]: { label: 'Ditolak', variant: 'error' },
  [FESTIVAL_STATUS.DRAFT]: { label: 'Draft', variant: 'default' },
};

function FestivalDetailContent({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await festivalService.getFestivalById(id);
      if (result) {
        setFestival(result);
        setTicketTypes(result.ticketTypes || []);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading || !festival) {
    return (
      <div>
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="h-80 mb-8" />
      </div>
    );
  }

  const config = statusConfig[festival.status] || statusConfig[FESTIVAL_STATUS.DRAFT];

  const updateTicket = (index, field, value) => {
    setTicketTypes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTicket = () => {
    setTicketTypes((prev) => [...prev, { name: '', price: '', quota: 0, sold: 0 }]);
  };

  const removeTicket = (index) => {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = await festivalService.updateFestival(festival.id, {
      ...festival,
      ticketTypes: ticketTypes.map((t, i) => ({
        ...t,
        id: t.id || `t${Date.now()}-${i}`,
        price: Number(t.price) || 0,
      })),
    });
    setFestival(updated);
    setSaving(false);
    setToast({ isOpen: true, type: 'success', message: 'Festival berhasil disimpan.' });
  };

  const handleDelete = async () => {
    setDeleting(true);
    await festivalService.deleteFestival(festival.id);
    setDeleting(false);
    router.push('/organizer/festivals');
  };

  const changedThyTicketCount = ticketTypes.reduce((s, t) => s + t.sold, 0);
  const changedQuota = ticketTypes.reduce((s, t) => s + (Number(t.quota) || 0), 0);

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/organizer/festivals')}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="relative h-64 md:h-80 rounded-[24px] overflow-hidden mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${festival.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{festival.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-2"><Calendar size={14} />{formatDate(festival.date)}</span>
            <span className="flex items-center gap-2"><MapPin size={14} />{festival.venue}, {festival.city}</span>
            <span className="flex items-center gap-2"><Ticket size={14} />{formatCurrency(festival.priceStart)}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Jenis Tiket</h2>
          <Button variant="outline" size="sm" onClick={addTicket}>
            <Plus size={14} />
            Tambah
          </Button>
        </div>
        <div className="space-y-4">
          {ticketTypes.map((ticket, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-end bg-surface rounded-[18px] border border-border p-4">
              <Input
                label="Nama Tiket"
                value={ticket.name}
                onChange={(e) => updateTicket(index, 'name', e.target.value)}
              />
              <Input
                label="Harga"
                type="number"
                value={ticket.price}
                onChange={(e) => updateTicket(index, 'price', e.target.value)}
              />
              <Input
                label="Kuota"
                type="number"
                value={ticket.quota}
                onChange={(e) => updateTicket(index, 'quota', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Terjual</label>
                <p className="py-3 px-4 rounded-xl bg-primary-bg border border-border text-sm font-semibold text-primary-accent">
                  {ticket.sold}
                </p>
              </div>
              <button
                onClick={() => removeTicket(index)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-error hover:border-error/40 transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
          <span>Total terjual: {changedThyTicketCount}</span>
          <span>Total kuota: {changedQuota}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          <Trash2 size={16} />
          Hapus Festival
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Festival"
        message={`Apakah kamu yakin ingin menghapus ${festival.title}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        loading={deleting}
      />

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function FestivalDetailPage({ params }) {
  return <FestivalDetailContent params={params} />;
}