import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import OrganizerLoginPage from '../page';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

const replace = jest.fn();
const login = jest.fn();
const logout = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ replace });
  useAuthStore.setState({ user: null, isHydrated: true, isLoading: false, login, logout });
});

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

function submitOrganizerForm() {
  render(<OrganizerLoginPage />);
  expect(screen.getByRole('heading', { name: 'Organizer Workspace' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Email Organizer' }), {
    target: { value: 'organizer@tixo.id' },
  });
  fireEvent.change(screen.getByLabelText('Kata Sandi', { selector: 'input' }), {
    target: { value: 'Workspace123' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk ke Organizer Workspace' }));
}

it('mengirim role organizer ke backend dan kembali ke halaman workspace yang diminta', async () => {
  window.history.replaceState(null, '', '/organizer/login?redirect=%2Forganizer%2Fsales%3Fpage%3D2');
  login.mockResolvedValueOnce({ success: true, user: { role: 'organizer' } });

  submitOrganizerForm();

  await waitFor(() => {
    expect(login).toHaveBeenCalledWith('organizer@tixo.id', 'Workspace123', {
      mockFallback: false,
      role: 'organizer',
    });
    expect(replace).toHaveBeenCalledWith('/organizer/sales?page=2');
  });
});

it('mengakhiri sesi bila respons login membawa role yang berbeda', async () => {
  login.mockResolvedValueOnce({ success: true, user: { role: 'admin' } });

  submitOrganizerForm();

  expect(await screen.findByRole('alert')).toHaveTextContent('Akun Anda tidak memiliki hak akses Organizer');
  expect(logout).toHaveBeenCalledTimes(1);
  expect(replace).not.toHaveBeenCalled();
});

it('membuka dashboard organizer saat tujuan login berada di luar workspace', async () => {
  window.history.replaceState(null, '', '/organizer/login?redirect=%2Forganizer%2F..%2Fadmin');
  login.mockResolvedValueOnce({ success: true, user: { role: 'organizer' } });

  submitOrganizerForm();

  await waitFor(() => expect(replace).toHaveBeenCalledWith('/organizer'));
});
