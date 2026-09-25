import { StorageKeys, getItem, setItem } from '@/lib/storage';
import { mockFestivals } from './mockData';

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeStorage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStorageSnapshot() {
  return {
    festivals:
      storageDB.festivals && storageDB.festivals.length
        ? storageDB.festivals
        : mockFestivals,
    orders: storageDB.orders || [],
  };
}

export const storageDB = {
  festivals: getItem(StorageKeys.FESTIVALS),
  orders: getItem(StorageKeys.ORDERS),
  tickets: getItem(StorageKeys.TICKETS),
  users: getItem(StorageKeys.USERS),
};

export function persistFestivals(festivals) {
  storageDB.festivals = festivals;
  setItem(StorageKeys.FESTIVALS, festivals);
  notify();
}

export function persistOrders(orders) {
  storageDB.orders = orders;
  setItem(StorageKeys.ORDERS, orders);
  notify();
}

export function persistTickets(tickets) {
  storageDB.tickets = tickets;
  setItem(StorageKeys.TICKETS, tickets);
  notify();
}

export function persistUsers(users) {
  storageDB.users = users;
  setItem(StorageKeys.USERS, users);
  notify();
}