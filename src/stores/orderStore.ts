import { create } from 'zustand';
import orderService from '@/services/orderService';
import type { ActionResult, CartItem, Order, Ticket } from '@/types';

export interface OrderState {
  orders: Order[];
  tickets: Ticket[];
  currentOrder: Order | null;
  paymentResult: Record<string, any> | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (args: {
    festivalId: string | number;
    userId?: string | number;
    items: Pick<CartItem, 'ticketTypeId' | 'quantity'>[];
    voucherCode?: string | null;
  }) => Promise<ActionResult>;
  payOrder: (orderId: string | number, paymentMethod: string) => Promise<ActionResult>;
  fetchOrders: (userId: string | number) => Promise<Order[]>;
  fetchTickets: (userId: string | number) => Promise<Ticket[]>;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  tickets: [],
  currentOrder: null,
  paymentResult: null,
  isLoading: false,
  error: null,

  createOrder: async ({ festivalId, userId, items, voucherCode }) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.createOrder({
        festivalId,
        userId,
        items,
        voucherCode,
      });
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  payOrder: async (orderId, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const result = await orderService.payOrder(orderId, paymentMethod);
      set({
        currentOrder: result.order,
        paymentResult: result,
        isLoading: false,
      });
      return { success: true, ...result };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  fetchOrders: async (userId) => {
    set({ isLoading: true });
    try {
      const orders = await orderService.getOrdersByUser(userId);
      set({ orders, isLoading: false });
      return orders;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  fetchTickets: async (userId) => {
    set({ isLoading: true });
    try {
      const tickets = await orderService.getTicketsByUser(userId);
      set({ tickets, isLoading: false });
      return tickets;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  reset: () => {
    set({ currentOrder: null, paymentResult: null, error: null });
  },
}));

export default useOrderStore;