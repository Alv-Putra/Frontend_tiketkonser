const PREFIX = 'conserid.';

export const StorageKeys = {
  AUTH_USER: `${PREFIX}auth.user`,
  AUTH_TOKEN: `${PREFIX}auth.token`,
  USERS: `${PREFIX}users`,
  FESTIVALS: `${PREFIX}festivals`,
  ORDERS: `${PREFIX}orders`,
  TICKETS: `${PREFIX}tickets`,
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getItem(key) {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be unavailable (private mode / quota)
  }
}

export function removeItem(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearAll() {
  if (!isBrowser()) return;
  try {
    Object.values(StorageKeys).forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
}