'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowRight, RefreshCw, type LucideIcon } from 'lucide-react';
import MotionProvider from '@/components/landing/MotionProvider';
import { useGsap } from '@/lib/gsap';

export const primaryButton = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-blaze px-4 py-2 text-sm font-semibold text-ink hover:bg-tangerine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze disabled:cursor-default disabled:opacity-55';
export const ghostButton = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze disabled:cursor-default disabled:opacity-55';
export const ease = [0.22, 1, 0.36, 1] as const;

export function DashboardFrame({ children }: { children: ReactNode }) {
  return <MotionProvider><div className="min-w-0 space-y-6">{children}</div></MotionProvider>;
}

export function DashboardHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <m.header
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div className="min-w-0">
        <h1 className="text-balance font-display text-3xl font-extrabold leading-none tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink/70">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </m.header>
  );
}

export function RefreshButton({ loading, refresh }: { loading: boolean; refresh: () => void }) {
  const reduced = useReducedMotion();
  return (
    <m.button type="button" disabled={loading} onClick={refresh} whileTap={reduced ? undefined : { scale: 0.96 }} className={ghostButton}>
      <RefreshCw aria-hidden="true" className={`size-4 ${loading ? 'motion-safe:animate-spin' : ''}`} />
      {loading ? 'Memuat…' : 'Segarkan'}
    </m.button>
  );
}

export function DashboardNotice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <p role={error ? 'alert' : 'status'} className={`rounded-2xl border border-ink/10 p-4 text-sm text-ink ${error ? 'bg-status-danger/25' : 'bg-white'}`}>
      {children}
    </p>
  );
}

export function Panel({ className = '', children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGsap(({ gsap }) => {
    const panel = root.current;
    const scroller = panel?.closest('main');
    if (!panel || !scroller || panel.getBoundingClientRect().top < scroller.getBoundingClientRect().bottom) return;

    gsap.from(panel, {
      y: 18,
      opacity: 0.55,
      duration: 0.48,
      ease: 'power2.out',
      scrollTrigger: { trigger: panel, scroller, start: 'top bottom', once: true },
    });
  }, root);

  return <section ref={root} className={`min-w-0 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 ${className}`}>{children}</section>;
}

export function PanelHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ink/70">{subtitle}</p>}
    </div>
  );
}

export interface Metric {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  note?: string;
}

export function MetricGrid({ items }: { items: Metric[] }) {
  const reduced = useReducedMotion();
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, note }, index) => (
        <m.div
          key={label}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.05, ease }}
          className="min-w-0 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5"
        >
          <dt className="flex items-center justify-between gap-2 text-sm font-semibold text-ink/70">
            {label}<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paper text-ink"><Icon aria-hidden="true" className="size-4" /></span>
          </dt>
          <dd className="mt-2 break-words font-display text-2xl font-extrabold leading-tight tabular-nums text-ink">{value}</dd>
          {note && <dd className="mt-1 text-xs text-ink/65">{note}</dd>}
        </m.div>
      ))}
    </dl>
  );
}

export interface DashboardLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function DashboardLinks({ items }: { items: DashboardLink[] }) {
  const reduced = useReducedMotion();
  return (
    <Panel>
      <PanelHead title="Akses cepat" />
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ label, href, icon: Icon }) => (
          <m.li key={href} whileTap={reduced ? undefined : { scale: 0.98 }}>
            <Link href={href} className="flex min-h-12 items-center gap-3 rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-blaze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blaze">
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1">{label}</span>
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </m.li>
        ))}
      </ul>
    </Panel>
  );
}

export function DashboardStatus({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'positive' | 'warning' | 'danger' }) {
  const toneClass = {
    neutral: 'bg-paper', positive: 'bg-status-success/40', warning: 'bg-status-warning/45', danger: 'bg-status-danger/40',
  }[tone];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-ink ${toneClass}`}>{label}</span>;
}

export const dashboardOrderStatus = {
  paid: { label: 'Lunas', tone: 'positive', color: 'var(--color-status-success)' },
  pending: { label: 'Menunggu pembayaran', tone: 'warning', color: 'var(--color-status-warning)' },
  expired: { label: 'Kedaluwarsa', tone: 'neutral', color: 'var(--color-mute)' },
  cancelled: { label: 'Dibatalkan', tone: 'danger', color: 'var(--color-status-danger)' },
  refunded: { label: 'Dikembalikan', tone: 'neutral', color: 'var(--color-tangerine)' },
} as const;
