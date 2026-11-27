import { useThemeStore } from '@/stores/themeStore';
import { StorageKeys, getItem, setItem } from '@/lib/storage';

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({
      landingTheme: 'dark',
      workspaceTheme: 'light',
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('initializes with default themes', () => {
    const state = useThemeStore.getState();
    expect(state.landingTheme).toBe('dark');
    expect(state.workspaceTheme).toBe('light');
  });

  it('restores saved themes on initThemes', () => {
    setItem(StorageKeys.THEME_LANDING, 'light');
    setItem(StorageKeys.THEME_WORKSPACE, 'dark');

    useThemeStore.getState().initThemes();

    const state = useThemeStore.getState();
    expect(state.landingTheme).toBe('light');
    expect(state.workspaceTheme).toBe('dark');
  });

  it('falls back to defaults if stored theme values are invalid', () => {
    setItem(StorageKeys.THEME_LANDING, 'invalid-theme');
    setItem(StorageKeys.THEME_WORKSPACE, 'unknown');

    useThemeStore.getState().initThemes();

    const state = useThemeStore.getState();
    expect(state.landingTheme).toBe('dark');
    expect(state.workspaceTheme).toBe('light');
  });

  it('sets landing theme and updates storage', () => {
    useThemeStore.getState().setLandingTheme('light');
    expect(useThemeStore.getState().landingTheme).toBe('light');
    expect(getItem(StorageKeys.THEME_LANDING)).toBe('light');

    useThemeStore.getState().setLandingTheme('dark');
    expect(useThemeStore.getState().landingTheme).toBe('dark');
    expect(getItem(StorageKeys.THEME_LANDING)).toBe('dark');
  });

  it('sets workspace theme and updates storage', () => {
    useThemeStore.getState().setWorkspaceTheme('dark');
    expect(useThemeStore.getState().workspaceTheme).toBe('dark');
    expect(getItem(StorageKeys.THEME_WORKSPACE)).toBe('dark');

    useThemeStore.getState().setWorkspaceTheme('light');
    expect(useThemeStore.getState().workspaceTheme).toBe('light');
    expect(getItem(StorageKeys.THEME_WORKSPACE)).toBe('light');
  });

  it('toggles landing theme between dark and light', () => {
    expect(useThemeStore.getState().landingTheme).toBe('dark');

    useThemeStore.getState().toggleLandingTheme();
    expect(useThemeStore.getState().landingTheme).toBe('light');
    expect(getItem(StorageKeys.THEME_LANDING)).toBe('light');

    useThemeStore.getState().toggleLandingTheme();
    expect(useThemeStore.getState().landingTheme).toBe('dark');
    expect(getItem(StorageKeys.THEME_LANDING)).toBe('dark');
  });

  it('toggles workspace theme between light and dark', () => {
    expect(useThemeStore.getState().workspaceTheme).toBe('light');

    useThemeStore.getState().toggleWorkspaceTheme();
    expect(useThemeStore.getState().workspaceTheme).toBe('dark');
    expect(getItem(StorageKeys.THEME_WORKSPACE)).toBe('dark');

    useThemeStore.getState().toggleWorkspaceTheme();
    expect(useThemeStore.getState().workspaceTheme).toBe('light');
    expect(getItem(StorageKeys.THEME_WORKSPACE)).toBe('light');
  });
});
