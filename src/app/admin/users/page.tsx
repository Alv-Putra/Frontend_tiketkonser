'use client';

import { useState, useEffect } from 'react';
import { RotateCw, Search, Check, ShieldCheck, UserCheck, Users } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
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
    <WorkspaceLayout title="Pengguna & Akses">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Pengguna & akses</h1>
            {isLive ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#193029] text-[#8DE2BD] border border-[#234B3E]">
                LIVE BACKEND
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2A1000] text-[#FF7A00] border border-[#4A1D00]">
                {isLoading ? 'MEMUAT...' : 'DATABASE USERS'}
              </span>
            )}
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Pantau akun terdaftar dan peran pengguna langsung dari database backend.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141417] hover:bg-[#27272A] border border-[#27272A] text-[#FFFFFF] text-xs font-semibold transition-all self-start md:self-auto cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#FF7A00] ${isLoading ? 'animate-spin' : ''}`} />
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
      <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#FFFFFF]">Daftar pengguna</h2>
            <p className="text-xs text-[#71717A]">Akun sistem dan kredensial terdaftar</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setIsLoading(true);
                setRoleFilter(e.target.value);
              }}
              className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
            >
              <option value="Semua">Semua peran</option>
              <option value="Admin">Admin</option>
              <option value="Organizer">Organizer</option>
              <option value="Customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF4D00]"
            >
              <option value="Semua">Semua status</option>
              <option value="Aktif">Aktif</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari email, nama, atau peran pengguna..."
            className="w-full bg-[#0F0F12] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:border-[#FF4D00]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] text-[#71717A] text-[10px] uppercase font-semibold">
                <th className="pb-2.5">Akun Pengguna</th>
                <th className="pb-2.5">Email</th>
                <th className="pb-2.5">Peran</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Terdaftar</th>
                <th className="pb-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#27272A]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#FFFFFF] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2A1000] text-[#FF7A00] flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 text-[#A1A1AA]">{u.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#27272A] text-[#FFFFFF] border border-[#3F3F46]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3 text-[#71717A] whitespace-nowrap">{u.registered}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u.id}
                        type="button"
                        className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                          u.status === 'Aktif'
                            ? 'bg-[#2A1D24] hover:bg-[#3D2531] border-[#4A2635] text-[#FFA4B8]'
                            : 'bg-[#193029] hover:bg-[#234B3E] border-[#2E5C4E] text-[#8DE2BD]'
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
      <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272A]">
        <h2 className="text-sm font-semibold text-[#FFFFFF] mb-1">Peran yang jelas, akses yang tepat.</h2>
        <p className="text-xs text-[#71717A] mb-4">Ringkasan hak akses setiap tingkatan akun pengguna dalam platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#27272A] border border-[#3F3F46] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FF7A00]">Admin</span>
              <span className="text-[10px] text-[#71717A]">Kontrol menyeluruh</span>
            </div>
            <ul className="text-xs text-[#A1A1AA] space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Kelola konser, artis, dan kategori</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Verifikasi pembayaran</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Tinjau pengajuan organizer</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#27272A] border border-[#3F3F46] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F1C875]">Organizer</span>
              <span className="text-[10px] text-[#71717A]">Fokus pada konser sendiri</span>
            </div>
            <ul className="text-xs text-[#A1A1AA] space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Pantau penjualan dan kuota</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Kelola konser milik sendiri</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Lihat laporan operasional</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#27272A] border border-[#3F3F46] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8DE2BD]">Customer</span>
              <span className="text-[10px] text-[#71717A]">Nikmati konser favorit</span>
            </div>
            <ul className="text-xs text-[#A1A1AA] space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Jelajahi dan pilih konser</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Pesan tiket dan bayar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8DE2BD] shrink-0" />
                <span>Lihat riwayat dan e-ticket</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#71717A]">
        Daftar akun sesuai referensi • Ringkasan peran untuk rancangan akses
      </div>
    </WorkspaceLayout>
  );
}
