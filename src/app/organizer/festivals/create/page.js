'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, X, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import festivalService from '@/services/festivalService';
import { GENRE_OPTIONS } from '@/lib/constants';

function CreateFestivalContent() {
  const router = useRouter();
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });
  const [saving, setSaving] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([
    { name: '', price: '', quota: '' },
  ]);

  const [form, setForm] = useState({
    title: '',
    artist: '',
    genre: 'Pop',
    description: '',
    venue: '',
    city: '',
    date: '',
    endDate: '',
    image: '',
    organizerId: 'org1',
    organizer: { name: 'Organizer', description: '' },
    lineup: [''],
    schedule: [{ time: '', title: '' }],
    rules: [''],
    salesPeriod: { start: '', end: '' },
  });

  const updateTicketType = (index, field, value) => {
    setTicketTypes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [...prev, { name: '', price: '', quota: '' }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date || !form.venue) {
      setToast({ isOpen: true, type: 'error', message: 'Lengkapi data festival terlebih dahulu.' });
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      artist: form.artist.trim() || 'Special Guest',
      genre: form.genre,
      description: form.description.trim() || '-',
      venue: form.venue.trim(),
      city: form.city.trim() || 'Jakarta',
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : new Date(form.date).toISOString(),
      image: form.image.trim() ||
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1080',
      lineup: form.lineup.map((l) => l.trim()).filter(Boolean),
      schedule: form.schedule.filter((s) => s.title.trim()).map((s) => ({
        time: s.time ? new Date(s.time).toISOString() : new Date(form.date).toISOString(),
        title: s.title.trim(),
      })),
      rules: form.rules.map((r) => r.trim()).filter(Boolean),
      priceStart: ticketTypes.length ? Number(ticketTypes[0].price) || 0 : 0,
      ticketTypes: ticketTypes
        .filter((t) => t.name.trim())
        .map((t, i) => ({
          id: `t${Date.now()}-${i}`,
          name: t.name.trim(),
          price: Number(t.price) || 0,
          quota: Number(t.quota) || 0,
          sold: 0,
        })),
      salesPeriod: {
        start: form.salesPeriod.start ? new Date(form.salesPeriod.start).toISOString() : new Date().toISOString(),
        end: form.salesPeriod.end ? new Date(form.salesPeriod.end).toISOString() : null,
      },
      faq: [],
      views: 0,
      featured: false,
      ticketStatus: 'coming_soon',
    };

    try {
      const result = await festivalService.createFestival(payload);
      setSaving(false);
      setToast({
        isOpen: true,
        type: 'success',
        message: 'Festival berhasil dibuat dan menunggu persetujuan admin.',
      });
      setTimeout(() => router.push('/organizer/festivals'), 1500);
    } catch (error) {
      setSaving(false);
      setToast({ isOpen: true, type: 'error', message: error.message });
    }
  };

  return (
    <div className="pb-16">
      <button
        onClick={() => router.push('/organizer/festivals')}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
      >
        <ChevronLeft size={18} />
        Kembali
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-black mb-2">Buat Festival Baru</h1>
        <p className="text-text-muted mb-8">
          Festival akan ditinjau admin sebelum dipublikasikan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8 space-y-5">
            <h2 className="font-bold text-lg">Informasi Dasar</h2>
            <Input
              label="Nama Festival"
              placeholder="cth. Festival Musik Nusantara 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Artis / Headliner"
                placeholder="cth. Raisa"
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Genre</label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent cursor-pointer"
                >
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Deskripsi"
              placeholder="Deskripsi singkat festival"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Venue"
                placeholder="cth. Gelora Bung Karno"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
              <Input
                label="Kota"
                placeholder="cth. Jakarta"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tanggal Selesai</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
                />
              </div>
            </div>
            <Input
              label="URL Gambar"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </section>

          <section className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Jenis Tiket</h2>
              <Button variant="outline" size="sm" onClick={addTicketType}>
                <Plus size={14} />
                Tambah
              </Button>
            </div>

            {ticketTypes.map((ticket, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end bg-surface rounded-[18px] border border-border p-4">
                <Input
                  label="Nama Tiket"
                  placeholder="VIP"
                  value={ticket.name}
                  onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                />
                <Input
                  label="Harga"
                  type="number"
                  placeholder="350000"
                  value={ticket.price}
                  onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                />
                <Input
                  label="Kuota"
                  type="number"
                  placeholder="1000"
                  value={ticket.quota}
                  onChange={(e) => updateTicketType(index, 'quota', e.target.value)}
                />
                <button
                  onClick={() => removeTicketType(index)}
                  disabled={ticketTypes.length === 1}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-error hover:border-error/40 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </section>

          <section className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8 space-y-5">
            <h2 className="font-bold text-lg">Periode Penjualan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Mulai Jual</label>
                <input
                  type="date"
                  value={form.salesPeriod.start}
                  onChange={(e) => setForm({ ...form, salesPeriod: { ...form.salesPeriod, start: e.target.value } })}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Selesai Jual</label>
                <input
                  type="date"
                  value={form.salesPeriod.end}
                  onChange={(e) => setForm({ ...form, salesPeriod: { ...form.salesPeriod, end: e.target.value } })}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
          <div className="bg-secondary-bg border border-border rounded-[24px] p-6 md:p-8">
            <h2 className="font-bold text-lg mb-4">Ringkasan</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Nama</span>
                <span className="text-text-primary truncate max-w-[60%]">{form.title || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Genre</span>
                <span className="text-text-primary">{form.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Jenis Tiket</span>
                <span className="text-text-primary">{ticketTypes.filter((t) => t.name.trim()).length}</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-4">
              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Festival'}
              </Button>
              <p className="text-xs text-text-muted text-center">
                Setelah disimpan, admin akan meninjau festival kamu.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function CreateFestivalPage() {
  return <CreateFestivalContent />;
}