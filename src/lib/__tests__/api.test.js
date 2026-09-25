import { ApiError, apiFetch, buildUrl, clearSession, onUnauthorized } from '@/lib/api';
import { StorageKeys, setItem, getItem } from '@/lib/storage';

function jsonResponse({ ok = true, status = 200, body, contentType = 'application/json' }) {
  return {
    ok,
    status,
    headers: { get: (name) => (name.toLowerCase() === 'content-type' ? contentType : null) },
    json: async () => body,
  };
}

describe('lib/api', () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    onUnauthorized(null);
  });

  afterEach(() => {
    delete global.fetch;
    onUnauthorized(null);
  });

  describe('buildUrl', () => {
    it('returns absolute urls unchanged', () => {
      expect(buildUrl('http://localhost:3000/api/auth/login')).toBe(
        'http://localhost:3000/api/auth/login'
      );
      expect(buildUrl('https://api.example.com/path')).toBe('https://api.example.com/path');
    });

    it('keeps a leading-slash path when no base url is configured', () => {
      expect(buildUrl('/api/auth/login')).toBe('/api/auth/login');
    });

    it('prefixes the configured base url for relative paths', () => {
      const original = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'http://be.local:9000';
      jest.resetModules();
      const { buildUrl: build } = require('@/lib/api');
      expect(build('api/auth/login')).toBe('http://be.local:9000/api/auth/login');
      expect(build('/relative')).toBe('http://be.local:9000/relative');
      process.env.NEXT_PUBLIC_API_URL = original;
      jest.resetModules();
      onUnauthorized(null);
    });
  });

  describe('apiFetch', () => {
    it('returns the data property of the success envelope', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, code: 'OK', status: 200, message: 'ok', data: { a: 1 } } }));
      await expect(apiFetch('/api/auth/me')).resolves.toEqual({ a: 1 });
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/me',
        expect.objectContaining({ method: 'GET', credentials: 'include' })
      );
    });

    it('returns null when the envelope data is null', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, code: 'OK', status: 200, message: 'ok', data: null } }));
      await expect(apiFetch('/api/auth/logout', { method: 'POST' })).resolves.toBeNull();
    });

    it('returns the payload when it has no data key', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, hello: 'world' } }));
      await expect(apiFetch('/some')).resolves.toEqual({ success: true, hello: 'world' });
    });

    it('attaches the bearer token when one is stored', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 'abc123');
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: [] } }));
      await apiFetch('/api/users');
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBe('Bearer abc123');
    });

    it('does not attach an authorization header without a token', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: [] } }));
      await apiFetch('/api/users');
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBeUndefined();
    });

    it('does not attach an authorization header when auth is disabled', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 'abc123');
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: { token: 't' } } }));
      await apiFetch('/api/auth/login', { method: 'POST', body: {}, auth: false });
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBeUndefined();
    });

    it('serializes the body as json with the right content type', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: {} } }));
      await apiFetch('/api/auth/login', { method: 'POST', body: { email: 'a@b.c', password: 'x' }, auth: false });
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers['Content-Type']).toBe('application/json');
      expect(init.body).toBe(JSON.stringify({ email: 'a@b.c', password: 'x' }));
    });

    it('omits the body when none is given', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
      await apiFetch('/api/auth/me');
      const [, init] = fetchMock.mock.calls[0];
      expect(init.body).toBeUndefined();
    });

    it('throws ApiError with api message, code, status and errors', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          ok: false,
          status: 409,
          body: { success: false, code: 'EMAIL_EXISTS', status: 409, message: 'Email sudah terdaftar', errors: [{ field: 'email', message: 'already' }] },
        })
      );
      const err = await apiFetch('/api/auth/register', { method: 'POST', body: {}, auth: false }).catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe('Email sudah terdaftar');
      expect(err.code).toBe('EMAIL_EXISTS');
      expect(err.status).toBe(409);
      expect(err.errors).toEqual([{ field: 'email', message: 'already' }]);
    });

    it('throws ApiError for a non-json error response', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ ok: false, status: 500, contentType: 'text/html' }));
      const err = await apiFetch('/api/x').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe('Terjadi kesalahan pada server');
      expect(err.status).toBe(500);
    });

    it('throws ApiError when the payload reports success:false on an ok response', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ ok: true, status: 200, body: { success: false, code: 'INTERNAL_ERROR', status: 200, message: 'boom' } })
      );
      const err = await apiFetch('/api/x').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe('boom');
      expect(err.code).toBe('INTERNAL_ERROR');
    });

    it('clears the session and fires the unauthorized handler on a protected 401', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 'expired');
      setItem(StorageKeys.AUTH_USER, { id: 'u1' });
      const handler = jest.fn();
      onUnauthorized(handler);
      fetchMock.mockResolvedValue(
        jsonResponse({ ok: false, status: 401, body: { success: false, code: 'UNAUTHORIZED', status: 401, message: 'Token tidak valid' } })
      );
      const err = await apiFetch('/api/auth/me').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect(err.code).toBe('SESSION_EXPIRED');
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
      expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not clear the session on a 401 when auth is disabled', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 'token');
      const handler = jest.fn();
      onUnauthorized(handler);
      fetchMock.mockResolvedValue(
        jsonResponse({ ok: false, status: 401, body: { success: false, code: 'UNAUTHORIZED', status: 401, message: 'Email Atau Password Salah' } })
      );
      const err = await apiFetch('/api/auth/login', { method: 'POST', body: {}, auth: false }).catch((e) => e);
      expect(err.message).toBe('Email Atau Password Salah');
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBe('token');
      expect(handler).not.toHaveBeenCalled();
    });

    it('clears the session on a protected 401 even without a registered handler', async () => {
      setItem(StorageKeys.AUTH_TOKEN, 'expired');
      setItem(StorageKeys.AUTH_USER, { id: 'u1' });
      fetchMock.mockResolvedValue(
        jsonResponse({ ok: false, status: 401, body: { success: false, code: 'UNAUTHORIZED', status: 401, message: 'Token tidak valid' } })
      );
      const err = await apiFetch('/api/auth/me').catch((e) => e);
      expect(err.code).toBe('SESSION_EXPIRED');
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
      expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    });

    it('handles a response without a content-type header', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 503, headers: { get: () => null } });
      const err = await apiFetch('/api/x').catch((e) => e);
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(503);
    });

    it('merges extra headers and skips content-type without a body', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ body: { success: true, data: null } }));
      await apiFetch('/api/custom', { headers: { 'X-Custom': '1' } });
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers['X-Custom']).toBe('1');
      expect(init.headers['Content-Type']).toBeUndefined();
    });
  });

  describe('ApiError', () => {
    it('uses defaults when no option is supplied', () => {
      const err = new ApiError();
      expect(err.message).toBe('Terjadi kesalahan pada server');
      expect(err.code).toBe('ERROR');
      expect(err.status).toBe(500);
      expect(err.errors).toBeUndefined();
    });

    it('uses defaults for empty code and status', () => {
      const err = new ApiError('boom', { errors: null });
      expect(err.code).toBe('ERROR');
      expect(err.status).toBe(500);
      expect(err.errors).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('removes stored auth token and user', () => {
      setItem(StorageKeys.AUTH_TOKEN, 't');
      setItem(StorageKeys.AUTH_USER, { id: 'u' });
      clearSession();
      expect(getItem(StorageKeys.AUTH_TOKEN)).toBeNull();
      expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    });
  });
});