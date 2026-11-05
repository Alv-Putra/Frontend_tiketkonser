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

const navLinks = [
  { label: 'Beranda', href: '/', isAnchor: true, anchor: '#' },
  { label: 'Festival', href: '/festivals', isAnchor: false },
];

export default function CustomerNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
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
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Daftar</Button>
            </Link>
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
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">Masuk</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Daftar</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
