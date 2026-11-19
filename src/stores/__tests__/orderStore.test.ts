import useOrderStore, { useOrderStore as namedOrderStore } from '@/stores/orderStore';
import orderService from '@/services/orderService';
import { storageDB } from '@/services/storageService';
import { mockFestivals } from '@/services/mockData';

async function settle(factory) {
  const promise = factory();
  await jest.runAllTimersAsync();
  return promise;
}

describe('useOrderStore', () => {
  beforeEach(() => {
    localStorage.clear();
    storageDB.festivals = JSON.parse(JSON.stringify(mockFestivals));
    storageDB.orders = [];
    storageDB.tickets = [];
    useOrderStore.setState({
      orders: [],
      tickets: [],
      currentOrder: null,
      paymentResult: null,
      isLoading: false,
      error: null,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('default export resolves to the same store', () => {
    expect(useOrderStore).toBe(namedOrderStore);
  });

  it('creates an order', async () => {
    const result = await settle(() =>
      useOrderStore.getState().createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
      })
    );
    expect(result.success).toBe(true);
    expect(useOrderStore.getState().currentOrder.id).toBe(result.order.id);
  });

  it('returns error when creating order fails', async () => {
    const result = await settle(() =>
      useOrderStore.getState().createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 9999 }],
      })
    );
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(useOrderStore.getState().error).toBeDefined();
  });

  it('pays an order', async () => {
    await createOrderFixture();
    const result = await settle(() =>
      useOrderStore.getState().payOrder(useOrderStore.getState().currentOrder.id, 'ewallet')
    );
    expect(result.success).toBe(true);
    expect(useOrderStore.getState().paymentResult.tickets).toHaveLength(1);
  });

  it('hands payment failure gracefully', async () => {
    const result = await settle(() => useOrderStore.getState().payOrder('missing', 'ewallet'));
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('fetches orders for a user', async () => {
    await createOrderFixture();
    const result = await settle(() => useOrderStore.getState().fetchOrders('u3'));
    expect(result.length).toBe(1);
    expect(useOrderStore.getState().orders.length).toBe(1);
  });

  it('fetches tickets for a user', async () => {
    await createOrderFixture();
    await settle(() =>
      useOrderStore.getState().payOrder(useOrderStore.getState().currentOrder.id, 'qris')
    );
    const result = await settle(() => useOrderStore.getState().fetchTickets('u3'));
    expect(result.length).toBe(1);
    expect(useOrderStore.getState().tickets.length).toBe(1);
  });

  it('resets store state', () => {
    useOrderStore.setState({ currentOrder: { id: 'o1' }, paymentResult: { ok: true }, error: 'x' });
    useOrderStore.getState().reset();
    const state = useOrderStore.getState();
    expect(state.currentOrder).toBeNull();
    expect(state.paymentResult).toBeNull();
    expect(state.error).toBeNull();
  });

  it('returns empty orders when fetching fails', async () => {
    jest.spyOn(orderService, 'getOrdersByUser').mockRejectedValue(new Error('Gagal'));
    const promise = useOrderStore.getState().fetchOrders('u3');
    jest.runAllTimers();
    const result = await promise;
    expect(result).toEqual([]);
    expect(useOrderStore.getState().error).toBe('Gagal');
    expect(useOrderStore.getState().isLoading).toBe(false);
  });

  it('returns empty tickets when fetching fails', async () => {
    jest.spyOn(orderService, 'getTicketsByUser').mockRejectedValue(new Error('Gagal'));
    const promise = useOrderStore.getState().fetchTickets('u3');
    jest.runAllTimers();
    const result = await promise;
    expect(result).toEqual([]);
    expect(useOrderStore.getState().error).toBe('Gagal');
    expect(useOrderStore.getState().isLoading).toBe(false);
  });

  function createOrderFixture() {
    return settle(() =>
      useOrderStore.getState().createOrder({
        festivalId: 'f1',
        userId: 'u3',
        items: [{ ticketTypeId: 'f1t4', quantity: 1 }],
      })
    );
  }
});