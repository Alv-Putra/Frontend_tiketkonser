import {
  getVouchers,
  findVoucherByCode,
  isVoucherUsed,
  validateVoucher,
  applyVoucherDiscount,
  isVoucherExpired,
} from '@/lib/vouchers';

describe('vouchers', () => {
  describe('getVouchers', () => {
    it('returns the list of default vouchers', () => {
      expect(getVouchers().length).toBeGreaterThan(0);
    });
  });

  describe('findVoucherByCode', () => {
    it('finds a voucher case-insensitively', () => {
      expect(findVoucherByCode('konser10').code).toBe('KONSER10');
    });

    it('trims whitespace', () => {
      expect(findVoucherByCode('  FEST15  ').code).toBe('FEST15');
    });

    it('returns null for unknown code', () => {
      expect(findVoucherByCode('NOPE')).toBeNull();
    });

    it('returns null for empty code', () => {
      expect(findVoucherByCode('')).toBeNull();
    });
  });

  describe('isVoucherUsed', () => {
    it('returns true when code is in used list', () => {
      expect(isVoucherUsed('konser10', ['KONSER10'])).toBe(true);
    });

    it('returns false when code not used', () => {
      expect(isVoucherUsed('konser10', ['FEST15'])).toBe(false);
    });

    it('returns false for an empty code', () => {
      expect(isVoucherUsed('', [])).toBe(false);
    });

    it('defaults used codes to an empty array', () => {
      expect(isVoucherUsed('KONSER10')).toBe(false);
    });
  });

  describe('validateVoucher', () => {
    it('rejects unknown voucher', () => {
      expect(validateVoucher('FAKE', 1000000).valid).toBe(false);
    });

    it('rejects an empty voucher code', () => {
      const result = validateVoucher('', 1000000);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Kode voucher tidak ditemukan');
    });

    it('rejects already used voucher', () => {
      const result = validateVoucher('KONSER10', 1000000, ['KONSER10']);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('sudah pernah digunakan');
    });

    it('rejects voucher below min spend', () => {
      const result = validateVoucher('GAKITU20', 200000);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Minimal belanja');
    });

    it('accepts valid voucher', () => {
      const result = validateVoucher('KONSER10', 500000);
      expect(result.valid).toBe(true);
      expect(result.voucher.code).toBe('KONSER10');
      expect(result.message).toBeNull();
    });
  });

  describe('applyVoucherDiscount', () => {
    it('computes flat discount', () => {
      const voucher = { type: 'flat', value: 50000 };
      expect(applyVoucherDiscount(voucher, 1000000)).toBe(50000);
    });

    it('flat discount never exceeds subtotal', () => {
      const voucher = { type: 'flat', value: 50000 };
      expect(applyVoucherDiscount(voucher, 20000)).toBe(20000);
    });

    it('computes percentage discount without cap', () => {
      const voucher = { type: 'percentage', value: 10, maxDiscount: null };
      expect(applyVoucherDiscount(voucher, 500000)).toBe(50000);
    });

    it('caps percentage discount', () => {
      const voucher = { type: 'percentage', value: 10, maxDiscount: 200000 };
      expect(applyVoucherDiscount(voucher, 3000000)).toBe(200000);
    });
  });

  describe('isVoucherExpired', () => {
    it('returns false when expiresAt is null', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
      expect(isVoucherExpired(null)).toBe(false);
      jest.useRealTimers();
    });

    it('returns true for past expiry', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-01T00:00:00Z'));
      expect(isVoucherExpired('2026-01-01T00:00:00Z')).toBe(true);
      jest.useRealTimers();
    });

    it('returns false for future expiry', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
      expect(isVoucherExpired('2026-06-01T00:00:00Z')).toBe(false);
      jest.useRealTimers();
    });
  });
});