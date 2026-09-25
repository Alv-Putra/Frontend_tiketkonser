'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Music, QrCode, LogOut, ChevronLeft, Menu, ListChecks
} from 'lucide-react';
import useAuthStore from '@/stores/authStore';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/organizer' },
  { label: 'Festival Saya', icon: Music, href: '/organizer/festivals' },
  { label: 'Check-in Tiket', icon: QrCode, href: '/organizer/checkin' },
  { label: 'Penjualan', icon: ListChecks, href: '/organizer/sales' },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-[12px] bg-secondary-bg border border-border flex items-center justify-center text-text-primary cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu size={18} />
      </button>

      <motion.aside
        initial={{ width: collapsed ? 72 : 260 }}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-secondary-bg border-r border-border z-40 hidden lg:block"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          {!collapsed && (
            <Link href="/organizer" className="text-xl font-black tracking-tight text-text-primary">
              Conser<span className="text-primary-accent">Id</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-[12px] hover:bg-surface text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/organizer' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-heading flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-accent/10 text-primary-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className={`font-heading flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-200`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Kembali ke Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="font-heading w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-error hover:bg-error/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setCollapsed(false)} />
            <div className="relative w-64 h-full bg-secondary-bg border-r border-border p-5">
              <div className="flex items-center justify-between mb-8">
                <Link href="/organizer" className="text-xl font-black tracking-tight text-text-primary">
                  Conser<span className="text-primary-accent">Id</span>
                </Link>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/organizer' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCollapsed(false)}
                      className={`font-heading flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-accent/10 text-primary-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}