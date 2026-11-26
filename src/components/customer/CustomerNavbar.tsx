'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Ticket,
  LogOut,
  User as UserIcon,
  UserCircle,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import useAuthStore from '@/stores/authStore';
import TixoLogo from '@/components/landing/TixoLogo';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Festival', href: '/festivals' },
  { label: 'Tiket Saya', href: '/my-tickets' },
  { label: 'Pusat Bantuan', href: '/help' },
];

export default function CustomerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const [settledPath, setSettledPath] = useState(pathname);
  if (settledPath !== pathname) {
    setSettledPath(pathname);
    setMenuOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#09090B]/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <TixoLogo className="shrink-0" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-heading text-[13px] transition-colors ${
                  isActive(link.href)
                    ? 'text-[#FF7A00] font-semibold'
                    : 'text-slate-400 hover:text-slate-100 font-medium'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'organizer' && (
              <Link
                href="/organizer"
                className="font-heading text-sm text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="font-heading text-sm text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-slate-800 rounded-xl text-sm text-slate-200 hover:border-[#FF4D00]/40 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FF4D00] flex items-center justify-center shrink-0">
                    <UserIcon size={13} className="text-white" />
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
                          <UserCircle size={15} />
                          Profil Saya
                        </Link>
                        <Link
                          href="/my-tickets"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                        >
                          <Ticket size={15} />
                          Tiket Saya
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 transition-colors"
                        >
                          <Ticket size={15} />
                          Riwayat Pesanan
                        </Link>
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

          <button
            className="md:hidden p-2 text-slate-200 hover:text-slate-50 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#09090B] border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-heading block py-2.5 transition-colors ${
                    isActive(link.href)
                      ? 'text-[#FF7A00] font-semibold'
                      : 'text-slate-300 hover:text-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="pt-3 mt-2 border-t border-slate-800 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-slate-300 hover:text-slate-50"
                  >
                    Profil Saya
                  </Link>
                  <Link
                    href="/my-tickets"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-slate-300 hover:text-slate-50"
                  >
                    Tiket Saya
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-slate-300 hover:text-slate-50"
                  >
                    Riwayat Pesanan
                  </Link>
                  <Button variant="danger" className="w-full mt-3" onClick={handleLogout}>
                    <LogOut size={16} />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-3">
                  <Link href="/auth/login">
                    <Button variant="secondary" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
