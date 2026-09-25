import { storageDB, persistOrders, persistTickets, persistFestivals } from './storageService';
import { mockFestivals } from './mockData';
import { ORDER_STATUS, PAYMENT_STATUS, E_TICKET_STATUS, FESTIVAL_STATUS } from '@/lib/constants';
import {
  calculateServiceFee,
  calculateTax,
  calculateTotal,
  generateOrderNumber,
  generateTicketCode,
  generateQRData,
} from '@/lib/formatters';
import { findVoucherByCode, validateVoucher, applyVoucherDiscount } from '@/lib/vouchers';

const LATENCY = 500;
const PAYMENT_LATENCY = 1500;

function wait(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFestivals() {
  return storageDB.festivals && storageDB.festivals.length ? storageDB.festivals : mockFestivals;
}

function getOrders() {
  return storageDB.orders || [];
}

function getTickets() {
  return storageDB.tickets || [];
}

function reduceTicketOccupancy(festival, orderItems) {
  return {
    ...festival,
    ticketTypes: festival.ticketTypes.map((t) => {
      const ordered = orderItems.find((i) => i.ticketTypeId === t.id);
      return ordered ? { ...t, sold: t.sold + ordered.quantity } : t;
    }),
  };
}

export class OrderService {
  async createOrder({ festivalId, userId, items, voucherCode }) {
    await wait();
    const festivals = getFestivals();
    const festival = festivals.find((f) => f.id === festivalId);
    if (!festival) throw new Error('Festival tidak ditemukan');
    if (festival.status !== FESTIVAL_STATUS.PUBLISHED) {
      throw new Error('Festival belum dipublikasikan');
    }

    const orders = getOrders();
    const usedCodes = orders
      .filter((o) => o.userId === userId && o.voucherCode)
      .map((o) => o.voucherCode);

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const type = festival.ticketTypes.find((t) => t.id === item.ticketTypeId);
      if (!type) throw new Error('Jenis tiket tidak ditemukan');
      const remaining = type.quota - type.sold;
      if (item.quantity > remaining) {
        throw new Error(`Kuota tiket ${type.name} tidak mencukupi`);
      }
      subtotal += type.price * item.quantity;
      return {
        ticketTypeId: type.id,
        name: type.name,
        price: type.price,
        quantity: item.quantity,
        total: type.price * item.quantity,
      };
    });

    const serviceFee = calculateServiceFee(subtotal);
    const tax = calculateTax(subtotal + serviceFee);

    let discount = 0;
    let appliedVoucher = null;
    if (voucherCode) {
      const result = validateVoucher(voucherCode, subtotal, usedCodes);
      if (!result.valid) throw new Error(result.message);
      appliedVoucher = result.voucher;
      discount = Math.round(applyVoucherDiscount(appliedVoucher, subtotal));
    }

    const total = calculateTotal(subtotal, serviceFee, tax, discount);

    const order = {
      id: `o${Date.now()}`,
      orderNumber: generateOrderNumber(),
      festivalId,
      festivalTitle: festival.title,
      festivalDate: festival.date,
      venue: `${festival.venue}, ${festival.city}`,
      userId,
      items: orderItems,
      subtotal,
      serviceFee,
      tax,
      discount,
      voucherCode: appliedVoucher ? appliedVoucher.code : null,
      total,
      status: ORDER_STATUS.WAITING_PAYMENT,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentMethod: null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    const updatedFestivals = festivals.map((f) =>
      f.id === festivalId ? reduceTicketOccupancy(f, orderItems) : f
    );
    persistFestivals(updatedFestivals);
    persistOrders([...orders, order]);

    return order;
  }

  async getOrdersByUser(userId) {
    await wait(200);
    const allOrders = getOrders();
    const filtered = userId === 'all' ? allOrders : allOrders.filter((o) => o.userId === userId);
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getOrderById(orderId) {
    await wait(150);
    return getOrders().find((o) => o.id === orderId) || null;
  }

  async getOrderByNumber(orderNumber) {
    await wait(150);
    return getOrders().find((o) => o.orderNumber === orderNumber) || null;
  }

  async payOrder(orderId, paymentMethod) {
    await wait(PAYMENT_LATENCY);
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order tidak ditemukan');

    const now = new Date().toISOString();
    const paid = {
      ...orders[index],
      status: ORDER_STATUS.PAID,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      paymentMethod,
      paidAt: now,
    };
    orders[index] = paid;
    persistOrders(orders);

    const tickets = this._generateTickets(paid);
    persistTickets([...getTickets(), ...tickets]);

    return { order: paid, tickets };
  }

  _generateTickets(order) {
    const tickets = [];
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const code = generateTicketCode();
        tickets.push({
          id: `t${Date.now()}-${tickets.length}`,
          code,
          orderId: order.id,
          orderNumber: order.orderNumber,
          festivalId: order.festivalId,
          festivalTitle: order.festivalTitle,
          festivalDate: order.festivalDate,
          venue: order.venue,
          ticketTypeName: item.name,
          price: item.price,
          userId: order.userId,
          qrData: generateQRData(code, order.festivalId, order.id),
          status: E_TICKET_STATUS.VALID,
          usedAt: null,
          createdAt: new Date().toISOString(),
        });
      }
    });
    return tickets;
  }

  async getTicketsByUser(userId) {
    await wait(200);
    return getTickets()
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getTicketByCode(code) {
    await wait(150);
    return getTickets().find((t) => t.code === code) || null;
  }

  async validateTicket(code) {
    await wait(300);
    const ticket = getTickets().find((t) => t.code === code);
    if (!ticket) {
      return { valid: false, reason: 'QR Code tidak ditemukan', ticket: null };
    }
    if (ticket.status === E_TICKET_STATUS.USED) {
      return { valid: false, reason: 'Tiket sudah digunakan', ticket };
    }
    if (ticket.status === E_TICKET_STATUS.CANCELLED) {
      return { valid: false, reason: 'Tiket telah dibatalkan', ticket };
    }
    return { valid: true, reason: null, ticket };
  }

  async checkIn(code) {
    await wait(400);
    const result = await this.validateTicket(code);
    if (!result.valid) {
      return result;
    }
    const tickets = getTickets();
    const index = tickets.findIndex((t) => t.code === code);
    tickets[index] = {
      ...tickets[index],
      status: E_TICKET_STATUS.USED,
      usedAt: new Date().toISOString(),
    };
    persistTickets(tickets);
    return { valid: true, reason: null, ticket: tickets[index] };
  }

  async cancelOrder(orderId) {
    await wait(300);
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order tidak ditemukan');
    if (orders[index].status === ORDER_STATUS.PAID) {
      throw new Error('Order yang sudah dibayar tidak dapat dibatalkan');
    }
    orders[index] = { ...orders[index], status: ORDER_STATUS.CANCELLED };
    persistOrders(orders);
    return orders[index];
  }
}

export const orderService = new OrderService();
export default orderService;