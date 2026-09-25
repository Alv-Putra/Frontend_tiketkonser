import { create } from 'zustand';
import { MAX_TICKET_PER_ORDER, SERVICE_FEE_PERCENT, TAX_PERCENT } from '@/lib/constants';
import {
  calculateSubtotal,
  calculateServiceFee,
  calculateTax,
  calculateTotal,
} from '@/lib/formatters';

export const useCartStore = create((set, get) => ({
  festivalId: null,
  festivalTitle: null,
  items: [],
  voucherCode: null,
  voucherDiscount: 0,

  initializeCart: ({ festivalId, festivalTitle }) => {
    set({ festivalId, festivalTitle, items: [], voucherCode: null, voucherDiscount: 0 });
  },

  addItem: ({ ticketTypeId, name, price, quantity }) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.ticketTypeId === ticketTypeId);

    let nextItems;
    if (existingIndex !== -1) {
      nextItems = items.map((item, i) =>
        i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      nextItems = [...items, { ticketTypeId, name, price, quantity }];
    }

    const totalQuantity = nextItems.reduce((sum, i) => sum + i.quantity, 0);
    if (totalQuantity > MAX_TICKET_PER_ORDER) {
      return { success: false, error: `Maksimal ${MAX_TICKET_PER_ORDER} tiket per order` };
    }

    set({ items: nextItems });
    return { success: true };
  },

  updateQuantity: (ticketTypeId, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      set({ items: items.filter((i) => i.ticketTypeId !== ticketTypeId) });
      return;
    }
    set({
      items: items.map((i) =>
        i.ticketTypeId === ticketTypeId ? { ...i, quantity } : i
      ),
    });
  },

  removeItem: (ticketTypeId) => {
    const { items } = get();
    set({ items: items.filter((i) => i.ticketTypeId !== ticketTypeId) });
  },

  applyVoucher: (voucher, discount) => {
    set({ voucherCode: voucher.code, voucherDiscount: discount });
  },

  removeVoucher: () => {
    set({ voucherCode: null, voucherDiscount: 0 });
  },

  clearCart: () => {
    set({ festivalId: null, festivalTitle: null, items: [], voucherCode: null, voucherDiscount: 0 });
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, i) => sum + calculateSubtotal(i.price, i.quantity), 0);
  },

  getServiceFee: () => {
    return calculateServiceFee(get().getSubtotal(), SERVICE_FEE_PERCENT);
  },

  getTax: () => {
    return calculateTax(get().getSubtotal() + get().getServiceFee(), TAX_PERCENT);
  },

  getTotal: () => {
    const { getSubtotal, getServiceFee, getTax } = get();
    return calculateTotal(
      getSubtotal(),
      getServiceFee(),
      getTax(),
      get().voucherDiscount
    );
  },

  isEmpty: () => get().items.length === 0,
}));

export default useCartStore;