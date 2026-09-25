import { getItem, setItem, removeItem, clearAll, StorageKeys } from '@/lib/storage';

describe('storage', () => {
  afterEach(() => {
    try {
      localStorage.clear();
    } catch {
      // window.localStorage was swapped for a test double
    }
    jest.restoreAllMocks();
  });

  it('exposes storage keys with the conserid prefix', () => {
    expect(StorageKeys.AUTH_USER).toBe('conserid.auth.user');
    expect(StorageKeys.AUTH_TOKEN).toBe('conserid.auth.token');
    expect(StorageKeys.USERS).toBe('conserid.users');
  });

  it('returns null when no value is stored', () => {
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
  });

  it('stores and retrieves JSON values', () => {
    const value = { id: 1, name: 'Budi' };
    setItem(StorageKeys.AUTH_USER, value);
    expect(getItem(StorageKeys.AUTH_USER)).toEqual(value);
  });

  it('returns null when JSON is corrupt', () => {
    localStorage.setItem(StorageKeys.AUTH_USER, '{broken json');
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
  });

  it('returns null when the raw value is an empty string', () => {
    localStorage.setItem(StorageKeys.AUTH_USER, '');
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
  });

  it('removes a stored value', () => {
    setItem(StorageKeys.AUTH_USER, { id: 1 });
    removeItem(StorageKeys.AUTH_USER);
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
  });

  it('clearAll removes every conserid key', () => {
    setItem(StorageKeys.AUTH_USER, { id: 1 });
    setItem(StorageKeys.FESTIVALS, []);
    localStorage.setItem('unrelated', 'keep');
    clearAll();
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    expect(getItem(StorageKeys.FESTIVALS)).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('handles setItem exceptions gracefully', () => {
    const realStorage = window.localStorage;
    window.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Quota exceeded');
      },
      removeItem: () => {},
    };
    expect(() => setItem(StorageKeys.AUTH_USER, { id: 1 })).not.toThrow();
    window.localStorage = realStorage;
  });

  it('handles getItem exceptions gracefully', () => {
    const realStorage = window.localStorage;
    window.localStorage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
    window.localStorage = realStorage;
  });

  it('handles removeItem exceptions gracefully', () => {
    const realStorage = window.localStorage;
    window.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(() => removeItem(StorageKeys.AUTH_USER)).not.toThrow();
    window.localStorage = realStorage;
  });

  it('handles clearAll exceptions gracefully', () => {
    const realStorage = window.localStorage;
    window.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(() => clearAll()).not.toThrow();
    window.localStorage = realStorage;
  });
});