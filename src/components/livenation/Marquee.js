'use client';

import { Music2, Sparkles, Flame } from 'lucide-react';

const marqueeItems = [
  { text: "WHAT'S HAPPENING IN ASIA?", icon: Music2 },
  { text: 'EXPERIENCE LIVE MUSIC', icon: Flame },
  { text: 'TIKET RESMI & TERPERCAYA', icon: Sparkles },
  { text: 'KONSER & FESTIVAL TERBAIK', icon: Music2 },
];

export default function Marquee() {
  return (
    <div
      className="relative bg-[#111827] border-y border-slate-800 overflow-hidden select-none py-3"
      aria-hidden="true"
    >
      <div className="ln-marquee-track flex w-max items-center whitespace-nowrap">
        {/* First Half */}
        <div className="flex items-center shrink-0">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`m1-${idx}`}
                className="flex items-center font-bold text-slate-300 text-xs sm:text-sm uppercase tracking-widest mx-6 sm:mx-8"
              >
                <Icon size={16} className="mr-3 text-pink-500 shrink-0" />
                {item.text}
              </div>
            );
          })}
        </div>

        {/* Second Half (duplicate for seamless loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`m2-${idx}`}
                className="flex items-center font-bold text-slate-300 text-xs sm:text-sm uppercase tracking-widest mx-6 sm:mx-8"
              >
                <Icon size={16} className="mr-3 text-pink-500 shrink-0" />
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
