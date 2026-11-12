'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Music, Mic2, Tag, ShoppingCart, CreditCard,
  Settings, LogOut, ChevronLeft, Menu, ShieldCheck, Users as UsersIcon
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Konser', icon: Music, href: '/admin/concerts' },
  { label: 'Artis', icon: Mic2, href: '/admin/artists' },
  { label: 'Kategori', icon: Tag, href: '/admin/categories' },
  { label: 'Persetujuan', icon: ShieldCheck, href: '/admin/approvals' },
  { label: 'Pengguna', icon: UsersIcon, href: '/admin/users' },
  { label: 'Pesanan', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Pembayaran', icon: CreditCard, href: '/admin/payments' },
  { label: 'Pengaturan', icon: Settings, href: '/admin/settings' },
];

const navItemClass = (isActive) =>
  `font-heading flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 border ${
    isActive
      ? 'bg-violet-600/15 text-violet-400 border-violet-500/30'
      : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/80 border-transparent'
  }`;

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        aria-label="Buka menu navigasi"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen shrink-0 flex-col bg-[#111827] border-r border-slate-800 overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          {!collapsed && (
            <Link href="/admin" className="text-xl font-black tracking-tight text-slate-50">
              Conser<span className="text-violet-400">Id</span>
            </Link>
          )}
          <button
            type="button"
            aria-label="Ciutkan sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={navItemClass(isActive)}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <Link
            href="/"
            title={collapsed ? 'Kembali ke Website' : undefined}
            className="font-heading flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-400 hover:text-slate-50 hover:bg-slate-800/80 border border-transparent transition-all duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">Kembali ke Website</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative w-64 h-full bg-[#111827] border-r border-slate-800 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-black tracking-tight text-slate-50"
                >
                  Conser<span className="text-violet-400">Id</span>
                </Link>
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              <nav className="p-3 space-y-1 flex-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={navItemClass(isActive)}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-slate-800">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-heading flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-400 hover:text-slate-50 hover:bg-slate-800/80 border border-transparent transition-all duration-200"
                >
                  <LogOut size={18} className="shrink-0" />
                  <span className="truncate">Kembali ke Website</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
