'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Bell } from 'lucide-react';
import MotionProvider from '@/components/landing/MotionProvider';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchWorkspaceNotifications } from '@/services/dashboardService';
import { useThemeStore } from '@/stores/themeStore';
import { ease, RefreshButton } from './DashboardKit';

function NotificationList({ isDark }: { isDark: boolean }) {
  const { data, status, refresh } = useDashboardData(fetchWorkspaceNotifications);
  return (
    <>
      <h2 className={`mb-3 font-display text-base font-bold ${isDark ? 'text-white' : 'text-ink'}`}>Notifikasi terbaru</h2>
      {status === 'loading' && !data && <p role="status" className={`text-sm ${isDark ? 'text-mute' : 'text-ink/60'}`}>Memuat notifikasi…</p>}
      {status === 'error' && (
        <div className="space-y-2">
          <p role="alert" className={`text-sm ${isDark ? 'text-mute' : 'text-ink/60'}`}>Notifikasi gagal dimuat.</p>
          <RefreshButton loading={false} refresh={refresh} />
        </div>
      )}
      {data && (
        data.data.length ? (
          <ul className={`divide-y ${isDark ? 'divide-line' : 'divide-ink/10'}`}>
            {data.data.map((item) => (
              <li key={item.id} className="break-words py-2">
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-ink'}`}>{item.title}</p>
                {item.message && <p className={`mt-1 text-sm ${isDark ? 'text-mute' : 'text-ink/65'}`}>{item.message}</p>}
              </li>
            ))}
          </ul>
        ) : <p className={`text-sm ${isDark ? 'text-mute' : 'text-ink/60'}`}>Belum ada notifikasi.</p>
      )}
    </>
  );
}

function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const workspaceTheme = useThemeStore((state) => state.workspaceTheme);
  const isDark = workspaceTheme === 'dark';

  return (
    <div
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label="Notifikasi"
        onClick={() => setOpen(!open)}
        className={`grid size-11 place-items-center rounded-xl border transition-colors hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze ${
          isDark
            ? 'border-line bg-onyx text-white'
            : 'border-ink/10 bg-white text-ink shadow-xs'
        }`}
      >
        <Bell aria-hidden="true" className={`size-4 ${isDark ? 'text-mute' : 'text-ink/60'}`} />
      </button>
      <div id={id}>
        <AnimatePresence>
          {open && (
            <m.div
              initial={reduced ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2, ease }}
              className={`absolute inset-x-4 top-full mt-2 ml-auto max-h-80 max-w-80 overflow-auto rounded-2xl border p-4 shadow-xl lg:right-8 ${
                isDark
                  ? 'border-line bg-onyx text-white'
                  : 'border-ink/10 bg-white text-ink shadow-xl'
              }`}
            >
              <NotificationList isDark={isDark} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function WorkspaceNotifications() {
  return <MotionProvider><NotificationsPopover /></MotionProvider>;
}
