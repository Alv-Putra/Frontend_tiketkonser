export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email wajib diisi';
  if (!re.test(email)) return 'Format email tidak valid';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password wajib diisi';
  if (password.length < 8) return 'Password minimal 8 karakter';
  if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf besar';
  if (!/[0-9]/.test(password)) return 'Password harus mengandung angka';
  return null;
}

export function validateName(name) {
  if (!name || !name.trim()) return 'Nama wajib diisi';
  if (name.trim().length < 2) return 'Nama minimal 2 karakter';
  return null;
}

export function validatePhone(phone) {
  if (!phone) return 'Nomor telepon wajib diisi';
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!/^(\+62|62|0)8\d{8,12}$/.test(cleaned)) return 'Format nomor telepon tidak valid';
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Konfirmasi password wajib diisi';
  if (password !== confirmPassword) return 'Password tidak cocok';
  return null;
}

export function validateTicketQuantity(quantity, max, min = 1) {
  const num = Number(quantity);
  if (isNaN(num) || !Number.isInteger(num)) return 'Jumlah tiket harus bilangan bulat';
  if (num < min) return `Minimal pembelian ${min} tiket`;
  if (num > max) return `Maksimal pembelian ${max} tiket`;
  return null;
}

export function validateVoucherCode(code) {
  if (!code) return 'Kode voucher wajib diisi';
  if (code.trim().length < 4) return 'Kode voucher minimal 4 karakter';
  return null;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm({ name, email, phone, password, confirmPassword }) {
  const errors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const phoneError = validatePhone(phone);
  const passwordError = validatePassword(password);
  const confirmError = validateConfirmPassword(password, confirmPassword);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (phoneError) errors.phone = phoneError;
  if (passwordError) errors.password = passwordError;
  if (confirmError) errors.confirmPassword = confirmError;

  return { isValid: Object.keys(errors).length === 0, errors };
}
