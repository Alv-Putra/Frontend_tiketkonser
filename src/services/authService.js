import { getItem, setItem, removeItem, StorageKeys } from '@/lib/storage';
import { apiFetch, clearSession } from '@/lib/api';

const ROLE_BUYER_TO_CUSTOMER = 'customer';

function mapRole(role) {
  return role === 'buyer' ? ROLE_BUYER_TO_CUSTOMER : role;
}

export function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') {
    return raw;
  }
  const fullName = raw.full_name || raw.name || '';
  return {
    id: raw.public_id || raw.id,
    public_id: raw.public_id,
    name: fullName,
    full_name: fullName,
    email: raw.email,
    role: mapRole(raw.role),
  };
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }
  const payloadPart = token.split('.')[1];
  if (!payloadPart) {
    return null;
  }
  try {
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export class AuthService {
  async login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    const user = normalizeUser(data.user);
    setItem(StorageKeys.AUTH_TOKEN, data.accessToken);
    setItem(StorageKeys.AUTH_USER, user);
    return { user, token: data.accessToken };
  }

  async register({ name, fullName, email, password }) {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: { fullName: fullName || name, email, password },
    });
    return { message: data && data.message ? data.message : null, user: normalizeUser(data.user) };
  }

  async logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Lokal tetap dibersihkan meskipun panggilan logout ke server gagal.
    } finally {
      clearSession();
    }
  }

  isAuthenticated() {
    return Boolean(getItem(StorageKeys.AUTH_TOKEN));
  }

  getCurrentUser() {
    return getItem(StorageKeys.AUTH_USER);
  }

  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.id || user.public_id : null;
  }

  getNumericUserId() {
    const token = getItem(StorageKeys.AUTH_TOKEN);
    const payload = decodeJwtPayload(token);
    return payload && payload.sub ? payload.sub : null;
  }

  async fetchProfile() {
    const data = await apiFetch('/api/auth/me');
    const user = normalizeUser(data);
    setItem(StorageKeys.AUTH_USER, user);
    return user;
  }

  async updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Tidak ada sesi aktif');
    }
    const userId = this.getNumericUserId();
    const fullName = updates.full_name || updates.name;
    if (!userId) {
      throw new Error('Token tidak valid');
    }

    if (fullName) {
      await apiFetch(`/api/users/${userId}/profile`, {
        method: 'PATCH',
        body: { full_name: fullName },
      });
    }

    const updated = normalizeUser({ ...currentUser, ...updates, full_name: fullName || currentUser.full_name });
    setItem(StorageKeys.AUTH_USER, updated);
    return updated;
  }

  async requestPasswordReset(email) {
    const data = await apiFetch('/api/auth/reset-password/request', {
      method: 'POST',
      auth: false,
      body: { email },
    });
    return (data && data.message) || null;
  }

  async confirmPasswordReset({ token, newPassword }) {
    const data = await apiFetch('/api/auth/reset-password/confirm', {
      method: 'POST',
      auth: false,
      body: { token, newPassword },
    });
    return (data && data.message) || null;
  }

  async requestEmailVerification(email) {
    const data = await apiFetch('/api/auth/verify-email/request', {
      method: 'POST',
      auth: false,
      body: { email },
    });
    return (data && data.message) || null;
  }

  async confirmEmailVerification(token) {
    const data = await apiFetch('/api/auth/verify-email/confirm', {
      method: 'POST',
      auth: false,
      body: { token },
    });
    return (data && data.message) || null;
  }

  async getAllUsers() {
    return apiFetch('/api/users');
  }

  async getUserById(id) {
    return apiFetch(`/api/users/${id}`);
  }

  async updateUser(id, data) {
    return apiFetch(`/api/users/${id}`, { method: 'PUT', body: data });
  }

  async deleteUser(id) {
    return apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  }

  updateProfileLocal(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Tidak ada sesi aktif');
    }
    const updated = normalizeUser({ ...currentUser, ...updates });
    setItem(StorageKeys.AUTH_USER, updated);
    return updated;
  }

  removeAuth() {
    removeItem(StorageKeys.AUTH_TOKEN);
    removeItem(StorageKeys.AUTH_USER);
  }
}

export const authService = new AuthService();
export default authService;

export { mapRole };