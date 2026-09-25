import { getItem, removeItem, StorageKeys } from '@/lib/storage';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(message, { code, status, errors } = {}) {
    super(message || 'Terjadi kesalahan pada server');
    this.name = 'ApiError';
    this.code = code || 'ERROR';
    this.status = status || 500;
    this.errors = errors;
  }
}

let unauthorizedHandler = null;

export function onUnauthorized(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

export function clearSession() {
  removeItem(StorageKeys.AUTH_TOKEN);
  removeItem(StorageKeys.AUTH_USER);
}

export function buildUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  if (/^\//.test(path)) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${path}`;
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    headers: extraHeaders = {},
  } = options;

  const headers = { Accept: 'application/json', ...extraHeaders };
  const token = auth ? getItem(StorageKeys.AUTH_TOKEN) : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : null;

  if (res.status === 401 && auth) {
    clearSession();
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new ApiError('Sesi berakhir, silakan masuk kembali', {
      code: 'SESSION_EXPIRED',
      status: 401,
    });
  }

  if (!res.ok || (payload && payload.success === false)) {
    throw new ApiError(payload && payload.message ? payload.message : undefined, {
      code: payload && payload.code ? payload.code : 'ERROR',
      status: payload && payload.status ? payload.status : res.status,
      errors: payload && payload.errors ? payload.errors : undefined,
    });
  }

  return payload && 'data' in payload ? payload.data : payload;
}