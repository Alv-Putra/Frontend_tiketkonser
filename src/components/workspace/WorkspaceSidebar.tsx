'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ticket,
  LayoutDashboard,
  Music,
  Mic,
  ShieldCheck,
  Users,
  ShoppingBag,
  CreditCard,
  Settings,
  ExternalLink,
  ChevronDown,
  ArrowLeft,
  QrCode,
  ListChecks
} from 'lucide-react';
import useMonitoringStore from '@/stores/monitoringStore';

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const workspace = useMonitoringStore((state) => state.workspace);
  const setWorkspace = useMonitoringStore((state) => state.setWorkspace);
  const payments = useMonitoringStore((state) => state.payments);

  const pendingPaymentsCount = payments.filter((p) => p.status === 'Perlu verifikasi').length;

  const isOrganizer = pathname.startsWith('/organizer') || workspace === 'organizer';

  const handleRoleToggle = () => {
    if (isOrganizer) {
      setWorkspace('admin');
      router.push('/admin');
    } else {
      setWorkspace('organizer');
      router.push('/organizer');
    }
  };

  const navItems = isOrganizer
    ? [
        {
          label: 'Dashboard',
          href: '/organizer',
          icon: LayoutDashboard,
          active: pathname === '/organizer'
        },
        {
          label: 'Konser saya',
          href: '/organizer/concerts',
          icon: Music,
          active: pathname.includes('/organizer/concerts') || pathname.includes('/organizer/festivals')
        },
        {
          label: 'Check-in tiket',
          href: '/organizer/checkin',
          icon: QrCode,
          active: pathname === '/organizer/checkin'
        },
        {
          label: 'Laporan penjualan',
          href: '/organizer/sales',
          icon: ListChecks,
          active: pathname === '/organizer/sales'
        },
        {
          label: 'Kategori tiket',
          href: '/organizer/categories',
          icon: Ticket,
          active: pathname === '/organizer/categories'
        },
        {
          label: 'Pesanan tiket',
          href: '/organizer/orders',
          icon: ShoppingBag,
          active: pathname === '/organizer/orders'
        },
        {
          label: 'Pengaturan kuota',
          href: '/organizer/settings',
          icon: Settings,
          active: pathname === '/organizer/settings'
        }
      ]
    : [
        {
          label: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
          active: pathname === '/admin'
        },
        {
          label: 'Konser',
          href: '/admin/concerts',
          icon: Music,
          active: pathname === '/admin/concerts'
        },
        {
          label: 'Artis',
          href: '/admin/artists',
          icon: Mic,
          active: pathname === '/admin/artists'
        },
        {
          label: 'Kategori tiket',
          href: '/admin/categories',
          icon: Ticket,
          active: pathname === '/admin/categories'
        },
        {
          label: 'Persetujuan',
          href: '/admin/approvals',
          icon: ShieldCheck,
          active: pathname === '/admin/approvals'
        },
        {
          label: 'Pengguna',
          href: '/admin/users',
          icon: Users,
          active: pathname === '/admin/users'
        },
        {
          label: 'Pesanan',
          href: '/admin/orders',
          icon: ShoppingBag,
          active: pathname === '/admin/orders'
        },
        {
          label: 'Pembayaran',
          href: '/admin/payments',
          icon: CreditCard,
          active: pathname === '/admin/payments',
          badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null
        },
        {
          label: 'Pengaturan',
          href: '/admin/settings',
          icon: Settings,
          active: pathname === '/admin/settings'
        }
      ];

  return (
    <aside className="w-64 lg:w-72 bg-[#0F0F12] border-r border-[#27272A] flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2A1000] border border-[#4A1D00] flex items-center justify-center text-[#FF7A00]">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">Conser</span>
              <span className="text-xl font-bold text-[#FF7A00]">Id</span>
            </div>
          </Link>
        </div>

        {/* Workspace Switcher */}
        <div className="p-4 border-b border-[#27272A]">
          <button
            onClick={handleRoleToggle}
            type="button"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141417] hover:bg-[#27272A] border border-[#27272A] transition-colors text-left cursor-pointer"
          >
            <div>
              <div className="text-xs font-semibold text-[#FFFFFF]">
                {isOrganizer ? 'Organizer workspace' : 'Admin workspace'}
              </div>
              <div className="text-xs text-[#A1A1AA] truncate max-w-[170px]">
                {isOrganizer ? 'Java Festival Production' : 'Kelola seluruh platform'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#A1A1AA] shrink-0 ml-2" />
          </button>
        </div>

        {/* Workspace Nav Items */}
        <div className="px-3 py-4">
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-[#71717A] uppercase">
            {isOrganizer ? 'Organizer Menu' : 'Workspace'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-[#2A1000] text-[#FF7A00] font-semibold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#141417]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-[#FF7A00]' : 'text-[#71717A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#332B1B] text-[#F1C875]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Back Link */}
      <div className="p-4 border-t border-[#27272A] space-y-3">
        {/* Help box */}
        <div className="p-3.5 rounded-xl bg-[#141417] border border-[#27272A]">
          <div className="text-xs font-semibold text-[#FFFFFF] mb-1">Butuh bantuan?</div>
          <div className="text-xs text-[#A1A1AA] mb-2.5">Panduan mengelola konser</div>
          <a
            href="#bantuan"
            onClick={(e) => {
              e.preventDefault();
              alert('Pusat Bantuan ConserId: Hubungi tim operasional di support@conserid.com atau hotline 24/7.');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#FF7A00] hover:text-[#FFD9BF] font-medium"
          >
            <span>Buka pusat bantuan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Back to website button */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#141417] border border-transparent hover:border-[#27272A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke website</span>
        </Link>

        <div className="text-center text-[11px] text-[#71717A]">ConserId © 2026</div>
      </div>
    </aside>
  );
}
