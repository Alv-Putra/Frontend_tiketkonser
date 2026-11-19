'use client';

import type { ReactNode } from 'react';
import { LazyMotion } from 'framer-motion';

const loadFeatures = () => import('./motion-features').then((mod) => mod.default);

/** Framer Motion versi ringan: komponen memakai `m`, fiturnya dimuat async. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
