import { create } from 'zustand';
import authService, { mapRole } from '@/services/authService';
import { onUnauthorized } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import type { ActionResult, User } from '@/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<ActionResult>;
  register: (payload: { name?: string; fullName?: string; email: string; password: string }) => Promise<ActionResult>;
  logout: () => Promise<void>;
  logoutLocal: () => void;
  fetchProfile: () => Promise<ActionResult>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  isAuthenticated: () => boolean;
  isRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isOrganizer: () => boolean;
  isCustomer: () => boolean;
}

const initialState: Pick<AuthState, 'user' | 'token' | 'isLoading' | 'isHydrated'> = {
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,
};

export const useAuthStore = create<AuthState>()((set, get) => {
  const clearSession = () => {
    authService.removeAuth();
    set({ user: null, token: null });
  };

  onUnauthorized(clearSession);

  return {
    ...initialState,

    hydrate: () => {
      const user = authService.getCurrentUser();
      set({ user, isHydrated: true });
    },

    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const { user, token } = await authService.login(email, password);
        set({ user, token, isLoading: false });
        return { success: true, user };
      } catch (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
    },

    register: async (payload) => {
      set({ isLoading: true });
      try {
        const result = await authService.register(payload);
        set({ isLoading: false });
        return { success: true, message: result.message, user: result.user };
      } catch (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
    },

    logout: async () => {
      await authService.logout();
      set({ user: null, token: null });
    },

    logoutLocal: () => {
      clearSession();
    },

    fetchProfile: async () => {
      set({ isLoading: true });
      try {
        const user = await authService.fetchProfile();
        set({ user, isLoading: false });
        return { success: true, user };
      } catch (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
    },

    updateProfile: async (updates) => {
      const updatedUser = await authService.updateProfile(updates);
      set({ user: updatedUser });
      return updatedUser;
    },

    isAuthenticated: () => Boolean(get().user),
    isRole: (role) => mapRole(get().user?.role) === role,
    isAdmin: () => mapRole(get().user?.role) === ROLES.ADMIN,
    isOrganizer: () => mapRole(get().user?.role) === ROLES.ORGANIZER,
    isCustomer: () => mapRole(get().user?.role) === ROLES.CUSTOMER,
  };
});

export default useAuthStore;