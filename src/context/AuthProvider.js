'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';
import { setSessionCookie, clearSessionCookie } from '@/lib/sessionCookie';

export function AuthProvider({ children }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (user && user.role) {
      setSessionCookie(user.role);
    } else {
      clearSessionCookie();
    }
  }, [user, isHydrated]);

  return children;
}

export default AuthProvider;