import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateConfirmPassword,
  validateTicketQuantity,
  validateVoucherCode,
  validateLoginForm,
  validateRegisterForm,
} from '@/lib/validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('rejects empty email', () => {
      expect(validateEmail('')).toBe('Email wajib diisi');
    });

    it('rejects invalid format', () => {
      expect(validateEmail('not-an-email')).toBe('Format email tidak valid');
      expect(validateEmail('a@b')).toBe('Format email tidak valid');
    });

    it('accepts valid email', () => {
      expect(validateEmail('nama@email.com')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('rejects empty password', () => {
      expect(validatePassword('')).toBe('Password wajib diisi');
    });

    it('rejects short password', () => {
      expect(validatePassword('Ab1')).toBe('Password minimal 8 karakter');
    });

    it('rejects password without uppercase', () => {
      expect(validatePassword('abcdefgh1')).toBe('Password harus mengandung huruf besar');
    });

    it('rejects password without number', () => {
      expect(validatePassword('Abcdefghi')).toBe('Password harus mengandung angka');
    });

    it('accepts strong password', () => {
      expect(validatePassword('Abcd1234')).toBeNull();
    });
  });

  describe('validateName', () => {
    it('rejects empty name', () => {
      expect(validateName('')).toBe('Nama wajib diisi');
      expect(validateName('   ')).toBe('Nama wajib diisi');
    });

    it('rejects too short name', () => {
      expect(validateName('A')).toBe('Nama minimal 2 karakter');
    });

    it('accepts valid name', () => {
      expect(validateName('Budi')).toBeNull();
    });
  });

  describe('validatePhone', () => {
    it('rejects empty phone', () => {
      expect(validatePhone('')).toBe('Nomor telepon wajib diisi');
    });

    it('rejects invalid phone', () => {
      expect(validatePhone('12345')).toBe('Format nomor telepon tidak valid');
    });

    it('accepts Indonesian mobile numbers', () => {
      expect(validatePhone('081234567890')).toBeNull();
      expect(validatePhone('+6281234567890')).toBeNull();
      expect(validatePhone('6281234567890')).toBeNull();
      expect(validatePhone('0812 3456 7890')).toBeNull();
    });
  });

  describe('validateConfirmPassword', () => {
    it('rejects empty confirmation', () => {
      expect(validateConfirmPassword('Abcd1234', '')).toBe('Konfirmasi password wajib diisi');
    });

    it('rejects mismatch', () => {
      expect(validateConfirmPassword('Abcd1234', 'Abcd1235')).toBe('Password tidak cocok');
    });

    it('accepts matching passwords', () => {
      expect(validateConfirmPassword('Abcd1234', 'Abcd1234')).toBeNull();
    });
  });

  describe('validateTicketQuantity', () => {
    it('rejects non-integer', () => {
      expect(validateTicketQuantity(1.5, 10)).toBe('Jumlah tiket harus bilangan bulat');
      expect(validateTicketQuantity('abc', 10)).toBe('Jumlah tiket harus bilangan bulat');
    });

    it('rejects below minimum', () => {
      expect(validateTicketQuantity(0, 10, 1)).toBe('Minimal pembelian 1 tiket');
    });

    it('rejects above maximum', () => {
      expect(validateTicketQuantity(11, 10)).toBe('Maksimal pembelian 10 tiket');
    });

    it('accepts in-range quantity', () => {
      expect(validateTicketQuantity(5, 10)).toBeNull();
    });
  });

  describe('validateVoucherCode', () => {
    it('rejects empty code', () => {
      expect(validateVoucherCode('')).toBe('Kode voucher wajib diisi');
    });

    it('rejects too short code', () => {
      expect(validateVoucherCode('ABC')).toBe('Kode voucher minimal 4 karakter');
    });

    it('accepts valid code', () => {
      expect(validateVoucherCode('KONSER10')).toBeNull();
    });
  });

  describe('validateLoginForm', () => {
    it('returns isValid false when invalid', () => {
      const result = validateLoginForm({ email: 'bad', password: 'short' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });

    it('returns isValid true when valid', () => {
      const result = validateLoginForm({ email: 'a@b.com', password: 'Abcd1234' });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe('validateRegisterForm', () => {
    it('collects all errors', () => {
      const result = validateRegisterForm({
        name: '',
        email: 'bad',
        phone: '999',
        password: 'x',
        confirmPassword: 'y',
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(5);
    });

    it('returns valid for correct payload', () => {
      const result = validateRegisterForm({
        name: 'Budi',
        email: 'budi@mail.com',
        phone: '081234567890',
        password: 'Abcd1234',
        confirmPassword: 'Abcd1234',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});