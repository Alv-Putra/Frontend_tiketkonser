import useAuthStore, { useAuthStore as namedAuthStore } from '@/stores/authStore';
import { StorageKeys, setItem, getItem } from '@/lib/storage';

function jsonResponse({ ok = true, status = 200, body }) {
  return {
    ok,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
  };
}

function b64Url(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function tokenFor(payload) {
  return `header.${b64Url(payload)}.signature`;
}

const loginData = (user) => ({
  success: true,
  code: 'OK',
  status: 200,
  message: 'Login berhasil',
  data: { accessToken: 'access-token', user },
});

describe('useAuthStore', () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isHydrated: false,
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('default export resolves to the same store', () => {
    expect(useAuthStore).toBe(namedAuthStore);
  });

  it('starts with no user and not authenticated', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('logs in successfully and stores user', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ body: loginData({ public_id: 'p', email: 'customer@conserid.com', full_name: 'Customer', role: 'customer' }) }));
    const result = await useAuthStore.getState().login('customer@conserid.com', 'Customer123');
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user.email).toBe('customer@conserid.com');
    expect(useAuthStore.getState().token).toBe('access-token');
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it('handles failed login gracefully', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: false, status: 401, body: { success: false, code: 'UNAUTHORIZED', status: 401, message: 'Email Atau Password Salah' } })
    );
    const result = await useAuthStore.getState().login('customer@conserid.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email Atau Password Salah');
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('registers a user without auto-login', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        status: 201,
        body: { success: true, code: 'OK', status: 201, message: 'Pendaftaran berhasil', data: { user: { public_id: 'p', email: 'rini@mail.com', full_name: 'Rini' }, message: 'Silakan verifikasi email' } },
      })
    );
    const result = await useAuthStore
      .getState()
      .register({ name: 'Rini', email: 'rini@mail.com', password: 'Rini1234' });
    expect(result.success).toBe(true);
    expect(result.message).toBe('Silakan verifikasi email');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('handles register error', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: false, status: 409, body: { success: false, code: 'EMAIL_EXISTS', status: 409, message: 'Email sudah terdaftar' } })
    );
    const result = await useAuthStore
      .getState()
      .register({ name: 'Dup', email: 'admin@conserid.com', password: 'Admin123' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email sudah terdaftar');
  });

  it('logs out and clears user', async () => {
    useAuthStore.setState({
      user: { id: 'u3', name: 'Customer', email: 'customer@conserid.com', role: 'customer' },
      token: 'token-u3',
    });
    fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', expect.anything());
  });

  it('logoutLocal clears the session without a server call', async () => {
    useAuthStore.setState({
      user: { id: 'u3', role: 'customer' },
      token: 'token-u3',
    });
    useAuthStore.getState().logoutLocal();
    expect(useAuthStore.getState().user).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetchProfile updates the stored user', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { public_id: 'p', email: 'm@mail.com', full_name: 'M', role: 'buyer' } } }));
    const result = await useAuthStore.getState().fetchProfile();
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user.name).toBe('M');
    expect(useAuthStore.getState().user.role).toBe('customer');
  });

  it('fetchProfile handles errors', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: false, status: 401, body: { success: false, code: 'UNAUTHORIZED', status: 401, message: 'Sesi berakhir' } })
    );
    const result = await useAuthStore.getState().fetchProfile();
    expect(result.success).toBe(false);
  });

  it('updateProfile patches the profile via the backend', async () => {
    setItem(StorageKeys.AUTH_USER, { id: 'u3', name: 'Customer', email: 'customer@conserid.com', role: 'customer' });
    setItem(StorageKeys.AUTH_TOKEN, tokenFor({ sub: '5' }));
    useAuthStore.setState({
      user: { id: 'u3', name: 'Customer', email: 'customer@conserid.com', role: 'customer' },
      token: tokenFor({ sub: '5' }),
    });
    fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
    const updated = await useAuthStore.getState().updateProfile({ name: 'Updated Name' });
    expect(updated.name).toBe('Updated Name');
    expect(useAuthStore.getState().user.name).toBe('Updated Name');
  });

  it('maps buyer role to customer for role helpers', () => {
    useAuthStore.setState({
      user: { id: 'u3', name: 'Customer', email: 'customer@conserid.com', role: 'buyer' },
    });
    expect(useAuthStore.getState().isCustomer()).toBe(true);
    expect(useAuthStore.getState().isAdmin()).toBe(false);
    expect(useAuthStore.getState().isRole('customer')).toBe(true);
  });

  it('checks role helpers', () => {
    useAuthStore.setState({
      user: { id: 'u1', name: 'Admin', email: 'admin@conserid.com', role: 'admin' },
    });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
    expect(useAuthStore.getState().isOrganizer()).toBe(false);
    expect(useAuthStore.getState().isCustomer()).toBe(false);
    expect(useAuthStore.getState().isRole('admin')).toBe(true);
  });

  it('isOrganizer returns true for organizer role', () => {
    useAuthStore.setState({
      user: { id: 'u2', name: 'Organizer', email: 'organizer@conserid.com', role: 'organizer' },
    });
    expect(useAuthStore.getState().isOrganizer()).toBe(true);
  });

  it('hydrates existing session from storage', () => {
    const user = { id: 'u3', name: 'Customer', email: 'customer@conserid.com', role: 'customer' };
    setItem(StorageKeys.AUTH_USER, user);
    setItem(StorageKeys.AUTH_TOKEN, 'token-xyz');
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user.email).toBe('customer@conserid.com');
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });

  it('hydrates with no session', () => {
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });

  it('getItem storage still works alongside the store', () => {
    setItem(StorageKeys.AUTH_USER, { id: 'x' });
    expect(getItem(StorageKeys.AUTH_USER)).toEqual({ id: 'x' });
  });
});