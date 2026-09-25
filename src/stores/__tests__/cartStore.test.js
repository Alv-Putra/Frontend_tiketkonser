import useCartStore, { useCartStore as namedCartStore } from '@/stores/cartStore';
import { MAX_TICKET_PER_ORDER } from '@/lib/constants';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('default export resolves to the same store', () => {
    expect(useCartStore).toBe(namedCartStore);
  });

  it('initializes cart with festival metadata', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    const state = useCartStore.getState();
    expect(state.festivalId).toBe('f1');
    expect(state.festivalTitle).toBe('Java Jazz');
    expect(state.items).toEqual([]);
  });

  it('adds a new item', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    const result = useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    expect(result.success).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('merges quantity for the same ticket type', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 3 });
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('merges quantity for an existing item while keeping other items', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t2', name: 'CAT', price: 50000, quantity: 1 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 3 });
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.ticketTypeId === 'f1t1').quantity).toBe(5);
    expect(items.find((i) => i.ticketTypeId === 'f1t2').quantity).toBe(1);
  });

  it('rejects when total quantity exceeds the maximum', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    const result = useCartStore.getState().addItem({
      ticketTypeId: 'f1t1',
      name: 'VIP',
      price: 100000,
      quantity: MAX_TICKET_PER_ORDER + 1,
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Maksimal');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity of an existing item', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().updateQuantity('f1t1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('updateQuantity only changes the target item', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t2', name: 'CAT', price: 50000, quantity: 1 });
    useCartStore.getState().updateQuantity('f1t1', 4);
    const items = useCartStore.getState().items;
    expect(items.find((i) => i.ticketTypeId === 'f1t1').quantity).toBe(4);
    expect(items.find((i) => i.ticketTypeId === 'f1t2').quantity).toBe(1);
  });

  it('removes an item when quantity drops to zero or below', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().updateQuantity('f1t1', 0);
    expect(useCartStore.getState().isEmpty()).toBe(true);
  });

  it('removes an item by ticket type id', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t2', name: 'CAT', price: 50000, quantity: 1 });
    useCartStore.getState().removeItem('f1t1');
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].ticketTypeId).toBe('f1t2');
  });

  it('computes subtotal', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t2', name: 'CAT', price: 50000, quantity: 1 });
    expect(useCartStore.getState().getSubtotal()).toBe(250000);
  });

  it('computes service fee', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    expect(useCartStore.getState().getServiceFee()).toBe(10000);
  });

  it('computes tax on subtotal plus service fee', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    expect(useCartStore.getState().getTax()).toBe(23100);
  });

  it('computes total including discount', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().applyVoucher({ code: 'FLAT50' }, 50000);
    const total = useCartStore.getState().getTotal();
    expect(total).toBe(200000 + 10000 + 23100 - 50000);
  });

  it('applies and removes a voucher', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().applyVoucher({ code: 'KONSER10' }, 10000);
    expect(useCartStore.getState().voucherCode).toBe('KONSER10');
    expect(useCartStore.getState().voucherDiscount).toBe(10000);
    useCartStore.getState().removeVoucher();
    expect(useCartStore.getState().voucherCode).toBeNull();
    expect(useCartStore.getState().voucherDiscount).toBe(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 2 });
    useCartStore.getState().clearCart();
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.festivalId).toBeNull();
    expect(state.isEmpty()).toBe(true);
  });

  it('isEmpty returns true initially', () => {
    expect(useCartStore.getState().isEmpty()).toBe(true);
  });

  it('isEmpty returns false with items', () => {
    useCartStore.getState().initializeCart({ festivalId: 'f1', festivalTitle: 'Java Jazz' });
    useCartStore.getState().addItem({ ticketTypeId: 'f1t1', name: 'VIP', price: 100000, quantity: 1 });
    expect(useCartStore.getState().isEmpty()).toBe(false);
  });
});