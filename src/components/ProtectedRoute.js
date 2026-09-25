'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { ROLES } from '@/lib/constants';

export default function ProtectedRoute({ children, roles = [ROLES.CUSTOMER] }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      router.replace(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (roles.length && !roles.includes(user.role)) {
      router.replace('/');
    }
  }, [user, isHydrated, roles, router]);

  if (!isHydrated || !user) {
    return null;
  }

  if (roles.length && !roles.includes(user.role)) {
    return null;
  }

  return children;
}