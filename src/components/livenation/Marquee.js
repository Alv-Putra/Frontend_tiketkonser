'use client';

import { Music2 } from 'lucide-react';

const word = 'WHAT\'S HAPPENING IN ASIA?';

export default function Marquee() {
  const items = Array.from({ length: 16 });
  return (
    <div className="font-ln relative bg-ln-sky overflow-hidden" style={{ minHeight: '40px' }}>
      <div className="ln-marquee-track flex w-max items-center whitespace-nowrap">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center font-bold text-ln-text text-sm uppercase tracking-wide"
            style={{ margin: '8px 32px' }}
          >
            <Music2 size={16} className="mr-8 text-ln-text/60" />
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}