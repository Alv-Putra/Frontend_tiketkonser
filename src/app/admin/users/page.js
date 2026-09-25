'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/admin/Pagination';
import Badge from '@/components/ui/Badge';
import authService from '@/services/authService';
import { formatDate } from '@/lib/formatters';

const roleColors = {
  buyer: 'default',
  customer: 'default',
  organizer: 'secondary',
  admin: 'success',
};

const roleLabels = {
  buyer: 'Customer',
  customer: 'Customer',
  organizer: 'Organizer',
  admin: 'Admin',
};

function normalizeUser(raw) {
  const profile = Array.isArray(raw.userProfiles) ? raw.userProfiles[0] : null;
  return {
    id: raw.id,
    public_id: raw.public_id,
    email: raw.email,
    fullName: profile?.full_name || raw.email,
    role: raw.role?.name || raw.role || 'buyer',
    isActive: Boolean(raw.is_active),
    createdAt: raw.created_at,
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const PAGE_SIZE = 10;

  const loadUsers = async ({ showLoader = true } = {}) => {
    if (showLoader) setLoading(true);
    try {
      const data = await authService.getAllUsers();
      setUsers(Array.isArray(data) ? data.map(normalizeUser) : []);
    } catch (error) {
      setToast({ show: true, message: error.message || 'Gagal memuat daftar pengguna', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    authService
      .getAllUsers()
      .then((data) => {
        if (!active) return;
        setUsers(Array.isArray(data) ? data.map(normalizeUser) : []);
      })
      .catch((error) => {
        if (!active) return;
        setToast({ show: true, message: error.message || 'Gagal memuat daftar pengguna', type: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      roleLabels[u.role].toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteDialog(false);
    try {
      await authService.deleteUser(deleting.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
      setToast({ show: true, message: 'Pengguna berhasil dihapus', type: 'error' });
    } catch (error) {
      setToast({ show: true, message: error.message || 'Gagal menghapus pengguna', type: 'error' });
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pengguna</h1>
          <p className="text-text-muted text-sm mt-1">Kelola akun pengguna</p>
        </div>
        <Button variant="outline" onClick={() => loadUsers()}>
          Muat Ulang
        </Button>
      </div>

      <div className="bg-secondary-bg border border-border rounded-[18px] p-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Cari email, nama, atau role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-xs bg-surface border border-border rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-accent/50 transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada pengguna"
            description="Belum ada pengguna yang terdaftar di sistem."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Nama', 'Email', 'Role', 'Status', 'Terdaftar', 'Aksi'].map((h) => (
                      <th key={h} className="font-heading text-left text-xs text-text-muted uppercase tracking-wider font-medium px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((user) => (
                    <tr key={user.id || user.public_id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-text-primary font-medium">{user.fullName}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={roleColors[user.role] || 'default'}>
                          {roleLabels[user.role] || user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={user.isActive ? 'text-success' : 'text-text-muted'}>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {user.createdAt ? formatDate(user.createdAt) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setDeleting(user);
                            setDeleteDialog(true);
                          }}
                          className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-error transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
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

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        message={`Apakah Anda yakin ingin menghapus pengguna "${deleting?.fullName}"?`}
      />
      <Toast {...toast} isOpen={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}