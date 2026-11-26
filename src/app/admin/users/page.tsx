'use client';

import { useState, useEffect } from 'react';
import { RotateCw, Search, Check, ShieldCheck, UserCheck, Users } from 'lucide-react';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminUsersPage() {
  const users = useMonitoringStore((state) => state.users);
  const fetchUserData = useMonitoringStore((state) => state.fetchUserData);
  const updateUserStatus = useMonitoringStore((state) => state.updateUserStatus);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchUserData({
      role: roleFilter !== 'Semua' ? roleFilter : undefined,
    })
      .then(() => {
        if (mounted) setIsLive(true);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [fetchUserData, roleFilter]);

  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const organizerCount = users.filter((u) => u.role === 'Organizer').length;
  const customerCount = users.filter((u) => u.role === 'Customer').length;

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === 'Semua' || u.role.toLowerCase() === roleFilter.toLowerCase();

    const matchStatus =
      statusFilter === 'Semua' || u.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchRole && matchStatus;
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchUserData({
        search: search || undefined,
        role: roleFilter !== 'Semua' ? roleFilter : undefined,
      });
      setIsLive(true);
    } catch {
      // offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const nextStatus = targetUser.status !== 'Aktif';
    setUpdatingId(targetUser.id);
    try {
      await updateUserStatus(targetUser.public_id || targetUser.id, nextStatus);
    } catch {
      alert('Gagal memperbarui status pengguna');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Pengguna & akses</h1>
            {isLive ? (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-status-success/25 text-ink border border-status-success/40">
                LIVE BACKEND
              </span>
            ) : (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-blaze/10 text-blaze border border-blaze/30">
                {isLoading ? 'MEMUAT...' : 'DATABASE USERS'}
              </span>
            )}
          </div>
          <p className="text-xs text-ink/60">
            Pantau akun terdaftar dan peran pengguna langsung dari database backend.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-paper hover:bg-white border border-ink/10 text-ink text-xs font-semibold transition-all self-start md:self-auto cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-blaze ${isLoading ? 'animate-spin' : ''}`} />
          <span>Muat ulang</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Akun ditampilkan" value={users.length.toString()} subtext="Semua akun aktif" />
        <StatCard label="Admin" value={adminCount.toString()} subtext="Akses seluruh platform" />
        <StatCard label="Organizer" value={organizerCount.toString()} subtext="Akses konser milik sendiri" />
        <StatCard label="Customer" value={customerCount.toString()} subtext="Akses pelanggan" />
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-2xl bg-white border border-ink/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Daftar pengguna</h2>
            <p className="text-xs text-ink/45">Akun sistem dan kredensial terdaftar</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setIsLoading(true);
                setRoleFilter(e.target.value);
              }}
              className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
            >
              <option value="Semua">Semua peran</option>
              <option value="Admin">Admin</option>
              <option value="Organizer">Organizer</option>
              <option value="Customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-paper border border-ink/10 rounded-full px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-blaze"
            >
              <option value="Semua">Semua status</option>
              <option value="Aktif">Aktif</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari email, nama, atau peran pengguna..."
            className="w-full bg-paper border border-ink/10 rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-ink/45 focus:outline-none focus:border-blaze"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink/10 text-ink/45 text-[10px] uppercase font-semibold">
                <th className="pb-2.5">Akun Pengguna</th>
                <th className="pb-2.5">Email</th>
                <th className="pb-2.5">Peran</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Terdaftar</th>
                <th className="pb-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-ink/[0.03] transition-colors">
                  <td className="py-3 font-semibold text-ink flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blaze/10 text-blaze flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 text-ink/60">{u.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-ink/5 text-ink border border-ink/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3 text-ink/45 whitespace-nowrap">{u.registered}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u.id}
                        type="button"
                        className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                          u.status === 'Aktif'
                            ? 'bg-status-danger/25 hover:bg-status-danger/40 border-status-danger/40 text-ink'
                            : 'bg-status-success/25 hover:bg-status-success/40 border-status-success/40 text-ink'
                        }`}
                      >
                        {updatingId === u.id
                          ? 'Menyimpan...'
                          : u.status === 'Aktif'
                          ? 'Nonaktifkan'
                          : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Explanations Section */}
      <div className="p-5 rounded-2xl bg-white border border-ink/10">
        <h2 className="font-display text-base font-bold text-ink mb-1">Peran yang jelas, akses yang tepat.</h2>
        <p className="text-xs text-ink/45 mb-4">Ringkasan hak akses setiap tingkatan akun pengguna dalam platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-paper border border-ink/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blaze">Admin</span>
              <span className="text-[10px] text-ink/45">Kontrol menyeluruh</span>
            </div>
            <ul className="text-xs text-ink/60 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Kelola konser, artis, dan kategori</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Verifikasi pembayaran</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Tinjau pengajuan organizer</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-paper border border-ink/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Organizer</span>
              <span className="text-[10px] text-ink/45">Fokus pada konser sendiri</span>
            </div>
            <ul className="text-xs text-ink/60 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Pantau penjualan dan kuota</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Kelola konser milik sendiri</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Lihat laporan operasional</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-paper border border-ink/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Customer</span>
              <span className="text-[10px] text-ink/45">Nikmati konser favorit</span>
            </div>
            <ul className="text-xs text-ink/60 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Jelajahi dan pilih konser</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Pesan tiket dan bayar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-ink shrink-0" />
                <span>Lihat riwayat dan e-ticket</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-ink/45">
        Daftar akun sesuai referensi • Ringkasan peran untuk rancangan akses
      </div>
    </>
  );
}
