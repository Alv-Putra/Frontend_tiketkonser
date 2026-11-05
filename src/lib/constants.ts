export const ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  WAITING_PAYMENT: 'waiting_payment',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const TICKET_STATUS = {
  AVAILABLE: 'available',
  SOLD_OUT: 'sold_out',
  COMING_SOON: 'coming_soon',
};

export const E_TICKET_STATUS = {
  VALID: 'valid',
  USED: 'used',
  CANCELLED: 'cancelled',
};

export const FESTIVAL_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'Landmark', description: 'BCA, Mandiri, BRI, BNI' },
  { id: 'ewallet', name: 'E-Wallet', icon: 'Wallet', description: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'credit_card', name: 'Kartu Kredit', icon: 'CreditCard', description: 'Visa, Mastercard, JCB' },
  { id: 'qris', name: 'QRIS', icon: 'QrCode', description: 'Scan QR untuk pembayaran' },
];

export const SERVICE_FEE_PERCENT = 5;
export const TAX_PERCENT = 11;
export const MAX_TICKET_PER_ORDER = 10;
export const MIN_TICKET_PER_ORDER = 1;

export const RATE_LIMIT = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  REGISTER: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  CHECKOUT: { maxAttempts: 10, windowMs: 5 * 60 * 1000 },
  SEARCH: { maxAttempts: 30, windowMs: 1 * 60 * 1000 },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'nearest', label: 'Terdekat' },
  { value: 'cheapest', label: 'Harga Termurah' },
  { value: 'expensive', label: 'Harga Termahal' },
  { value: 'popular', label: 'Paling Populer' },
];

export const GENRE_OPTIONS = [
  'Pop', 'Rock', 'Jazz', 'Hip Hop', 'EDM', 'Dangdut',
  'R&B', 'Indie', 'Folk', 'Metal', 'Reggae', 'Classical',
];

export const PRICE_RANGES = [
  { label: 'Di bawah Rp200.000', min: 0, max: 200000 },
  { label: 'Rp200.000 - Rp500.000', min: 200000, max: 500000 },
  { label: 'Rp500.000 - Rp1.000.000', min: 500000, max: 1000000 },
  { label: 'Di atas Rp1.000.000', min: 1000000, max: Infinity },
];
