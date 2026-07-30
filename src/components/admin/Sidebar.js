'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Music, Mic2, Tag, ShoppingCart, CreditCard,
  Settings, LogOut, ChevronLeft, Menu
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Konser', icon: Music, href: '/admin/concerts' },
  { label: 'Artis', icon: Mic2, href: '/admin/artists' },
  { label: 'Kategori', icon: Tag, href: '/admin/categories' },
  { label: 'Pesanan', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Pembayaran', icon: CreditCard, href: '/admin/payments' },
  { label: 'Pengaturan', icon: Settings, href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-[12px] bg-secondary-bg border border-border flex items-center justify-center text-text-primary cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu size={18} />
      </button>

      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ width: collapsed ? 72 : 260 }}
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-0 top-0 h-full bg-secondary-bg border-r border-border z-40 hidden lg:block`}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            {!collapsed && (
              <Link href="/admin" className="text-xl font-bold">
                <span className="text-gradient">Concert</span>Hub
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
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm transition-all duration-200 ${
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

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-200`}
            >
              <LogOut size={18} />
              {!collapsed && <span>Kembali ke Website</span>}
            </Link>
          </div>
        </motion.aside>
      </AnimatePresence>

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
                <Link href="/admin" className="text-xl font-bold">
                  <span className="text-gradient">Concert</span>Hub
                </Link>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCollapsed(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm transition-all duration-200 ${
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
