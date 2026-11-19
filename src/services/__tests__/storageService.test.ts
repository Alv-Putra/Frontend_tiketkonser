import { storageDB, subscribeStorage, getStorageSnapshot, persistFestivals, persistOrders, persistTickets, persistUsers } from '@/services/storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    storageDB.festivals = null;
    storageDB.orders = null;
    storageDB.tickets = null;
    storageDB.users = null;
  });

  it('persists festivals and updates the in-memory db', () => {
    const festivals = [{ id: 'f1' }];
    persistFestivals(festivals);
    expect(storageDB.festivals).toBe(festivals);
    expect(localStorage.getItem('conserid.festivals')).toBe(JSON.stringify(festivals));
  });

  it('persists orders and updates the in-memory db', () => {
    const orders = [{ id: 'o1' }];
    persistOrders(orders);
    expect(storageDB.orders).toBe(orders);
    expect(localStorage.getItem('conserid.orders')).toBe(JSON.stringify(orders));
  });

  it('persists tickets and updates the in-memory db', () => {
    const tickets = [{ id: 't1' }];
    persistTickets(tickets);
    expect(storageDB.tickets).toBe(tickets);
    expect(localStorage.getItem('conserid.tickets')).toBe(JSON.stringify(tickets));
  });

  it('persists users and updates the in-memory db', () => {
    const users = [{ id: 'u1' }];
    persistUsers(users);
    expect(storageDB.users).toBe(users);
    expect(localStorage.getItem('conserid.users')).toBe(JSON.stringify(users));
  });

  it('subscribes a listener, notifies on persist and unsubscribes', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeStorage(listener);
    persistFestivals([{ id: 'f1' }]);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    persistOrders([{ id: 'o1' }]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('returns fallback festivals from getStorageSnapshot', () => {
    const snapshot = getStorageSnapshot();
    expect(snapshot.festivals).toBeDefined();
    expect(snapshot.orders).toEqual([]);
  });

  it('returns persisted festivals and orders from getStorageSnapshot', () => {
    persistFestivals([{ id: 'f1' }]);
    persistOrders([{ id: 'o1' }]);
    const snapshot = getStorageSnapshot();
    expect(snapshot.festivals).toEqual([{ id: 'f1' }]);
    expect(snapshot.orders).toEqual([{ id: 'o1' }]);
  });
});