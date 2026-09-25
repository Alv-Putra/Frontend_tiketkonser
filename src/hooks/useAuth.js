'use client';

import useAuthStore from '@/stores/authStore';

export function useAuth() {
  const { user, isLoading, isHydrated, isAuthenticated } = useAuthStore();
  return {
    user,
    isLoading,
    isHydrated,
    isAuthenticated: isAuthenticated(),
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer',
    isCustomer: user?.role === 'customer',
  };
}

export default useAuth;