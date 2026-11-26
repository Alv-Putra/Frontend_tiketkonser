'use client';

import type { ReactNode } from 'react';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  subtext?: ReactNode;
  trend?: 'up' | 'down' | 'flat' | string;
  trendText?: ReactNode;
}

export default function StatCard({ label, value, subtext, trend, trendText }: StatCardProps) {
  const tone = trend === 'up' ? 'bg-status-success/25' : trend === 'down' ? 'bg-status-danger/25' : 'bg-status-warning/25';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-ink/20">
      <span className="text-xs font-semibold text-ink/60">{label}</span>
      <div className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink">{value}</div>
      {(trendText || subtext) && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-ink/45">
          {trendText && <span className={`rounded-full px-1.5 py-0.5 font-semibold text-ink ${tone}`}>{trendText}</span>}
          {subtext}
        </div>
      )}
    </div>
  );
}
