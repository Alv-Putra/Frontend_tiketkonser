import { create } from 'zustand';
import { StorageKeys, getItem, setItem } from '@/lib/storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  landingTheme: ThemeMode;
  workspaceTheme: ThemeMode;
  setLandingTheme: (theme: ThemeMode) => void;
  setWorkspaceTheme: (theme: ThemeMode) => void;
  toggleLandingTheme: () => void;
  toggleWorkspaceTheme: () => void;
  initThemes: () => void;
}

const getInitialLandingTheme = (): ThemeMode => {
  const saved = getItem(StorageKeys.THEME_LANDING);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
};

const getInitialWorkspaceTheme = (): ThemeMode => {
  const saved = getItem(StorageKeys.THEME_WORKSPACE);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  landingTheme: 'dark',
  workspaceTheme: 'light',

  initThemes: () => {
    const landing = getInitialLandingTheme();
    const workspace = getInitialWorkspaceTheme();
    set({ landingTheme: landing, workspaceTheme: workspace });
  },

  setLandingTheme: (theme: ThemeMode) => {
    setItem(StorageKeys.THEME_LANDING, theme);
    set({ landingTheme: theme });
  },

  setWorkspaceTheme: (theme: ThemeMode) => {
    setItem(StorageKeys.THEME_WORKSPACE, theme);
    set({ workspaceTheme: theme });
  },

  toggleLandingTheme: () => {
    const next: ThemeMode = get().landingTheme === 'dark' ? 'light' : 'dark';
    setItem(StorageKeys.THEME_LANDING, next);
    set({ landingTheme: next });
  },

  toggleWorkspaceTheme: () => {
    const next: ThemeMode = get().workspaceTheme === 'light' ? 'dark' : 'light';
    setItem(StorageKeys.THEME_WORKSPACE, next);
    set({ workspaceTheme: next });
  },
}));
