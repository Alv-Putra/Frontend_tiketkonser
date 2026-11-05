import { isBefore } from 'date-fns';

const defaultVouchers = [
  {
    code: 'KONSER10',
    type: 'percentage',
    value: 10,
    minSpend: 0,
    maxDiscount: 200000,
  },
  {
    code: 'FEST15',
    type: 'percentage',
    value: 15,
    minSpend: 500000,
    maxDiscount: 500000,
  },
  {
    code: 'GAKITU20',
    type: 'percentage',
    value: 20,
    minSpend: 1000000,
    maxDiscount: 1000000,
  },
  {
    code: 'FLAT50',
    type: 'flat',
    value: 50000,
    minSpend: 300000,
    maxDiscount: null,
  },
  {
    code: 'VIP100',
    type: 'flat',
    value: 100000,
    minSpend: 500000,
    maxDiscount: null,
  },
];

export function getVouchers() {
  return defaultVouchers;
}

export function findVoucherByCode(code, usedCodes = []) {
  const normalized = String(code || '').trim().toUpperCase();
  return defaultVouchers.find((v) => v.code === normalized) || null;
}

export function isVoucherUsed(code, usedCodes = []) {
  return usedCodes.includes(String(code || '').toUpperCase());
}

export function validateVoucher(code, subtotal, usedCodes = []) {
  const normalized = String(code || '').trim().toUpperCase();
  const voucher = findVoucherByCode(normalized);

  if (!voucher) {
    return { valid: false, message: 'Kode voucher tidak ditemukan' };
  }
  if (isVoucherUsed(normalized, usedCodes)) {
    return { valid: false, message: 'Kode voucher sudah pernah digunakan' };
  }
  if (voucher.minSpend > subtotal) {
    return {
      valid: false,
      message: `Minimal belanja Rp${voucher.minSpend.toLocaleString('id-ID')} untuk voucher ini`,
    };
  }
  return { valid: true, voucher, message: null };
}

export function applyVoucherDiscount(voucher, subtotal) {
  if (voucher.type === 'flat') {
    return Math.min(voucher.value, subtotal);
  }
  const rawDiscount = (subtotal * voucher.value) / 100;
  return voucher.maxDiscount ? Math.min(rawDiscount, voucher.maxDiscount) : rawDiscount;
}

export function isVoucherExpired(expiresAt) {
  if (!expiresAt) return false;
  return isBefore(new Date(expiresAt), new Date());
}