'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';

/** Kata yang berganti bergiliran dengan efek naik-masuk / naik-keluar. */
export default function RotatingWord({
  words,
  interval = 2200,
  className = '',
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      // Tidak perlu berganti saat tab tidak terlihat.
      if (!document.hidden) setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, reduce, words.length]);

  return (
    <span className={`relative inline-grid justify-items-center overflow-hidden align-bottom ${className}`}>
      {/* Kata terpanjang menjaga lebar agar teks di sekitarnya tidak bergeser. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={words[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1"
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
