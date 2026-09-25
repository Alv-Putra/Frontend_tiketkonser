import authService, {
  AuthService,
  authService as namedAuthService,
  normalizeUser,
  decodeJwtPayload,
  mapRole,
} from '@/services/authService';
import { StorageKeys, getItem, setItem } from '@/lib/storage';

function jsonResponse({ ok = true, status = 200, body, contentType = 'application/json' }) {
  return {
    ok,
    status,
    headers: { get: (name) => (name.toLowerCase() === 'content-type' ? contentType : null) },
    json: async () => body,
  };
}

function b64Url(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function tokenFor(payload) {
  return `header.${b64Url(payload)}.signature`;
}

describe('authService', () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('exposes the service instance and class', () => {
    expect(namedAuthService).toBe(authService);
    expect(authService).toBeInstanceOf(AuthService);
  });

  describe('login', () => {
    it('stores token and normalized user from the backend', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          body: {
            success: true,
            code: 'OK',
            status: 200,
            message: 'Login berhasil',
            data: {
              accessToken: 'access-token-123',
              user: { public_id: 'pub-1', email: 'c@mail.com', full_name: 'Customer', role: 'buyer' },
            },
          },
        })
      );
      const result = await authService.login('c@mail.com', 'Password123');
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'c@mail.com', password: 'Password123' }),
        })
      );
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
      expect(result.token).toBe('access-token-123');
      expect(result.user.role).toBe('customer');
      expect(result.user.name).toBe('Customer');
      expect(result.user.id).toBe('pub-1');
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBe('access-token-123');
      expect(getItem(StorageKeys.AUTH_USER)).toEqual(result.user);
    });

    it('falls back to name when full_name is missing', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          body: { success: true, data: { accessToken: 't', user: { public_id: 'p', email: 'x@y.z', full_name: null, role: 'admin' } } },
        })
      );
      const result = await authService.login('x@y.z', 'Password123');
      expect(result.user.name).toBe('');
    });
  });

  describe('register', () => {
    it('sends fullName/email/password and returns a message', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          status: 201,
          body: { success: true, code: 'OK', status: 201, message: 'Pendaftaran berhasil', data: { user: { public_id: 'p', email: 'a@b.c', full_name: 'A' }, message: 'Silakan verifikasi email' } },
        })
      );
      const result = await authService.register({ name: 'A', email: 'a@b.c', password: 'Password123' });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ fullName: 'A', email: 'a@b.c', password: 'Password123' });
      expect(result.message).toBe('Silakan verifikasi email');
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
    });

    it('supports the fullName payload key', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { user: null, message: 'ok' } } }));
      await authService.register({ fullName: 'B', email: 'b@c.d', password: 'Password123' });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).fullName).toBe('B');
    });

    it('returns a null message when the response has no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { user: null } } }));
      const result = await authService.register({ name: 'A', email: 'a@b.c', password: 'Password123' });
      expect(result.message).toBeNull();
      expect(result.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('calls the logout endpoint and clears local session', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 't');
      setItem(StorageKeys.AUTH_USER, { id: 'p' });
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
      await authService.logout();
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }));
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
      expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    });

    it('still clears the local session when the server call fails', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 't');
      fetchMock.mockRejectedValue(new Error('network down'));
      await authService.logout();
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
    });
  });

  describe('session helpers', () => {
    it('isAuthenticated reflects the stored token', () => {
      expect(authService.isAuthenticated()).toBe(false);
      setItem(StorageKeys.AUTH_TOKEN, 't');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('getCurrentUser returns the stored user or null', () => {
      expect(authService.getCurrentUser()).toBeNull();
      setItem(StorageKeys.AUTH_USER, { id: 'u' });
      expect(authService.getCurrentUser()).toEqual({ id: 'u' });
    });

    it('getUserId resolves from stored user', () => {
      setItem(StorageKeys.AUTH_USER, { id: 'pub', public_id: 'pub' });
      expect(authService.getUserId()).toBe('pub');
    });

    it('getUserId falls back to public_id', () => {
      setItem(StorageKeys.AUTH_USER, { public_id: 'pub2' });
      expect(authService.getUserId()).toBe('pub2');
    });

    it('getUserId returns null without a session', () => {
      expect(authService.getUserId()).toBeNull();
    });

    it('getNumericUserId decodes sub from the access token', () => {
      setItem(StorageKeys.AUTH_TOKEN, tokenFor({ sub: '9', exp: 9999999999 }));
      expect(authService.getNumericUserId()).toBe('9');
    });

    it('getNumericUserId returns null without a token or sub', () => {
      expect(authService.getNumericUserId()).toBeNull();
      setItem(StorageKeys.AUTH_TOKEN, 'garbage');
      expect(authService.getNumericUserId()).toBeNull();
    });
  });

  describe('fetchProfile', () => {
    it('fetches the current profile and stores it', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ body: { success: true, data: { public_id: 'pub', email: 'm@mail.com', full_name: 'M', role: 'buyer' } } })
      );
      const user = await authService.fetchProfile();
      expect(user.name).toBe('M');
      expect(user.role).toBe('customer');
      expect(getItem(StorageKeys.AUTH_USER).name).toBe('M');
    });
  });

  describe('updateProfile', () => {
    it('throws when there is no active session', async () => {
      await expect(authService.updateProfile({ name: 'X' })).rejects.toThrow('Tidak ada sesi aktif');
    });

    it('throws when the token cannot be decoded', async () => {
      setItem(StorageKeys.AUTH_USER, { id: 'u', full_name: 'Old' });
      setItem(StorageKeys.AUTH_TOKEN, 'bad-token');
      await expect(authService.updateProfile({ name: 'X' })).rejects.toThrow('Token tidak valid');
    });

    it('patches full_name and updates the stored user', async () => {
      setItem(StorageKeys.AUTH_USER, { id: 'pub', full_name: 'Old', email: 'x@y.z', role: 'customer' });
      setItem(StorageKeys.AUTH_TOKEN, tokenFor({ sub: '5' }));
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
      const updated = await authService.updateProfile({ name: 'Nama Baru' });
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/users/5/profile',
        expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ full_name: 'Nama Baru' }) })
      );
      expect(updated.name).toBe('Nama Baru');
      expect(getItem(StorageKeys.AUTH_USER).name).toBe('Nama Baru');
    });

    it('does not call the api when no full name is provided', async () => {
      setItem(StorageKeys.AUTH_USER, { id: 'pub', full_name: 'Nana', email: 'x@y.z', role: 'customer' });
      setItem(StorageKeys.AUTH_TOKEN, tokenFor({ sub: '5' }));
      const updated = await authService.updateProfile({ email: 'new@mail.com' });
      expect(fetchMock).not.toHaveBeenCalled();
      expect(updated.email).toBe('new@mail.com');
      expect(updated.full_name).toBe('Nana');
    });
  });

  describe('password reset & email verification', () => {
    it('requestPasswordReset posts the email and returns the api message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { message: 'link dikirim' } } }));
      const message = await authService.requestPasswordReset('a@b.c');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'a@b.c' });
      expect(message).toBe('link dikirim');
    });

    it('requestPasswordReset returns null when no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: {} } }));
      await expect(authService.requestPasswordReset('a@b.c')).resolves.toBeNull();
    });

    it('confirmPasswordReset posts token and new password', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { message: 'berhasil' } } }));
      const message = await authService.confirmPasswordReset({ token: 'tok', newPassword: 'NewPass123' });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ token: 'tok', newPassword: 'NewPass123' });
      expect(message).toBe('berhasil');
    });

    it('confirmPasswordReset returns null when the response has no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: {} } }));
      await expect(authService.confirmPasswordReset({ token: 't', newPassword: 'NewPass123' })).resolves.toBeNull();
    });

    it('requestEmailVerification posts the email and returns the api message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { message: 'cek email' } } }));
      const message = await authService.requestEmailVerification('a@b.c');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'a@b.c' });
      expect(message).toBe('cek email');
    });

    it('requestEmailVerification returns null when the response has no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: {} } }));
      await expect(authService.requestEmailVerification('a@b.c')).resolves.toBeNull();
    });

    it('confirmEmailVerification posts the token', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { message: 'verified' } } }));
      const message = await authService.confirmEmailVerification('abc');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ token: 'abc' });
      expect(message).toBe('verified');
    });

    it('confirmEmailVerification returns null when the response has no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: {} } }));
      await expect(authService.confirmEmailVerification('abc')).resolves.toBeNull();
    });
  });

  describe('admin user management', () => {
    it('getAllUsers returns the user list', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: [{ id: '1', email: 'a@b.c' }] } }));
      await expect(authService.getAllUsers()).resolves.toEqual([{ id: '1', email: 'a@b.c' }]);
    });

    it('getUserById targets the given id', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { id: '3' } } }));
      await authService.getUserById(3);
      expect(fetchMock.mock.calls[0][0]).toBe('/api/users/3');
    });

    it('updateUser sends a PUT with body', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { id: '3' } } }));
      await authService.updateUser(3, { email: 'e@f.g' });
      expect(fetchMock).toHaveBeenCalledWith('/api/users/3', expect.objectContaining({ method: 'PUT', body: JSON.stringify({ email: 'e@f.g' }) }));
    });

    it('deleteUser sends a DELETE', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
      await authService.deleteUser(9);
      expect(fetchMock).toHaveBeenCalledWith('/api/users/9', expect.objectContaining({ method: 'DELETE' }));
    });
  });

  describe('local session helpers', () => {
    it('updateProfileLocal updates the stored user synchronously', () => {
      setItem(StorageKeys.AUTH_USER, { id: 'u', name: 'Old', email: 'o@x.y', role: 'customer' });
      const updated = authService.updateProfileLocal({ name: 'New' });
      expect(updated.name).toBe('New');
      expect(getItem(StorageKeys.AUTH_USER).name).toBe('New');
    });

    it('updateProfileLocal throws without a session', () => {
      expect(() => authService.updateProfileLocal({ name: 'X' })).toThrow('Tidak ada sesi aktif');
    });

    it('removeAuth clears the stored session', () => {
      setItem(StorageKeys.AUTH_TOKEN, 't');
      setItem(StorageKeys.AUTH_USER, { id: 'u' });
      authService.removeAuth();
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
      expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    });
  });

  describe('helpers', () => {
    it('normalizeUser maps null and non-object inputs', () => {
      expect(normalizeUser(null)).toBeNull();
      expect(normalizeUser('string')).toBe('string');
    });

    it('normalizeUser maps buyer to customer and builds identity fields', () => {
      const user = normalizeUser({ public_id: 'p', email: 'e@f.g', full_name: 'Nama', role: 'buyer' });
      expect(user.role).toBe('customer');
      expect(user.id).toBe('p');
      expect(user.name).toBe('Nama');
    });

    it('decodeJwtPayload handles invalid tokens', () => {
      expect(decodeJwtPayload(null)).toBeNull();
      expect(decodeJwtPayload('no-header')).toBeNull();
      expect(decodeJwtPayload('a.notjson.c')).toBeNull();
    });

    it('decodeJwtPayload decodes a valid payload', () => {
      expect(decodeJwtPayload(tokenFor({ sub: '7', role: 'admin' }))).toEqual({ sub: '7', role: 'admin' });
    });

    it('mapRole maps buyer and passes other roles through', () => {
      expect(mapRole('buyer')).toBe('customer');
      expect(mapRole('admin')).toBe('admin');
    });
  });
});