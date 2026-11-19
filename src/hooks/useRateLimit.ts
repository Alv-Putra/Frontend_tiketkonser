'use client';

import { useRef, useCallback } from 'react';
import RateLimiter from '@/lib/rate-limiter';

export function useRateLimit({ maxAttempts, windowMs }) {
  const limiterRef = useRef(null);
  if (limiterRef.current == null) {
    limiterRef.current = new RateLimiter({ maxAttempts, windowMs });
  }

  const check = useCallback((key) => limiterRef.current.check(key), []);
  const hit = useCallback((key) => limiterRef.current.hit(key), []);
  const reset = useCallback((key) => limiterRef.current.reset(key), []);

  return { check, hit, reset };
}

export default useRateLimit;