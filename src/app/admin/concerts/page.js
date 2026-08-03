'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/admin/Pagination';

const initialConcerts = [
  { id: 1, title: 'Java Jazz Festival 2026', artist: 'Various Artists', date: '15-17 Mei 2026', venue: 'JIExpo Kemayoran, Jakarta', status: 'Tersedia', quota: 3700, sold: 2350 },
  { id: 2, title: 'Coldplay: Music of the Spheres', artist: 'Coldplay', date: '20 Juni 2026', venue: 'Gelora Bung Karno, Jakarta', status: 'Habis Terjual', quota: 5000, sold: 5000 },
  { id: 3, title: 'Dewa 19 Reunion Tour', artist: 'Dewa 19', date: '12 Agustus 2026', venue: 'Stadion Utama GBK, Jakarta', status: 'Tersedia', quota: 3000, sold: 1800 },
];

export default function ConcertManagement() {
  const [concerts, setConcerts] = useState(initialConcerts);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [form, setForm] = useState({ title: '', artist: '', date: '', venue: '', status: 'Tersedia', quota: '', sold: '0' });

  const PAGE_SIZE = 10;
  const statusOptions = ['Tersedia', 'Habis Terjual', 'Dibatalkan'];

  const filtered = concerts.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.artist.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', artist: '', date: '', venue: '', status: 'Tersedia', quota: '', sold: '0' });
    setModalOpen(true);
  };

  const openEdit = (concert) => {
    setEditing(concert);
    setForm({ title: concert.title, artist: concert.artist, date: concert.date, venue: concert.venue, status: concert.status, quota: String(concert.quota), sold: String(concert.sold) });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setConcerts(concerts.map((c) => c.id === editing.id ? { ...c, ...form, quota: Number(form.quota), sold: Number(form.sold) } : c));
      setToast({ show: true, message: 'Konser berhasil diperbarui', type: 'success' });
    } else {
      const newConcert = { ...form, id: Date.now(), quota: Number(form.quota), sold: Number(form.sold) };
      setConcerts([newConcert, ...concerts]);
      setToast({ show: true, message: 'Konser berhasil ditambahkan', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setConcerts(concerts.filter((c) => c.id !== editing.id));
    setDeleteDialog(false);
    setToast({ show: true, message: 'Konser berhasil dihapus', type: 'error' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Konser</h1>
          <p className="text-text-muted text-sm mt-1">Kelola semua event konser</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Tambah Konser
        </Button>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Cari konser..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-xs bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada konser" description="Coba pencarian lain atau buat konser baru." actionLabel="Tambah Konser" onAction={openCreate} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Judul', 'Artis', 'Tanggal', 'Tempat', 'Status', 'Kuota', 'Terjual', 'Aksi'].map((h) => (
                      <th key={h} className="text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((concert) => (
                  <tr key={concert.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{concert.title}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{concert.artist}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{concert.date}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{concert.venue}</td>
                    <td className="px-4 py-3">
                      <Badge variant={concert.status === 'Habis Terjual' ? 'sold' : concert.status === 'Dibatalkan' ? 'error' : 'available'}>{concert.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">{concert.quota.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{concert.sold.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(concert)} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-secondary-accent transition-colors cursor-pointer"><Edit2 size={15} /></button>
                        <button onClick={() => { setEditing(concert); setDeleteDialog(true); }} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-error transition-colors cursor-pointer"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Konser' : 'Tambah Konser'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Artis" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            <Input label="Tanggal" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="mis. 15-17 Mei 2026" />
            <Input label="Tempat" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-primary-bg border border-border rounded-[12px] px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-accent/50 transition-colors">
                {statusOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Kuota" type="number" value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? 'Perbarui' : 'Buat'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog} onClose={() => setDeleteDialog(false)} onConfirm={handleDelete} message={`Apakah Anda yakin ingin menghapus "${editing?.title}"?`} />

      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
