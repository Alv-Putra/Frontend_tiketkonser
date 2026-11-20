// Validasi halaman saja (kolom wajib & kecocokan input).
// Aturan format/kekuatan ada di backend; pesannya ditampilkan lewat fieldErrorsFrom().

const isBlank = (value?: string | null) => !value || !String(value).trim();

export function validateEmail(email?: string) {
  return isBlank(email) ? 'Email wajib diisi' : null;
}

export function validatePassword(password?: string) {
  return isBlank(password) ? 'Password wajib diisi' : null;
}

export function validateName(name?: string) {
  return isBlank(name) ? 'Nama wajib diisi' : null;
}

export function validatePhone(phone?: string) {
  return isBlank(phone) ? 'Nomor telepon wajib diisi' : null;
}

export function validateConfirmPassword(password?: string, confirmPassword?: string) {
  if (isBlank(confirmPassword)) return 'Konfirmasi password wajib diisi';
  if (password !== confirmPassword) return 'Password tidak cocok';
  return null;
}

function collect(checks: Record<string, string | null>) {
  const errors: Record<string, string> = {};
  for (const [field, error] of Object.entries(checks)) {
    if (error) errors[field] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateLoginForm({ email, password }: { email?: string; password?: string }) {
  return collect({ email: validateEmail(email), password: validatePassword(password) });
}

export function validateRegisterForm({
  name,
  email,
  phone,
  password,
  confirmPassword,
}: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}) {
  return collect({
    name: validateName(name),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}
