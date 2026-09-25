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

const navLinks = [
  { label: 'Beranda', href: '/', isAnchor: true, anchor: '#' },
  { label: 'Festival', href: '/festivals', isAnchor: false },
];

export default function CustomerNavbar() {
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-primary-bg/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-black tracking-tight text-text-primary">
            Conser<span className="text-primary-accent">Id</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'organizer' && (
              <Link
                href="/organizer"
                className="font-heading text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="font-heading text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-border rounded-full text-sm text-text-primary hover:border-primary-accent/40 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <UserIcon size={13} className="text-primary-bg" />
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={menuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute right-0 mt-3 w-56 bg-secondary-bg border border-border rounded-[18px] shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                        >
                          <UserCircle size={15} />
                          Profil Saya
                        </Link>
                        <Link
                          href="/my-tickets"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                        >
                          <Ticket size={15} />
                          Tiket Saya
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                        >
                          <Ticket size={15} />
                          Riwayat Pesanan
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors cursor-pointer"
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
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Daftar</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-text-primary cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
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
            className="md:hidden bg-secondary-bg border-b border-border"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading block text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-text-primary">
                    Profil Saya
                  </Link>
                  <Link href="/my-tickets" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-text-primary">
                    Tiket Saya
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-text-primary">
                    Riwayat Pesanan
                  </Link>
                  <Button variant="danger" className="w-full" onClick={handleLogout}>
                    <LogOut size={16} />
                    Keluar
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">Masuk</Button>
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