import { format, formatDistanceToNow, isPast, isBefore, addMinutes } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatCurrency(amount) {
  return `Rp${Number(amount).toLocaleString('id-ID')}`;
}

export function formatDate(dateString) {
  return format(new Date(dateString), 'd MMMM yyyy', { locale: id });
}

export function formatDateShort(dateString) {
  return format(new Date(dateString), 'd MMM yyyy', { locale: id });
}

export function formatDateTime(dateString) {
  return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: id });
}

export function formatTimeAgo(dateString) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
}

export function isExpired(dateString) {
  return isPast(new Date(dateString));
}

export function isPaymentExpired(createdAt, expiryMinutes = 60) {
  const expiry = addMinutes(new Date(createdAt), expiryMinutes);
  return isBefore(expiry, new Date());
}

export function calculateSubtotal(price, quantity) {
  return price * quantity;
}

export function calculateServiceFee(subtotal, feePercent = 5) {
  return Math.ceil(subtotal * (feePercent / 100));
}

export function calculateTax(amount, taxPercent = 11) {
  return Math.ceil(amount * (taxPercent / 100));
}

export function calculateTotal(subtotal, serviceFee, tax, discount = 0) {
  return Math.max(0, subtotal + serviceFee + tax - discount);
}

export function getTicketQuotaStatus(sold, quota) {
  const remaining = quota - sold;
  const percentage = Math.round((sold / quota) * 100);
  return { remaining, percentage, isSoldOut: remaining <= 0 };
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateTicketCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TKT-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateQRData(ticketCode, festivalId, orderId) {
  return JSON.stringify({ code: ticketCode, festival: festivalId, order: orderId });
}
