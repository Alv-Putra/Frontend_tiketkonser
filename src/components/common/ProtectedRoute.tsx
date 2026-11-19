'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { ROLES } from '@/lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  roles = [ROLES.CUSTOMER],
  redirectTo = '/auth/login',
  fallback = null,
}: ProtectedRouteProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
      return;
    }
    if (!user) {
      const currentPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/';
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (roles.length && !roles.includes(user.role)) {
      if (roles.includes(ROLES.ADMIN)) {
        router.replace(`${redirectTo}?error=unauthorized`);
      } else {
        router.replace('/');
      }
    }
  }, [user, isHydrated, roles, redirectTo, router, hydrate]);

  if (!isHydrated || !user) {
    return <>{fallback}</>;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
