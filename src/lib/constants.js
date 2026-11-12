export const ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
  STAFF: 'staff', // Petugas check-in / gate staff
};

export const ORDER_STATUS = {
  PENDING: 'pending',        // Order dibuat, belum bayar
  WAITING_PAYMENT: 'waiting_payment', // Menunggu pembayaran
  PAID: 'paid',             // Pembayaran berhasil
  EXPIRED: 'expired',       // Lewat expires_at
  CANCELLED: 'cancelled',   // Dibatalkan user/sistem
  REFUNDED: 'refunded',     // Dana dikembalikan
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',       // Menunggu pembayaran
  SUCCESS: 'success',       // Pembayaran berhasil
  FAILED: 'failed',         // Pembayaran gagal
  EXPIRED: 'expired',      // Pembayaran kadaluarsa
  REFUNDED: 'refunded',     // Dana dikembalikan
};

export const TICKET_STATUS = {
  ACTIVE: 'active',         // Tiket siap dipakai
  USED: 'used',            // Sudah check-in
  CANCELLED: 'cancelled',   // Dibatalkan
  REFUNDED: 'refunded',     // Direfund
};

export const E_TICKET_STATUS = {
  VALID: 'active',           // Alias untuk ACTIVE
  ACTIVE: 'active',
  USED: 'used',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const FESTIVAL_STATUS = {
  DRAFT: 'draft',                       // Organizer masih menyusun
  PENDING_REVIEW: 'pending_review',       // Diajukan ke admin
  APPROVED: 'approved',                 // Disetujui admin, belum publish
  REJECTED: 'rejected',                 // Ditolak
  PUBLISHED: 'published',               // Tampil ke publik, tiket bisa dibeli
  ONGOING: 'ongoing',                  // Festival sedang berlangsung
  FINISHED: 'finished',                 // Festival selesai
  CANCELLED: 'cancelled',              // Dibatalkan
};

// Check-in result enum dari ERD checkin_logs.result
export const CHECKIN_RESULT = {
  VALID: 'valid',                      // Tiket sah, check-in diterima
  NOT_FOUND: 'not_found',              // QR tidak ditemukan
  ALREADY_USED: 'already_used',        // Tiket sudah dipakai
  CANCELLED: 'cancelled',             // Tiket dibatalkan
  WRONG_EVENT: 'wrong_event',          // Tiket milik festival lain
  INVALID_STATUS: 'invalid_status',     // Status tidak memenuhi syarat
};

// Voucher discount type dari ERD vouchers.discount_type
export const VOUCHER_DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',            // Diskon dalam persen
  FIXED: 'fixed',                     // Diskon nominal tetap
};

// Ticket type status untuk penjualan
export const TICKET_TYPE_STATUS = {
  AVAILABLE: 'available',              // Tersedia untuk dibeli
  SOLD_OUT: 'sold_out',              // Habis terjual
  COMING_SOON: 'coming_soon',         // Penjualan belum dibuka
  CLOSED: 'closed',                   // Ditutup manual oleh organizer
};

export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'Landmark', description: 'BCA, Mandiri, BRI, BNI' },
  { id: 'ewallet', name: 'E-Wallet', icon: 'Wallet', description: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'credit_card', name: 'Kartu Kredit', icon: 'CreditCard', description: 'Visa, Mastercard, JCB' },
  { id: 'qris', name: 'QRIS', icon: 'QrCode', description: 'Scan QR untuk pembayaran' },
];

export const SERVICE_FEE_PERCENT = 5;
export const TAX_PERCENT = 11;
export const DEFAULT_MAX_TICKETS_PER_ORDER = 5;  // Sesuai ERD festivals.max_tickets_per_order
export const MAX_TICKET_PER_ORDER = DEFAULT_MAX_TICKETS_PER_ORDER; // Alias for compatibility
export const MIN_TICKET_PER_ORDER = 1;
export const ORDER_EXPIRY_MINUTES = 30;         // Batas waktu pembayaran

export const RATE_LIMIT = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  REGISTER: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  CHECKOUT: { maxAttempts: 10, windowMs: 5 * 60 * 1000 },
  SEARCH: { maxAttempts: 30, windowMs: 1 * 60 * 1000 },
  CHECKIN: { maxAttempts: 20, windowMs: 60 * 1000 }, // Rate limit untuk scan check-in
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'nearest', label: 'Terdekat' },
  { value: 'cheapest', label: 'Harga Termurah' },
  { value: 'expensive', label: 'Harga Termahal' },
  { value: 'popular', label: 'Paling Populer' },
];

// Festival categories dari ERD festival_categories
export const FESTIVAL_CATEGORIES = [
  { name: 'Musik', slug: 'musik' },
  { name: 'Kuliner', slug: 'kuliner' },
  { name: 'Seni', slug: 'seni' },
  { name: 'Budaya', slug: 'budaya' },
  { name: 'Teknologi', slug: 'teknologi' },
  { name: 'Olahraga', slug: 'olahraga' },
  { name: 'Film', slug: 'film' },
  { name: 'Lainnya', slug: 'lainnya' },
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
