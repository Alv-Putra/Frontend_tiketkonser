'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Music, QrCode, ChevronLeft, Menu, ListChecks
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/organizer' },
  { label: 'Festival Saya', icon: Music, href: '/organizer/festivals' },
  { label: 'Check-in Tiket', icon: QrCode, href: '/organizer/checkin' },
  { label: 'Penjualan', icon: ListChecks, href: '/organizer/sales' },
];

export default function OrganizerSidebar() {
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

      <aside className="fixed left-0 top-0 h-full bg-secondary-bg border-r border-border z-40 hidden lg:block">
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
            <QrCode size={18} />
            {!collapsed && <span>Kembali ke Website</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
