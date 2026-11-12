'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Download,
  Smartphone,
  Apple,
  PlayCircle,
  ExternalLink,
  Ticket,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import useAuthStore from '@/stores/authStore';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Festival', href: '/festivals' },
  { label: 'Tiket Saya', href: '/my-tickets' },
  { label: 'Pusat Bantuan', href: '/help' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Close menus on route change (state adjusted during render, no effect needed)
  const [settledPath, setSettledPath] = useState(pathname);
  if (settledPath !== pathname) {
    setSettledPath(pathname);
    setMobileOpen(false);
    setMenuOpen(false);
  }

  // Handle escape key to close download modal or menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (downloadModalOpen) setDownloadModalOpen(false);
        if (menuOpen) setMenuOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [downloadModalOpen, menuOpen, mobileOpen]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/85 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-black tracking-tight text-slate-50">
                Conser<span className="text-gradient">Id</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? 'text-violet-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-slate-800 rounded-xl text-sm text-slate-200 hover:border-violet-500/40 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                      <User size={13} className="text-white" />
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown
                      size={14}
                      className={menuOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
                    />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute right-0 mt-3 w-56 bg-secondary-bg border border-slate-800 rounded-2xl shadow-xl shadow-black/40 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-sm font-semibold text-slate-50 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                          >
                            <User size={15} />
                            Profil Saya
                          </Link>
                          <Link
                            href="/my-tickets"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                          >
                            <Ticket size={15} />
                            Tiket Saya
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                            >
                              <LayoutDashboard size={15} />
                              Dashboard Admin
                            </Link>
                          )}
                          {user?.role === 'organizer' && (
                            <Link
                              href="/organizer"
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                            >
                              <LayoutDashboard size={15} />
                              Dashboard Organizer
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <LogOut size={15} />
                            Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="secondary" size="sm" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="w-full">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-200 hover:text-slate-50 transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-[#0B0F19] border-b border-slate-800 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2.5 text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-violet-400 font-semibold'
                        : 'text-slate-300 hover:text-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 mt-3 border-t border-slate-800 space-y-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setDownloadModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 font-medium text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Download size={18} />
                    Download App
                  </button>

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-medium text-sm hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                    >
                      <LogOut size={18} />
                      Keluar
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <Link href="/auth/login" className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="flex-1">
                        <Button size="sm" className="w-full">
                          Daftar
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Download App Modal */}
      <AnimatePresence>
        {downloadModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDownloadModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md px-4"
            >
              <div className="bg-secondary-bg border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="relative bg-violet-600 p-6 text-center">
                  <button
                    onClick={() => setDownloadModalOpen(false)}
                    aria-label="Tutup"
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone size={32} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Download Aplikasi ConserId
                  </h2>
                  <p className="text-white/80 text-sm">
                    Nikmati pengalaman beli tiket yang lebih mudah di aplikasi mobile kami
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* App Store Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between w-full bg-slate-800/80 border border-slate-700 text-white py-3 px-5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Apple size={24} className="text-slate-100" />
                        <div className="text-left">
                          <div className="text-xs text-slate-400">Tersedia di</div>
                          <div className="text-sm font-semibold">App Store</div>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30">
                        Segera Hadir
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full bg-slate-800/80 border border-slate-700 text-white py-3 px-5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <PlayCircle size={24} className="text-slate-100" />
                        <div className="text-left">
                          <div className="text-xs text-slate-400">Tersedia di</div>
                          <div className="text-sm font-semibold">Google Play</div>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30">
                        Segera Hadir
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="text-sm text-slate-500">atau scan QR Code</span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl">
                      <div className="w-32 h-32 bg-slate-200 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                          <Smartphone size={40} className="text-slate-500 mx-auto mb-2" />
                          <span className="text-xs text-slate-500">QR Code</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <p className="text-center text-sm text-slate-500">
                    Scan QR code dengan kamera smartphone Anda
                  </p>

                  {/* Coming Soon Badge */}
                  <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                    <span className="px-3 py-1 bg-pink-500/15 text-pink-400 text-xs font-semibold rounded-full border border-pink-500/30">
                      Segera Hadir
                    </span>
                    <span className="text-xs text-slate-500">
                      <ExternalLink size={12} className="inline mr-1" />
                      Available on iOS &amp; Android
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
