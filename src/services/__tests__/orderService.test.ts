import orderService, {
  OrderService,
  orderService as namedOrderService,
} from '@/services/orderService';
import { storageDB } from '@/services/storageService';
import { mockFestivals } from '@/services/mockData';
import { ORDER_STATUS, PAYMENT_STATUS, E_TICKET_STATUS } from '@/lib/constants';

async function settle(factory) {
  const promise = factory();
  await jest.runAllTimersAsync();
  return promise;
}

function expectReject(factory, message) {
  const promise = factory();
  const assertion = expect(promise).rejects.toThrow(message);
  return jest.runAllTimersAsync().then(() => assertion);
}

describe('orderService', () => {
  beforeEach(() => {
    localStorage.clear();
    storageDB.festivals = JSON.parse(JSON.stringify(mockFestivals));
    storageDB.orders = [];
    storageDB.tickets = [];
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('exposes the service instance and class', () => {
    expect(namedOrderService).toBe(orderService);
    expect(orderService).toBeInstanceOf(OrderService);
  });

  it('creates an order with computed totals', async () => {
    const order = await settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 2 }],
      })
    );
    expect(order.orderNumber).toMatch(/^ORD-/);
    expect(order.status).toBe(ORDER_STATUS.WAITING_PAYMENT);
    expect(order.items[0].quantity).toBe(2);
    expect(order.subtotal).toBe(700000);
    expect(order.serviceFee).toBeGreaterThan(0);
    expect(order.tax).toBeGreaterThan(0);
    expect(order.total).toBe(order.subtotal + order.serviceFee + order.tax);
  });

  it('applies a percentage voucher discount', async () => {
    const order = await settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 2 }],
        voucherCode: 'KONSER10',
      })
    );
    expect(order.discount).toBeGreaterThan(0);
    expect(order.voucherCode).toBe('KONSER10');
    expect(order.total).toBe(order.subtotal + order.serviceFee + order.tax - order.discount);
  });

  it('throws for unknown festival', async () => {
    await expectReject(
      () => orderService.createOrder({ festivalId: 'missing', userId: 'u3', items: [] }),
      'Festival tidak ditemukan'
    );
  });

  it('falls back to mock festivals when storage is empty', async () => {
    storageDB.festivals = null;
    const order = await settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
      })
    );
    expect(order.festivalId).toBe('f1');
  });

  it('throws for unpublished festival', async () => {
    storageDB.festivals = mockFestivals.map((f) =>
      f.id === 'f1' ? { ...f, status: 'pending_approval' } : f
    );
    await expectReject(
      () =>
        orderService.createOrder({
          festivalId: 'f1',
          userId: 'u3',
          items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
        }),
      'Festival belum dipublikasikan'
    );
  });

  it('throws when quota is insufficient', async () => {
    const soldOutFestival = storageDB.festivals.find((f) => f.id === 'f1');
    soldOutFestival.ticketTypes = soldOutFestival.ticketTypes.map((t) => ({ ...t, sold: t.quota }));
    await expectReject(
      () =>
        orderService.createOrder({
          festivalId: 'f1',
          userId: 'u3',
          items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
        }),
      /Kuota tiket/
    );
  });

  it('throws for unknown ticket type', async () => {
    await expectReject(
      () =>
        orderService.createOrder({
          festivalId: 'f1',
          userId: 'u3',
          items: [{ ticketTypeId: 'nope', quantity: 1 }],
        }),
      'Jenis tiket tidak ditemukan'
    );
  });

  it('throws for invalid voucher', async () => {
    await expectReject(
      () =>
        orderService.createOrder({
          festivalId: 'f1',
          userId: 'u3',
          items: [{ ticketTypeId: 'f1t4', quantity: 2 }],
          voucherCode: 'INVALID',
        }),
      'Kode voucher tidak ditemukan'
    );
  });

  it('rejects a voucher already used by the same user', async () => {
    await settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
        voucherCode: 'KONSER10',
      })
    );
    await expectReject(
      () =>
        orderService.createOrder({
          festivalId: 'f1',
          userId: 'u3',
          items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
          voucherCode: 'KONSER10',
        }),
      /sudah pernah digunakan/
    );
  });

  it('reduces ticket occupancy after order', async () => {
    const before = storageDB.festivals.find((f) => f.id === 'f1').ticketTypes.find((t) => t.id === 'f1t4').sold;
    await settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 2 }],
      })
    );
    const after = storageDB.festivals.find((f) => f.id === 'f1').ticketTypes.find((t) => t.id === 'f1t4').sold;
    expect(after).toBe(before + 2);
  });

  it('fetches orders by user sorted descending', async () => {
    await createOrderFixture();
    const orders = await settle(() => orderService.getOrdersByUser('u3'));
    expect(orders.length).toBe(1);
  });

  it('treats missing stored orders and tickets as empty lists', async () => {
    storageDB.orders = null;
    storageDB.tickets = null;
    const orders = await settle(() => orderService.getOrdersByUser('u3'));
    expect(orders).toEqual([]);
    const tickets = await settle(() => orderService.getTicketsByUser('u3'));
    expect(tickets).toEqual([]);
  });

  it('fetches all orders when userId is all', async () => {
    await createOrderFixture();
    const orders = await settle(() => orderService.getOrdersByUser('all'));
    expect(orders.length).toBe(1);
  });

  it('sorts multiple orders for a user by newest first', async () => {
    await createOrderFixture();
    await createOrderFixture();
    const orders = await settle(() => orderService.getOrdersByUser('u3'));
    expect(orders.length).toBe(2);
    expect(new Date(orders[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(orders[1].createdAt).getTime()
    );
  });

  it('gets an order by id', async () => {
    const order = await createOrderFixture();
    const result = await settle(() => orderService.getOrderById(order.id));
    expect(result.id).toBe(order.id);
  });

  it('returns null for missing order', async () => {
    const result = await settle(() => orderService.getOrderById('missing'));
    expect(result).toBeNull();
  });

  it('gets an order by number', async () => {
    const order = await createOrderFixture();
    const result = await settle(() => orderService.getOrderByNumber(order.orderNumber));
    expect(result.orderNumber).toBe(order.orderNumber);
  });

  it('returns null for an unknown order number', async () => {
    const result = await settle(() => orderService.getOrderByNumber('ORD-NOPE'));
    expect(result).toBeNull();
  });

  it('pays an order and generates e-tickets', async () => {
    const order = await createOrderFixture();
    const result = await settle(() => orderService.payOrder(order.id, 'ewallet'));
    expect(result.order.status).toBe(ORDER_STATUS.PAID);
    expect(result.order.paymentStatus).toBe(PAYMENT_STATUS.SUCCESS);
    expect(result.order.paymentMethod).toBe('ewallet');
    expect(result.order.paidAt).toBeDefined();
    expect(result.tickets).toHaveLength(2);
    expect(result.tickets[0].qrData).toBeDefined();
    expect(result.tickets[0].status).toBe(E_TICKET_STATUS.VALID);
  });

  it('throws when paying a missing order', async () => {
    await expectReject(() => orderService.payOrder('missing', 'ewallet'), 'Order tidak ditemukan');
  });

  it('fetches tickets by user', async () => {
    const order = await createOrderFixture();
    await settle(() => orderService.payOrder(order.id, 'qris'));
    const tickets = await settle(() => orderService.getTicketsByUser('u3'));
    expect(tickets.length).toBe(2);
  });

  it('gets a ticket by code', async () => {
    const { ticket } = await payOrderFixture();
    const result = await settle(() => orderService.getTicketByCode(ticket.code));
    expect(result.code).toBe(ticket.code);
  });

  it('returns null for unknown ticket code', async () => {
    const result = await settle(() => orderService.getTicketByCode('TKT-UNKNOWN'));
    expect(result).toBeNull();
  });

  it('validates a valid ticket', async () => {
    const { ticket } = await payOrderFixture();
    const result = await settle(() => orderService.validateTicket(ticket.code));
    expect(result.valid).toBe(true);
  });

  it('rejects an unknown ticket code', async () => {
    const result = await settle(() => orderService.validateTicket('TKT-UNKNOWN'));
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('QR Code tidak ditemukan');
  });

  it('rejects an already used ticket', async () => {
    const { ticket } = await payOrderFixture();
    await settle(() => orderService.checkIn(ticket.code));
    const result = await settle(() => orderService.validateTicket(ticket.code));
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Tiket sudah digunakan');
  });

  it('rejects a cancelled ticket', async () => {
    const { ticket } = await payOrderFixture();
    storageDB.tickets = storageDB.tickets.map((t) =>
      t.code === ticket.code ? { ...t, status: E_TICKET_STATUS.CANCELLED } : t
    );
    const result = await settle(() => orderService.validateTicket(ticket.code));
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Tiket telah dibatalkan');
  });

  it('checks in a valid ticket and records usedAt', async () => {
    const { ticket } = await payOrderFixture();
    const result = await settle(() => orderService.checkIn(ticket.code));
    expect(result.valid).toBe(true);
    expect(result.ticket.status).toBe(E_TICKET_STATUS.USED);
    expect(result.ticket.usedAt).toBeDefined();
  });

  it('checkIn returns invalid result for unknown code', async () => {
    const result = await settle(() => orderService.checkIn('TKT-UNKNOWN'));
    expect(result.valid).toBe(false);
  });

  it('cancels a waiting payment order', async () => {
    const order = await createOrderFixture();
    const result = await settle(() => orderService.cancelOrder(order.id));
    expect(result.status).toBe(ORDER_STATUS.CANCELLED);
  });

  it('cannot cancel a paid order', async () => {
    const order = await createOrderFixture();
    await settle(() => orderService.payOrder(order.id, 'ewallet'));
    await expectReject(() => orderService.cancelOrder(order.id), 'Order yang sudah dibayar tidak dapat dibatalkan');
  });

  it('throws when cancelling a missing order', async () => {
    await expectReject(() => orderService.cancelOrder('missing'), 'Order tidak ditemukan');
  });

  function createOrderFixture() {
    return settle(() =>
      orderService.createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [
          { ticketTypeId: 'f1t4', quantity: 1 },
          { ticketTypeId: 'f1t3', quantity: 1 },
        ],
      })
    );
  }

  async function payOrderFixture() {
    const order = await createOrderFixture();
    const result = await settle(() => orderService.payOrder(order.id, 'bank_transfer'));
    return { order: result.order, ticket: result.tickets[0] };
  }
});