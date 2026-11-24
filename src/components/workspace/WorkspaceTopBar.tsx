'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, LogOut, Search } from 'lucide-react';
import useMonitoringStore from '@/stores/monitoringStore';
import useAuthStore from '@/stores/authStore';
import WorkspaceNotifications from './WorkspaceNotifications';

export default function WorkspaceTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchQuery = useMonitoringStore((state) => state.searchQuery);
  const setSearchQuery = useMonitoringStore((state) => state.setSearchQuery);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileButton = useRef<HTMLButtonElement>(null);

  const isOrganizer = pathname.startsWith('/organizer');
  const roleLabel = isOrganizer ? 'Organizer' : 'Admin';
  const name = user?.name || user?.full_name || roleLabel;
  const profileAction = 'flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-blaze';

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.push(isOrganizer ? '/auth/login' : '/admin/login');
  };

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-ink/10 bg-paper px-4 lg:px-8">
      <span className="min-w-0 truncate text-sm font-semibold md:hidden">{roleLabel}</span>
      <div className="relative hidden w-72 md:block lg:w-96">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/60" />
        <input
          type="search"
          name="workspace-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari di workspace…"
          aria-label="Cari di workspace"
          className="min-h-11 w-full rounded-xl border border-ink/10 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink/65 focus-visible:outline-2 focus-visible:outline-blaze"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <WorkspaceNotifications />
        <div
          className="relative"
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProfileOpen(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && profileOpen) {
              setProfileOpen(false);
              profileButton.current?.focus();
            }
          }}
        >
          <button ref={profileButton} type="button" aria-expanded={profileOpen} aria-controls="workspace-profile" aria-label="Menu profil" onClick={() => setProfileOpen(!profileOpen)} className="flex min-h-11 items-center gap-2 rounded-xl border border-ink/10 bg-white px-2 text-left hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-lg bg-paper text-xs font-bold uppercase">{name[0]}</span>
            <span className="hidden max-w-36 sm:block">
              <span className="block truncate text-xs font-semibold">{name}</span>
              <span className="block text-xs text-ink/70">{roleLabel}</span>
            </span>
            <ChevronDown aria-hidden="true" className="size-4 text-ink/60" />
          </button>
          <div id="workspace-profile" hidden={!profileOpen} className="absolute right-0 mt-2 w-44 rounded-xl border border-ink/10 bg-white p-2 shadow-md">
            <Link href="/" className={profileAction}>Lihat beranda <ArrowRight aria-hidden="true" className="size-4" /></Link>
            <button type="button" onClick={handleLogout} className={profileAction}>Keluar akun <LogOut aria-hidden="true" className="size-4" /></button>
          </div>
        </div>
      </div>
    </header>
  );
}
