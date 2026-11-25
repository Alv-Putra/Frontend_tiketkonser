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

export const ORGANIZER_DOCUMENTS = ['business_entity', 'nib', 'npwp', 'pic_ktp'] as const;

export function validateOrganizerRegisterForm(
  { fullName, companyName, email, password, confirmPassword }: Record<'fullName' | 'companyName' | 'email' | 'password' | 'confirmPassword', string | undefined>,
  files: Partial<Record<(typeof ORGANIZER_DOCUMENTS)[number], File>>,
) {
  return collect({
    fullName: validateName(fullName),
    companyName: isBlank(companyName) ? 'Nama perusahaan wajib diisi' : null,
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
    ...Object.fromEntries(ORGANIZER_DOCUMENTS.map((type) => [type, files[type] ? null : 'Berkas wajib diunggah'])),
  });
}
