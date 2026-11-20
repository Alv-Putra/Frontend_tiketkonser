import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateConfirmPassword,
  validateLoginForm,
  validateRegisterForm,
} from '@/lib/validators';

describe('validators (validasi halaman saja)', () => {
  it.each([
    ['validateEmail', validateEmail, 'Email wajib diisi'],
    ['validatePassword', validatePassword, 'Password wajib diisi'],
    ['validateName', validateName, 'Nama wajib diisi'],
    ['validatePhone', validatePhone, 'Nomor telepon wajib diisi'],
  ])('%s hanya memeriksa kolom wajib', (_name, fn, message) => {
    expect(fn('')).toBe(message);
    expect(fn('   ')).toBe(message);
    expect(fn(undefined)).toBe(message);
    expect(fn('x')).toBeNull();
  });

  it('tidak menerapkan aturan format/kekuatan (urusan backend)', () => {
    expect(validateEmail('bukan-email')).toBeNull();
    expect(validatePassword('abc')).toBeNull();
    expect(validatePhone('123')).toBeNull();
  });

  it('validateConfirmPassword memeriksa wajib dan kecocokan', () => {
    expect(validateConfirmPassword('Secret1', '')).toBe('Konfirmasi password wajib diisi');
    expect(validateConfirmPassword('Secret1', 'Secret2')).toBe('Password tidak cocok');
    expect(validateConfirmPassword('Secret1', 'Secret1')).toBeNull();
  });

  it('validateLoginForm mengumpulkan error kolom kosong', () => {
    expect(validateLoginForm({ email: '', password: '' })).toEqual({
      isValid: false,
      errors: { email: 'Email wajib diisi', password: 'Password wajib diisi' },
    });
    expect(validateLoginForm({ email: 'a', password: 'b' })).toEqual({ isValid: true, errors: {} });
  });

  it('validateRegisterForm mengumpulkan error kolom kosong & konfirmasi', () => {
    const empty = validateRegisterForm({});
    expect(empty.isValid).toBe(false);
    expect(Object.keys(empty.errors).sort()).toEqual(['confirmPassword', 'email', 'name', 'password', 'phone']);

    expect(
      validateRegisterForm({ name: 'A', email: 'a', phone: '1', password: 'x', confirmPassword: 'x' })
    ).toEqual({ isValid: true, errors: {} });
  });
});
