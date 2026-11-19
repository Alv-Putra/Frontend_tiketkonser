import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '../page';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { ROLES } from '@/lib/constants';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe('AdminLoginPage component', () => {
  let mockPush: jest.Mock;
  let mockReplace: jest.Mock;
  let loginMock: jest.Mock;
  let logoutMock: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    loginMock = jest.fn();
    logoutMock = jest.fn();

    useAuthStore.setState({
      user: null,
      isHydrated: true,
      isLoading: false,
      login: loginMock,
      logout: logoutMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the admin login form elements', () => {
    render(<AdminLoginPage />);
    expect(screen.getByText('Admin Workspace')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Administrator/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Kata Sandi', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Masuk ke Admin Workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gunakan Akun Ini/i })).toBeInTheDocument();
  });

  it('populates fields when "Gunakan Akun Ini" is clicked', () => {
    render(<AdminLoginPage />);
    const quickFillBtn = screen.getByRole('button', { name: /Gunakan Akun Ini/i });
    fireEvent.click(quickFillBtn);

    const emailInput = screen.getByLabelText(/Email Administrator/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Kata Sandi', { selector: 'input' }) as HTMLInputElement;

    expect(emailInput.value).toBe('admin@conserid.com');
    expect(passwordInput.value).toBe('Admin123');
  });

  it('toggles password visibility', () => {
    render(<AdminLoginPage />);
    const passwordInput = screen.getByLabelText('Kata Sandi', { selector: 'input' });
    const toggleBtn = screen.getByRole('button', { name: /Tampilkan kata sandi/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: /Sembunyikan kata sandi/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation errors when submitted empty', async () => {
    render(<AdminLoginPage />);
    const submitBtn = screen.getByRole('button', { name: /Masuk ke Admin Workspace/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Email wajib diisi/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password wajib diisi/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('logs in successfully and redirects to /admin when role is admin', async () => {
    loginMock.mockResolvedValueOnce({
      success: true,
      user: {
        public_id: 'admin-1',
        email: 'admin@conserid.com',
        role: ROLES.ADMIN,
      },
    });

    render(<AdminLoginPage />);
    const quickFillBtn = screen.getByRole('button', { name: /Gunakan Akun Ini/i });
    fireEvent.click(quickFillBtn);

    const submitBtn = screen.getByRole('button', { name: /Masuk ke Admin Workspace/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin@conserid.com', 'Admin123');
      expect(mockReplace).toHaveBeenCalledWith('/admin');
    });
  });

  it('rejects login and logs out when user role is not admin', async () => {
    loginMock.mockResolvedValueOnce({
      success: true,
      user: {
        public_id: 'user-1',
        email: 'customer@conserid.com',
        role: ROLES.CUSTOMER,
      },
    });

    render(<AdminLoginPage />);
    fireEvent.change(screen.getByLabelText(/Email Administrator/i), {
      target: { value: 'customer@conserid.com' },
    });
    fireEvent.change(screen.getByLabelText('Kata Sandi', { selector: 'input' }), {
      target: { value: 'Customer123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Masuk ke Admin Workspace/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
      expect(screen.getByText(/Akses ditolak: Akun Anda tidak memiliki hak akses Administrator/i)).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalledWith('/admin');
    });
  });

  it('displays backend error message when login fails', async () => {
    loginMock.mockResolvedValueOnce({
      success: false,
      error: 'Email Atau Password Salah',
    });

    render(<AdminLoginPage />);
    const quickFillBtn = screen.getByRole('button', { name: /Gunakan Akun Ini/i });
    fireEvent.click(quickFillBtn);

    const submitBtn = screen.getByRole('button', { name: /Masuk ke Admin Workspace/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email Atau Password Salah')).toBeInTheDocument();
    });
  });
});
