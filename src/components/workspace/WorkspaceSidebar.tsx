'use client';

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, MotionConfig, m } from 'framer-motion';
import {
  Bell, CalendarDays, ChartNoAxesColumn, ChevronsLeft, CreditCard, LayoutDashboard, LogOut, Map, Mic, Music, Receipt,
  ScanLine, Settings, ShieldCheck, ShoppingBag, Ticket, TicketPercent, Users, UsersRound, Wallet, type LucideIcon,
} from 'lucide-react';
import MotionProvider from '@/components/landing/MotionProvider';
import useAuthStore from '@/stores/authStore';


type NavItem = { label: string; icon: LucideIcon; href: string; badge?: number; soon?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: 'spring', stiffness: 420, damping: 36 } as const;

// Tiap halaman me-mount ulang sidebar; state disimpan di sini agar tidak reset saat pindah halaman.
const memory = { collapsed: false, ready: false };

export default function WorkspaceSidebar() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(memory.collapsed);
  const [tip, setTip] = useState<{ label: string; top: number; left: number } | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const isOrganizer = pathname.startsWith('/organizer');

  const isActive = (href: string) =>
    pathname === href ||
    (href === '/organizer/concerts' && (pathname.startsWith('/organizer/concerts') || pathname.startsWith('/organizer/festivals')));

  // Menu bertanda soon belum punya endpoint di backend.
  const groups: NavGroup[] = isOrganizer ? [
    { title: 'Ikhtisar', items: [
      { label: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
      { label: 'Notifikasi', href: '/organizer/notifications', icon: Bell },
    ] },
    { title: 'Kelola event', items: [
      { label: 'Event saya', href: '/organizer/concerts', icon: CalendarDays },
      { label: 'Venue & denah kursi', href: '/organizer/seat-map', icon: Map },
      { label: 'Kelas tiket', href: '/organizer/categories', icon: Ticket },
      { label: 'Peserta', href: '/organizer/attendees', icon: Users, soon: true },
      { label: 'Check-in', href: '/organizer/checkin', icon: ScanLine },
    ] },
    { title: 'Bisnis', items: [
      { label: 'Analitik', href: '/organizer/sales', icon: ChartNoAxesColumn },
      { label: 'Keuangan', href: '/organizer/finance', icon: Wallet, soon: true },
      { label: 'Transaksi', href: '/organizer/transactions', icon: Receipt, soon: true },
      { label: 'Promosi', href: '/organizer/promotions', icon: TicketPercent, soon: true },
    ] },
    { title: 'Organisasi', items: [
      { label: 'Tim', href: '/organizer/team', icon: UsersRound, soon: true },
      { label: 'Peran & izin', href: '/organizer/roles', icon: ShieldCheck, soon: true },
      { label: 'Pengaturan', href: '/organizer/settings', icon: Settings },
    ] },
  ] : [
    { title: 'Menu', items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }] },
    { title: 'Kelola', items: [
      { label: 'Konser', href: '/admin/concerts', icon: Music },
      { label: 'Artis', href: '/admin/artists', icon: Mic },
      { label: 'Kategori tiket', href: '/admin/categories', icon: Ticket },
      { label: 'Persetujuan', href: '/admin/approvals', icon: ShieldCheck },
      { label: 'Pengguna', href: '/admin/users', icon: Users },
    ] },
    { title: 'Transaksi', items: [
      { label: 'Pesanan', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Pembayaran', href: '/admin/payments', icon: CreditCard },
    ] },
  ];
  const settings: NavItem = { label: 'Pengaturan', href: '/admin/settings', icon: Settings };

  // Mobile mulai ringkas.
  useEffect(() => {
    if (memory.ready) return;
    memory.ready = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- baca lebar layar setelah hydrate
    if (window.innerWidth < 768) setCollapsed(true);
  }, []);

  useEffect(() => { memory.collapsed = collapsed; }, [collapsed]);

  const showTip = (label: string) => (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (!collapsed || !root.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTip({ label, top: rect.top + rect.height / 2, left: root.current.getBoundingClientRect().right + 10 });
  };
  const tipProps = (label: string) => ({ onMouseEnter: showTip(label), onFocus: showTip(label), onMouseLeave: () => setTip(null), onBlur: () => setTip(null) });
  const logoutUser = async () => { await logout(); router.push(isOrganizer ? '/organizer/login' : '/admin/login'); };

  const rowClass = (active: boolean) =>
    `relative isolate flex h-10 items-center gap-3 rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blaze ${collapsed ? 'justify-center' : 'px-3'} ${active ? 'text-ink' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'}`;

  const navLink = ({ label, href, icon: Icon, badge, soon }: NavItem) => {
    const active = isActive(href);
    if (soon) {
      return (
        <span aria-disabled="true" aria-label={`${label}, segera hadir`} tabIndex={collapsed ? 0 : undefined} className={`${rowClass(false)} cursor-not-allowed text-ink/35 hover:bg-transparent hover:text-ink/35`} {...tipProps(`${label} (segera)`)}>
          <Icon aria-hidden="true" className="size-4.5 shrink-0" strokeWidth={1.8} />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
          {!collapsed && <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-ink/55">Segera</span>}
        </span>
      );
    }
    return (
      <Link href={href} aria-label={collapsed ? label : undefined} aria-current={active ? 'page' : undefined} className={rowClass(active)} {...tipProps(label)}>
        {active && <m.span layoutId="sidebar-active" transition={spring} className="absolute inset-0 -z-10 rounded-xl bg-blaze shadow-sm shadow-blaze/30" />}
        <span className="relative grid size-5 shrink-0 place-items-center">
          <Icon className="size-4.5" strokeWidth={active ? 2.4 : 1.8} />
          {collapsed && badge ? <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-blaze text-[9px] font-bold text-ink">{badge}</span> : null}
        </span>
        {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
        {!collapsed && badge ? <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blaze text-[10px] font-bold text-ink">{badge}</span> : null}
      </Link>
    );
  };

  return (
    <MotionProvider>
      <MotionConfig reducedMotion="user">
        <m.aside
          ref={root}
          aria-label="Navigasi workspace"
          initial={false}
          animate={{ width: collapsed ? 76 : 256 }}
          transition={{ duration: 0.35, ease }}
          className="relative z-20 flex h-full shrink-0 flex-col overflow-hidden border-r border-ink/10 bg-white font-body"
        >
          <div className={`flex h-16 shrink-0 items-center border-b border-ink/10 ${collapsed ? 'flex-col justify-center' : 'justify-between px-5'}`}>
            <Link href="/" aria-label="Tixo, kembali ke beranda" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blaze text-ink"><Ticket className="size-4" strokeWidth={2.5} /></span>
              {!collapsed && <span className="font-display text-lg font-extrabold tracking-tight text-ink">TIXO{isOrganizer && <span className="ml-1.5 text-xs font-bold tracking-wide text-ink/50">ORGANIZER</span>}</span>}
            </Link>
            {!collapsed && <ToggleButton collapsed={collapsed} onClick={() => setCollapsed(true)} />}
          </div>
          {collapsed && <div className="flex justify-center pt-3"><ToggleButton collapsed={collapsed} onClick={() => { setCollapsed(false); setTip(null); }} /></div>}

          <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 py-4">
            {groups.map((group) => (
              <div key={group.title}>
                {collapsed
                  ? <div className="mx-2 mb-2 h-px bg-ink/5" />
                  : <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">{group.title}</p>}
                <ul className="space-y-1">
                  {group.items.map((item) => <li key={item.href}>{navLink(item)}</li>)}
                </ul>
              </div>
            ))}
          </nav>

          <div className="shrink-0 space-y-1 border-t border-ink/10 px-3 py-3">
            {!isOrganizer && navLink(settings)}
            <button type="button" onClick={logoutUser} aria-label={collapsed ? 'Keluar' : undefined} className={`${rowClass(false)} w-full hover:text-ink`} {...tipProps('Keluar')}>
              <LogOut className="size-4.5 shrink-0" strokeWidth={1.8} />
              {!collapsed && <span className="flex-1 text-left">Keluar</span>}
            </button>
          </div>
        </m.aside>

        <AnimatePresence>
          {tip && (
            <m.div
              key={tip.label}
              role="tooltip"
              initial={{ opacity: 0, x: -6, y: '-50%' }}
              animate={{ opacity: 1, x: 0, y: '-50%' }}
              exit={{ opacity: 0, x: -6, y: '-50%' }}
              transition={{ duration: 0.15, ease }}
              style={{ top: tip.top, left: tip.left }}
              className="pointer-events-none fixed z-50 rounded-lg border border-ink/10 bg-white px-3 py-1.5 font-body text-xs font-semibold text-ink shadow-lg"
            >
              {tip.label}
            </m.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </MotionProvider>
  );
}

function ToggleButton({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? 'Buka sidebar' : 'Ringkas sidebar'}
      aria-expanded={!collapsed}
      className="grid size-8 place-items-center rounded-lg text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-blaze"
    >
      <ChevronsLeft className={`size-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
    </button>
  );
}
