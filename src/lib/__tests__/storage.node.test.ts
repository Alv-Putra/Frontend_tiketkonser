/**
 * @jest-environment node
 */
import { getItem, setItem, removeItem, clearAll, StorageKeys } from '@/lib/storage';

describe('storage without a window global', () => {
  it('getItem returns null', () => {
    expect(getItem(StorageKeys.AUTH_USER)).toBeNull();
  });

  it('setItem no-ops silently', () => {
    expect(() => setItem(StorageKeys.AUTH_USER, { id: 1 })).not.toThrow();
  });

  it('removeItem no-ops silently', () => {
    expect(() => removeItem(StorageKeys.AUTH_USER)).not.toThrow();
  });

  it('clearAll no-ops silently', () => {
    expect(() => clearAll()).not.toThrow();
  });
});