'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Save,
  Camera,
  CheckCircle,
  Edit3,
  KeyRound,
  Smartphone,
  LogOut,
  Ticket,
  ClipboardList,
  Lock,
  FileText,
  ScrollText,
} from 'lucide-react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import useAuthStore from '@/stores/authStore';
import { validateName } from '@/lib/validators';

const roleLabels = {
  admin: 'Admin',
  organizer: 'Organizer',
  customer: 'Customer',
  buyer: 'Customer',
};

const roleDescriptions = {
  Admin: 'Akses penuh ke semua fitur platform',
  Organizer: 'Dapat membuat dan mengelola event',
  Customer: 'Dapat membeli tiket dan melihat e-ticket',
};

const menuItems = [
  { label: 'Tiket Saya', href: '/my-tickets', icon: Ticket, accent: 'text-violet-400 bg-violet-600/15' },
  { label: 'Riwayat Pesanan', href: '/orders', icon: ClipboardList, accent: 'text-emerald-400 bg-emerald-500/15' },
  { label: 'Kebijakan Privasi', href: '/privacy', icon: Lock, accent: 'text-cyan-400 bg-cyan-500/15' },
  { label: 'Syarat & Ketentuan', href: '/terms', icon: ScrollText, accent: 'text-amber-400 bg-amber-500/15' },
];

const TABS = [
  { id: 'account', label: 'Data Akun' },
  { id: 'security', label: 'Keamanan' },
];

function ProfileContent() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [fullName, setFullName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('account');
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(fullName);
    if (nameError) {
      setError(nameError);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await updateProfile({ name: fullName, full_name: fullName });
      setToast({ isOpen: true, type: 'success', message: 'Profil berhasil diperbarui' });
      setIsEditing(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: error.message || 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mb-2">
            Profil Saya
          </h1>
          <p className="text-slate-400">Kelola informasi akun Anda.</p>
        </motion.div>

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0">
                <Avatar name={user?.name || 'User'} size="2xl" />
                <button
                  type="button"
                  aria-label="Ubah foto profil"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0F172A] border border-slate-700 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-50 truncate">{user?.name || '-'}</h2>
                <p className="text-sm text-slate-400 truncate flex items-center gap-2">
                  <Mail size={14} className="text-slate-500 shrink-0" />
                  {user?.email || '-'}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/15 text-violet-400 border border-violet-500/30 rounded-full text-xs font-medium">
                    <ShieldCheck size={12} />
                    {roleLabels[user?.role] || user?.role || '-'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium">
                    <CheckCircle size={12} />
                    Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <p className="text-xs text-slate-500 mb-1">Anggota sejak</p>
              <p className="text-sm font-semibold text-slate-50">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                  : 'Baru'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-[#111827] border border-slate-800 p-1 mb-6">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === item.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {tab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-50">Data Akun</h2>
                    <p className="text-sm text-slate-500">Perbarui informasi dasar akun kamu.</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 size={16} />
                    {isEditing ? 'Batal' : 'Edit'}
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Nama Lengkap"
                      name="fullName"
                      type="text"
                      placeholder="Nama kamu"
                      icon={UserIcon}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={error}
                      autoComplete="name"
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      icon={Mail}
                      value={user?.email || ''}
                      disabled
                    />
                  </div>

                  {/* Role Display */}
                  <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-600/15 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={20} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-50">Role Akun</p>
                        <p className="text-xs text-slate-500">
                          {roleDescriptions[roleLabels[user?.role]] || 'Role tidak dikenali'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2"
                    >
                      <Button type="submit" size="lg" className="w-full" disabled={saving}>
                        {saving ? (
                          'Menyimpan...'
                        ) : (
                          <>
                            <Save size={16} />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-slate-50 mb-1">Keamanan Akun</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Lindungi akun kamu dengan cara login tambahan.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-violet-600/15 flex items-center justify-center shrink-0">
                        <KeyRound size={16} className="text-violet-400" />
                      </span>
                      <span className="text-sm text-slate-100 truncate">Ubah Password</span>
                    </div>
                    <span className="text-slate-500 text-sm shrink-0">→</span>
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                        <Smartphone size={16} className="text-cyan-400" />
                      </span>
                      <span className="text-sm text-slate-100 truncate">Verifikasi 2FA</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full shrink-0">
                      Tersedia
                    </span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <Button variant="danger" className="w-full">
                    <LogOut size={16} />
                    Keluar
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-50 mb-4">Menu Cepat</h3>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-colors group"
                    >
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.accent}`}>
                        <Icon size={16} />
                      </span>
                      <span className="text-sm text-slate-100 group-hover:text-violet-400 transition-colors truncate">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-50 mb-4">Dokumen Legal</h3>
              <div className="space-y-2">
                <a
                  href="/privacy"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-cyan-400" />
                  </span>
                  <span className="text-sm text-slate-100 group-hover:text-violet-400 transition-colors truncate">
                    Kebijakan Privasi
                  </span>
                </a>
                <a
                  href="/help"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-pink-500/15 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-pink-400" />
                  </span>
                  <span className="text-sm text-slate-100 group-hover:text-violet-400 transition-colors truncate">
                    Pusat Bantuan
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </CustomerLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
