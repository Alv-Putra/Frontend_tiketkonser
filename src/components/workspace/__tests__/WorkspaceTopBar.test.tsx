import { fireEvent, render, screen } from '@testing-library/react';
import WorkspaceTopBar from '../WorkspaceTopBar';
import { useThemeStore } from '@/stores/themeStore';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/admin',
}));

jest.mock('../WorkspaceNotifications', () => {
  return function MockNotifications() {
    return <div data-testid="workspace-notifications" />;
  };
});

describe('WorkspaceTopBar', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({
      workspaceTheme: 'light',
      landingTheme: 'dark',
    });
  });

  it('renders search input and profile button', () => {
    render(<WorkspaceTopBar />);
    expect(screen.getByPlaceholderText('Cari di workspace…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu profil/i })).toBeInTheDocument();
  });

  it('toggles workspace theme when theme button is clicked', () => {
    render(<WorkspaceTopBar />);
    const themeBtn = screen.getByRole('button', { name: /ganti ke tema gelap/i });
    expect(themeBtn).toBeInTheDocument();

    fireEvent.click(themeBtn);
    expect(useThemeStore.getState().workspaceTheme).toBe('dark');

    const darkThemeBtn = screen.getByRole('button', { name: /ganti ke tema terang/i });
    expect(darkThemeBtn).toBeInTheDocument();

    fireEvent.click(darkThemeBtn);
    expect(useThemeStore.getState().workspaceTheme).toBe('light');
  });
});
