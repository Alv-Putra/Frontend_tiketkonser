'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Daftarkan plugin sekali saja, hanya di browser.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Query media untuk animasi penuh; pengguna "reduce motion" mendapat versi statis. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, useGSAP };
