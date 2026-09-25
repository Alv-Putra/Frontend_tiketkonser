'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/admin/Pagination';

const initialArtists = [
  { id: 1, name: 'Tulus', genre: 'Pop', country: 'Indonesia', events: 12 },
  { id: 2, name: 'Coldplay', genre: 'Rock', country: 'UK', events: 3 },
  { id: 3, name: 'Raisa', genre: 'Pop', country: 'Indonesia', events: 8 },
  { id: 4, name: 'Rich Brian', genre: 'Hip Hop', country: 'Indonesia', events: 5 },
  { id: 5, name: 'Dewa 19', genre: 'Rock', country: 'Indonesia', events: 20 },
  { id: 6, name: 'Isyana Sarasvati', genre: 'Klasik Pop', country: 'Indonesia', events: 7 },
];

export default function ArtistManagement() {
  const [artists, setArtists] = useState(initialArtists);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [form, setForm] = useState({ name: '', genre: '', country: '' });

  const PAGE_SIZE = 10;

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.genre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', genre: '', country: '' });
    setModalOpen(true);
  };

  const openEdit = (artist) => {
    setEditing(artist);
    setForm({ name: artist.name, genre: artist.genre, country: artist.country });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setArtists(artists.map((a) => a.id === editing.id ? { ...a, ...form } : a));
      setToast({ show: true, message: 'Artis berhasil diperbarui', type: 'success' });
    } else {
      setArtists([{ ...form, id: Date.now(), events: 0 }, ...artists]);
      setToast({ show: true, message: 'Artis berhasil ditambahkan', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setArtists(artists.filter((a) => a.id !== editing.id));
    setDeleteDialog(false);
    setToast({ show: true, message: 'Artis berhasil dihapus', type: 'error' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Artis</h1>
          <p className="text-text-muted text-sm mt-1">Kelola artis dan musisi</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Tambah Artis</Button>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cari artis..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full max-w-xs bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada artis" description="Coba pencarian lain atau buat artis baru." actionLabel="Tambah Artis" onAction={openCreate} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Nama', 'Genre', 'Negara', 'Event', 'Aksi'].map((h) => (
                      <th key={h} className="font-heading text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((artist) => (
                  <tr key={artist.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{artist.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{artist.genre}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{artist.country}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{artist.events}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(artist)} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-secondary-accent transition-colors cursor-pointer"><Edit2 size={15} /></button>
                        <button onClick={() => { setEditing(artist); setDeleteDialog(true); }} className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-error transition-colors cursor-pointer"><Trash2 size={15} /></button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Artis' : 'Tambah Artis'}>
        <div className="space-y-4">
          <Input label="Nama Artis" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
          <Input label="Negara" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? 'Perbarui' : 'Buat'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog} onClose={() => setDeleteDialog(false)} onConfirm={handleDelete} message={`Apakah Anda yakin ingin menghapus "${editing?.name}"?`} />
      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
