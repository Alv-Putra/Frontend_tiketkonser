'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/admin/Pagination';

const initialCategories = [
  { id: 1, name: 'VIP', event: 'Java Jazz 2026', price: 1500000, quota: 200, sold: 150 },
  { id: 2, name: 'Kategori 1', event: 'Java Jazz 2026', price: 850000, quota: 500, sold: 400 },
  { id: 3, name: 'Kategori 2', event: 'Java Jazz 2026', price: 500000, quota: 1000, sold: 600 },
  { id: 4, name: 'Festival', event: 'Java Jazz 2026', price: 350000, quota: 2000, sold: 1200 },
  { id: 5, name: 'VIP', event: 'Coldplay Tour', price: 3500000, quota: 500, sold: 500 },
  { id: 6, name: 'Reguler', event: 'Coldplay Tour', price: 850000, quota: 4500, sold: 4500 },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [form, setForm] = useState({ name: '', event: '', price: '', quota: '', sold: '0' });

  const PAGE_SIZE = 10;

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.event.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', event: '', price: '', quota: '', sold: '0' });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, event: cat.event, price: String(cat.price), quota: String(cat.quota), sold: String(cat.sold) });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...form, price: Number(form.price), quota: Number(form.quota), sold: Number(form.sold) } : c));
      setToast({ show: true, message: 'Kategori berhasil diperbarui', type: 'success' });
    } else {
      setCategories([{ ...form, id: Date.now(), price: Number(form.price), quota: Number(form.quota), sold: Number(form.sold) }, ...categories]);
      setToast({ show: true, message: 'Kategori berhasil ditambahkan', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setCategories(categories.filter((c) => c.id !== editing.id));
    setDeleteDialog(false);
    setToast({ show: true, message: 'Kategori berhasil dihapus', type: 'error' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kategori Tiket</h1>
          <p className="text-text-muted text-sm mt-1">Kelola kelas tiket untuk setiap event</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Tambah Kategori</Button>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cari kategori..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full max-w-xs bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada kategori" description="Coba pencarian lain atau buat kategori baru." actionLabel="Tambah Kategori" onAction={openCreate} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Kelas', 'Event', 'Harga', 'Kuota', 'Terjual', 'Tersedia', 'Aksi'].map((h) => (
                      <th key={h} className="font-heading text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((cat) => (
                  <tr key={cat.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{cat.event}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">Rp{cat.price.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{cat.quota.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{cat.sold.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${cat.quota - cat.sold > 0 ? 'text-success' : 'text-error'}`}>
                        {cat.quota - cat.sold > 0 ? (cat.quota - cat.sold).toLocaleString('id-ID') : 'Habis'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-secondary-accent transition-colors cursor-pointer"><Edit2 size={15} /></button>
                        <button onClick={() => { setEditing(cat); setDeleteDialog(true); }} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-error transition-colors cursor-pointer"><Trash2 size={15} /></button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
        <div className="space-y-4">
          <Input label="Nama Kelas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="mis. VIP, Festival, Reguler" />
          <Input label="Event" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} />
          <Input label="Harga" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="Kuota" type="number" value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? 'Perbarui' : 'Buat'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog} onClose={() => setDeleteDialog(false)} onConfirm={handleDelete} message={`Apakah Anda yakin ingin menghapus kelas "${editing?.name}"?`} />
      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
