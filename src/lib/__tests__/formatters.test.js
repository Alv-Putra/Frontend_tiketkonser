import {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTimeAgo,
  isExpired,
  isPaymentExpired,
  calculateSubtotal,
  calculateServiceFee,
  calculateTax,
  calculateTotal,
  getTicketQuotaStatus,
  generateOrderNumber,
  generateTicketCode,
  generateQRData,
} from '@/lib/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number as Indonesian Rupiah', () => {
      expect(formatCurrency(350000)).toBe('Rp350.000');
    });

    it('handles string numbers', () => {
      expect(formatCurrency('500000')).toBe('Rp500.000');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('Rp0');
    });

    it('formats decimals', () => {
      expect(formatCurrency(1000.5)).toBe('Rp1.000,5');
    });
  });

  describe('formatDate', () => {
    it('formats an ISO date to Indonesian long format', () => {
      expect(formatDate('2026-05-15T00:00:00Z')).toContain('Mei 2026');
    });

    it('formats with local month names', () => {
      expect(formatDate('2026-01-10T00:00:00Z')).toContain('Januari');
    });
  });

  describe('formatDateShort', () => {
    it('formats a date to short Indonesian format', () => {
      expect(formatDateShort('2026-05-15T00:00:00Z')).toContain('Mei');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time with hour', () => {
      expect(formatDateTime('2026-05-15T14:00:00Z')).toMatch(/Mei 2026, \d{2}:\d{2}/);
    });
  });

  describe('formatTimeAgo', () => {
    it('returns a relative time string', () => {
      const past = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      expect(formatTimeAgo(past)).toContain('lalu');
    });
  });

  describe('isExpired', () => {
    it('returns true for past dates', () => {
      expect(isExpired('2020-01-01T00:00:00Z')).toBe(true);
    });

    it('returns false for future dates', () => {
      expect(isExpired('2099-01-01T00:00:00Z')).toBe(false);
    });
  });

  describe('isPaymentExpired', () => {
    it('returns true when created long ago', () => {
      const createdAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(isPaymentExpired(createdAt, 60)).toBe(true);
    });

    it('returns false when created recently', () => {
      const createdAt = new Date().toISOString();
      expect(isPaymentExpired(createdAt, 60)).toBe(false);
    });

    it('uses default expiry minutes', () => {
      const createdAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
      expect(isPaymentExpired(createdAt)).toBe(true);
    });
  });

  describe('calculateSubtotal', () => {
    it('multiplies price by quantity', () => {
      expect(calculateSubtotal(100000, 3)).toBe(300000);
    });
  });

  describe('calculateServiceFee', () => {
    it('computes 5% by default', () => {
      expect(calculateServiceFee(100000)).toBe(5000);
    });

    it('respects custom percentage', () => {
      expect(calculateServiceFee(100000, 10)).toBe(10000);
    });

    it('rounds up decimals', () => {
      expect(calculateServiceFee(100001, 5)).toBe(5001);
    });
  });

  describe('calculateTax', () => {
    it('computes 11% by default', () => {
      expect(calculateTax(100000)).toBe(11000);
    });

    it('respects custom tax percentage', () => {
      expect(calculateTax(100000, 10)).toBe(10000);
    });

    it('rounds up decimals', () => {
      expect(calculateTax(100001)).toBe(11001);
    });
  });

  describe('calculateTotal', () => {
    it('computes subtotal + fee + tax - discount', () => {
      expect(calculateTotal(100000, 5000, 11000, 0)).toBe(116000);
    });

    it('uses a zero discount by default', () => {
      expect(calculateTotal(100000, 5000, 11000)).toBe(116000);
    });

    it('applies discount', () => {
      expect(calculateTotal(100000, 5000, 11000, 16000)).toBe(100000);
    });

    it('never returns negative', () => {
      expect(calculateTotal(100, 0, 0, 1000)).toBe(0);
    });
  });

  describe('getTicketQuotaStatus', () => {
    it('computes remaining and percentage', () => {
      expect(getTicketQuotaStatus(75, 200)).toEqual({ remaining: 125, percentage: 38, isSoldOut: false });
    });

    it('marks sold out when remaining is zero', () => {
      expect(getTicketQuotaStatus(200, 200)).toEqual({ remaining: 0, percentage: 100, isSoldOut: true });
    });

    it('rounds percentage', () => {
      const result = getTicketQuotaStatus(1, 3);
      expect(result.percentage).toBe(33);
    });
  });

  describe('generateOrderNumber', () => {
    it('returns order numbers prefixed with ORD-', () => {
      expect(generateOrderNumber()).toMatch(/^ORD-/);
    });

    it('generates unique order numbers', () => {
      const a = generateOrderNumber();
      const b = generateOrderNumber();
      expect(a).not.toBe(b);
    });
  });

  describe('generateTicketCode', () => {
    it('returns ticket codes prefixed with TKT-', () => {
      expect(generateTicketCode()).toMatch(/^TKT-/);
    });

    it('generates codes of length 12', () => {
      expect(generateTicketCode()).toHaveLength(12);
    });

    it('generates unique codes', () => {
      const a = generateTicketCode();
      const b = generateTicketCode();
      expect(a).not.toBe(b);
    });
  });

  describe('generateQRData', () => {
    it('serializes the QR payload', () => {
      const data = JSON.parse(generateQRData('TKT-ABC12345', 'f1', 'o1'));
      expect(data).toEqual({ code: 'TKT-ABC12345', festival: 'f1', order: 'o1' });
    });
  });
});