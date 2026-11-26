'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Bell } from 'lucide-react';
import MotionProvider from '@/components/landing/MotionProvider';
import { useDashboardData } from '@/hooks/useDashboardData';
import { fetchWorkspaceNotifications } from '@/services/dashboardService';
import { ease, RefreshButton } from './DashboardKit';

function NotificationList() {
  const { data, status, refresh } = useDashboardData(fetchWorkspaceNotifications);
  return (
    <>
      <h2 className="mb-3 font-display text-base font-bold">Notifikasi terbaru</h2>
      {status === 'loading' && !data && <p role="status" className="text-sm text-ink/70">Memuat notifikasi…</p>}
      {status === 'error' && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-ink/70">Notifikasi gagal dimuat.</p>
          <RefreshButton loading={false} refresh={refresh} />
        </div>
      )}
      {data && (
        data.data.length ? (
          <ul className="divide-y divide-ink/10">
            {data.data.map((item) => (
              <li key={item.id} className="break-words py-2">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.message && <p className="mt-1 text-sm text-ink/70">{item.message}</p>}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-ink/70">Belum ada notifikasi.</p>
      )}
    </>
  );
}

function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

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
      <button ref={button} type="button" aria-expanded={open} aria-controls={id} aria-label="Notifikasi" onClick={() => setOpen(!open)} className="grid size-11 place-items-center rounded-xl border border-ink/10 bg-white text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze">
        <Bell aria-hidden="true" className="size-4" />
      </button>
      <div id={id}>
        <AnimatePresence>
          {open && (
            <m.div initial={reduced ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2, ease }} className="absolute inset-x-4 top-full mt-2 ml-auto max-h-80 max-w-80 overflow-auto rounded-2xl border border-ink/10 bg-white p-4 shadow-md lg:right-8">
              <NotificationList />
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
