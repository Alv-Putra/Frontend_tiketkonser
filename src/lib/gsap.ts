'use client';

import { useEffect, type DependencyList, type RefObject } from 'react';

type GsapModule = typeof import('gsap');
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger');

export interface GsapLib {
  gsap: GsapModule['gsap'];
  ScrollTrigger: ScrollTriggerModule['ScrollTrigger'];
}

/** Animasi hanya untuk pengguna tanpa "reduce motion". */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

let loader: Promise<GsapLib> | null = null;

/** Muat GSAP + ScrollTrigger sekali, secara lazy. */
export function loadGsap(): Promise<GsapLib> {
  if (!loader) {
    loader = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return loader;
}

/** Jalankan animasi GSAP saat browser senggang, dibersihkan saat unmount. */
export function useGsap(
  setup: (lib: GsapLib) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = []
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia?.(MOTION_OK).matches) return;

    let cancelled = false;
    let ctx: ReturnType<GsapLib['gsap']['context']> | undefined;

    const run = () =>
      loadGsap().then((lib) => {
        if (cancelled || !scope.current) return;
        ctx = lib.gsap.context(() => setup(lib), scope.current);
      });

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 1500 })
      : window.setTimeout(run, 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
