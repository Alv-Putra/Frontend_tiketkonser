'use client';

import { useState } from 'react';
import { RotateCw, Search, Check, ShieldCheck, UserCheck, Users } from 'lucide-react';
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import StatusBadge from '@/components/workspace/StatusBadge';
import useMonitoringStore from '@/stores/monitoringStore';

export default function AdminUsersPage() {
  const users = useMonitoringStore((state) => state.users);
  const refreshMetrics = useMonitoringStore((state) => state.refreshMetrics);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

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

  const handleRefresh = () => {
    refreshMetrics();
    alert('Data akun pengguna diperbarui.');
  };

  return (
    <WorkspaceLayout title="Pengguna & Akses">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1B1E2C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F4F5FA]">Pengguna & akses</h1>
          <p className="text-xs text-[#A7AEC3]">
            Pantau akun terdaftar dan peran pengguna dalam platform.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151824] hover:bg-[#1B1E2C] border border-[#1B1E2C] text-[#F4F5FA] text-xs font-semibold transition-all self-start md:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#A78BFA]" />
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
      <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F5FA]">Daftar pengguna</h2>
            <p className="text-xs text-[#7F89A0]">Akun sistem dan kredensial terdaftar</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
            >
              <option value="Semua">Semua peran</option>
              <option value="Admin">Admin</option>
              <option value="Organizer">Organizer</option>
              <option value="Customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1B1E2C] border border-[#2A2E40] rounded-lg px-2.5 py-1.5 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7953E8]"
            >
              <option value="Semua">Semua status</option>
              <option value="Aktif">Aktif</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7F89A0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari email, nama, atau peran pengguna..."
            className="w-full bg-[#10121C] border border-[#1B1E2C] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F5FA] placeholder-[#7F89A0] focus:outline-none focus:border-[#7953E8]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B1E2C] text-[#7F89A0] text-[10px] uppercase font-semibold">
                <th className="pb-2.5">Akun Pengguna</th>
                <th className="pb-2.5">Email</th>
                <th className="pb-2.5">Peran</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Terdaftar</th>
                <th className="pb-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1E2C]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#1B1E2C]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F4F5FA] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2A2240] text-[#A78BFA] flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 text-[#A7AEC3]">{u.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1B1E2C] text-[#F4F5FA] border border-[#2A2E40]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3 text-[#7F89A0] whitespace-nowrap">{u.registered}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Kelola akses untuk: ${u.name}`)}
                      type="button"
                      className="px-2.5 py-1 rounded bg-[#1B1E2C] hover:bg-[#2A2E40] border border-[#2A2E40] text-[11px] text-[#A78BFA] font-medium transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Explanations Section */}
      <div className="p-5 rounded-2xl bg-[#151824] border border-[#1B1E2C]">
        <h2 className="text-sm font-semibold text-[#F4F5FA] mb-1">Peran yang jelas, akses yang tepat.</h2>
        <p className="text-xs text-[#7F89A0] mb-4">Ringkasan hak akses setiap tingkatan akun pengguna dalam platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A78BFA]">Admin</span>
              <span className="text-[10px] text-[#7F89A0]">Kontrol menyeluruh</span>
            </div>
            <ul className="text-xs text-[#A7AEC3] space-y-1.5">
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

          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F1C875]">Organizer</span>
              <span className="text-[10px] text-[#7F89A0]">Fokus pada konser sendiri</span>
            </div>
            <ul className="text-xs text-[#A7AEC3] space-y-1.5">
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

          <div className="p-4 rounded-xl bg-[#1B1E2C] border border-[#2A2E40] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8DE2BD]">Customer</span>
              <span className="text-[10px] text-[#7F89A0]">Nikmati konser favorit</span>
            </div>
            <ul className="text-xs text-[#A7AEC3] space-y-1.5">
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

      <div className="text-center text-[11px] text-[#7F89A0]">
        Daftar akun sesuai referensi • Ringkasan peran untuk rancangan akses
      </div>
    </WorkspaceLayout>
  );
}
