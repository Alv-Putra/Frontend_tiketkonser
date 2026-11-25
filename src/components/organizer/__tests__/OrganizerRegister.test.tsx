import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrganizerRegister from '../OrganizerRegister';
import authService from '@/services/authService';
import { ApiError } from '@/lib/api';

jest.mock('@/services/authService', () => ({ __esModule: true, default: { registerOrganizer: jest.fn() } }));

const pdf = (name: string) => new File(['%PDF'], name, { type: 'application/pdf' });

async function fillForm() {
  await userEvent.type(screen.getByLabelText('Nama lengkap *'), 'Rina Organizer');
  await userEvent.type(screen.getByLabelText('Email *'), 'rina@nusantara.test');
  await userEvent.type(screen.getByLabelText('Kata sandi *'), 'rahasia123');
  await userEvent.type(screen.getByLabelText('Ulangi kata sandi *'), 'rahasia123');
  await userEvent.type(screen.getByLabelText('Nama perusahaan *'), 'Nusantara Live!');
  for (const label of ['Akta badan usaha *', 'NIB *', 'NPWP perusahaan *', 'KTP penanggung jawab *']) {
    await userEvent.upload(screen.getByLabelText(new RegExp(`^${label.replace('*', '\*')}`)), pdf(`${label}.pdf`));
  }
}

test('menolak kirim bila kolom wajib dan berkas belum lengkap', async () => {
  render(<OrganizerRegister />);
  await userEvent.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
  expect(screen.getByText('Nama wajib diisi')).toBeInTheDocument();
  expect(screen.getAllByText('Berkas wajib diunggah')).toHaveLength(4);
  expect(authService.registerOrganizer).not.toHaveBeenCalled();
});

test('membuat slug otomatis lalu mengirim pendaftaran', async () => {
  jest.mocked(authService.registerOrganizer).mockResolvedValue({ message: 'Cek email kamu.' });
  render(<OrganizerRegister />);
  await fillForm();
  expect(screen.getByLabelText('Link profil')).toHaveValue('nusantara-live');

  await userEvent.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
  const [fields, files] = jest.mocked(authService.registerOrganizer).mock.calls[0];
  expect(fields).toMatchObject({ fullName: 'Rina Organizer', companyName: 'Nusantara Live!', slug: 'nusantara-live', email: 'rina@nusantara.test' });
  expect(fields).not.toHaveProperty('confirmPassword');
  expect(Object.keys(files)).toEqual(['business_entity', 'nib', 'npwp', 'pic_ktp']);
  expect(await screen.findByText('Cek email kamu.')).toBeInTheDocument();
});

test('menampilkan error backend per kolom', async () => {
  jest.mocked(authService.registerOrganizer).mockRejectedValue(
    new ApiError('Validasi gagal', { status: 400, errors: [{ field: 'slug', message: 'Slug sudah dipakai' }] }),
  );
  render(<OrganizerRegister />);
  await fillForm();
  await userEvent.clear(screen.getByLabelText('Link profil'));
  await userEvent.type(screen.getByLabelText('Link profil'), 'Nusantara Baru');
  expect(screen.getByLabelText('Link profil')).toHaveValue('nusantara-baru');

  await userEvent.click(screen.getByRole('button', { name: 'Kirim pendaftaran' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Validasi gagal');
  expect(screen.getByText('Slug sudah dipakai')).toBeInTheDocument();
});
