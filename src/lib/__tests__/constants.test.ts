import {
  ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  TICKET_STATUS,
  E_TICKET_STATUS,
  FESTIVAL_STATUS,
  CHECKIN_RESULT,
  VOUCHER_DISCOUNT_TYPE,
  TICKET_TYPE_STATUS,
  PAYMENT_METHODS,
  SERVICE_FEE_PERCENT,
  TAX_PERCENT,
  DEFAULT_MAX_TICKETS_PER_ORDER,
  MAX_TICKET_PER_ORDER,
  MIN_TICKET_PER_ORDER,
  ORDER_EXPIRY_MINUTES,
  RATE_LIMIT,
  SORT_OPTIONS,
  GENRE_OPTIONS,
  PRICE_RANGES,
  FESTIVAL_CATEGORIES,
} from '@/lib/constants';

describe('constants', () => {
  it('defines user roles including staff', () => {
    expect(ROLES).toEqual({
      GUEST: 'guest',
      CUSTOMER: 'customer',
      ORGANIZER: 'organizer',
      ADMIN: 'admin',
      STAFF: 'staff',
    });
  });

  it('defines order statuses', () => {
    expect(Object.values(ORDER_STATUS)).toEqual([
      'pending',
      'waiting_payment',
      'paid',
      'expired',
      'cancelled',
      'refunded',
    ]);
  });

  it('defines payment statuses', () => {
    expect(Object.values(PAYMENT_STATUS).sort()).toEqual([
      'expired',
      'failed',
      'pending',
      'refunded',
      'success',
    ]);
  });

  it('defines ticket statuses', () => {
    expect(Object.values(TICKET_STATUS)).toEqual([
      'active',
      'used',
      'cancelled',
      'refunded',
    ]);
  });

  it('defines e-ticket statuses', () => {
    expect(Object.values(E_TICKET_STATUS)).toEqual([
      'active',
      'active',
      'used',
      'cancelled',
      'refunded',
    ]);
  });

  it('defines festival statuses', () => {
    expect(Object.values(FESTIVAL_STATUS)).toEqual([
      'draft',
      'pending_review',
      'approved',
      'rejected',
      'published',
      'ongoing',
      'finished',
      'cancelled',
    ]);
  });

  it('defines check-in results and voucher discount types', () => {
    expect(CHECKIN_RESULT).toEqual({
      VALID: 'valid',
      NOT_FOUND: 'not_found',
      ALREADY_USED: 'already_used',
      CANCELLED: 'cancelled',
      WRONG_EVENT: 'wrong_event',
      INVALID_STATUS: 'invalid_status',
    });
    expect(VOUCHER_DISCOUNT_TYPE).toEqual({
      PERCENTAGE: 'percentage',
      FIXED: 'fixed',
    });
    expect(TICKET_TYPE_STATUS).toEqual({
      AVAILABLE: 'available',
      SOLD_OUT: 'sold_out',
      COMING_SOON: 'coming_soon',
      CLOSED: 'closed',
    });
  });

  it('defines payment methods with unique ids', () => {
    expect(PAYMENT_METHODS.map((m) => m.id)).toEqual([
      'bank_transfer',
      'ewallet',
      'credit_card',
      'qris',
    ]);
    expect(PAYMENT_METHODS.every((m) => m.name && m.icon && m.description)).toBe(true);
  });

  it('defines fees and ticket limits', () => {
    expect(SERVICE_FEE_PERCENT).toBe(5);
    expect(TAX_PERCENT).toBe(11);
    expect(DEFAULT_MAX_TICKETS_PER_ORDER).toBe(5);
    expect(MAX_TICKET_PER_ORDER).toBe(5);
    expect(MIN_TICKET_PER_ORDER).toBe(1);
    expect(ORDER_EXPIRY_MINUTES).toBe(30);
  });

  it('defines rate limits for every endpoint group', () => {
    expect(RATE_LIMIT.LOGIN.maxAttempts).toBeGreaterThan(0);
    expect(RATE_LIMIT.REGISTER.maxAttempts).toBeGreaterThan(0);
    expect(RATE_LIMIT.CHECKOUT.maxAttempts).toBeGreaterThan(0);
    expect(RATE_LIMIT.SEARCH.maxAttempts).toBeGreaterThan(0);
    expect(Object.keys(RATE_LIMIT).every((k) => RATE_LIMIT[k].windowMs > 0)).toBe(true);
  });

  it('defines sort options', () => {
    expect(SORT_OPTIONS.map((o) => o.value)).toEqual([
      'newest',
      'nearest',
      'cheapest',
      'expensive',
      'popular',
    ]);
    expect(SORT_OPTIONS.every((o) => o.label)).toBe(true);
  });

  it('defines genre options', () => {
    expect(GENRE_OPTIONS).toContain('Pop');
    expect(GENRE_OPTIONS).toContain('Rock');
    expect(GENRE_OPTIONS).toContain('Jazz');
    expect(GENRE_OPTIONS.length).toBeGreaterThan(5);
  });

  it('defines price ranges', () => {
    expect(PRICE_RANGES).toHaveLength(4);
    expect(PRICE_RANGES[0]).toEqual({ label: 'Di bawah Rp200.000', min: 0, max: 200000 });
    expect(PRICE_RANGES[3].max).toBe(Infinity);
    expect(PRICE_RANGES.every((p) => p.min < p.max)).toBe(true);
  });

  it('defines festival categories from ERD', () => {
    expect(FESTIVAL_CATEGORIES).toHaveLength(8);
    expect(FESTIVAL_CATEGORIES.map((c) => c.slug)).toEqual([
      'musik',
      'kuliner',
      'seni',
      'budaya',
      'teknologi',
      'olahraga',
      'film',
      'lainnya',
    ]);
  });
});