'use client';

import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { useStore } from 'zustand';
import { createTicketCheckInStore } from '@/stores/ticketCheckInStore';
import type { OrganizerDashboardEvent } from '@/types/dashboard';
import { DashboardFrame, DashboardHeader, DashboardStatus, Panel, PanelHead, ease, primaryButton } from '@/components/workspace/DashboardKit';
import OrganizerEventPicker from './OrganizerEventPicker';

const timeFormat = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', timeZone: 'Asia/Jakarta' });

function CheckInStation({ event }: { event: OrganizerDashboardEvent }) {
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const [token, setToken] = useState('');
  const [store] = useState(() => createTicketCheckInStore(event.id));
  const { recent, submitting, error, submit } = useStore(store);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = token.trim();
    if (value && await submit(value)) setToken('');
    input.current?.focus();
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHead title="Verifikasi tiket" subtitle={event.title} />
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label htmlFor="ticket-qr" className="block text-sm font-semibold">Token QR tiket</label>
          <input ref={input} id="ticket-qr" name="qr_token" type="text" required value={token} onChange={(e) => setToken(e.target.value)} readOnly={submitting} autoComplete="off" autoCapitalize="none" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby="check-in-feedback" className="min-h-11 w-full rounded-xl border border-ink/20 bg-paper px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-blaze" />
          <p id="check-in-feedback" aria-live="polite" className="text-sm text-ink/75">{error ?? 'Tempel token QR atau gunakan pemindai yang memasukkan teks.'}</p>
          <m.button type="submit" disabled={submitting} whileTap={reduced ? undefined : { scale: 0.96 }} className={primaryButton}>
            <QrCode aria-hidden="true" className="size-4" /> {submitting ? 'Memverifikasi…' : 'Verifikasi masuk'}
          </m.button>
        </form>
      </Panel>
      <Panel>
        <PanelHead title="Aktivitas check-in" subtitle="Lima verifikasi terakhir di sesi ini." />
        <div aria-live="polite" aria-relevant="additions text">
          {recent.length === 0 && <p className="text-sm text-ink/65">Belum ada tiket terverifikasi.</p>}
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {recent.map((ticket) => (
                <m.li key={ticket.ticket_code} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25, ease }} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold">{ticket.ticket_code}</p>
                    <p className="break-words text-sm text-ink/65">{ticket.ticket_type} · <time dateTime={ticket.checked_in_at}>{timeFormat.format(new Date(ticket.checked_in_at))} WIB</time></p>
                  </div>
                  <DashboardStatus label="Sudah masuk" tone="positive" />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </Panel>
    </div>
  );
}

export default function OrganizerCheckIn() {
  return (
    <DashboardFrame>
      <DashboardHeader title="Check-in tiket" subtitle="Verifikasi tiket pengunjung di gerbang masuk." />
      <OrganizerEventPicker>{(event) => <CheckInStation key={event.id} event={event} />}</OrganizerEventPicker>
    </DashboardFrame>
  );
}
