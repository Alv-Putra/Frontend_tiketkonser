import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrganizerEventDocuments, { readableDocumentError } from '../OrganizerEventDocuments';
import { fetchOrganizerEventDocuments, uploadOrganizerEventDocument } from '@/services/dashboardService';

jest.mock('@/services/dashboardService', () => ({
  fetchOrganizerEventDocuments: jest.fn(),
  uploadOrganizerEventDocument: jest.fn(),
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) { this.removeAttribute('open'); };
});

const event = { id: '9', title: 'Gig Senja', start_at: '2026-12-01T12:00:00Z', status: 'draft', venue: null };
const pks = { type: 'cooperation_agreement', original_name: 'pks.pdf', mime_type: 'application/pdf', size: 1048576, uploaded_at: '2026-11-25T03:00:00Z', url: 'https://x/pks' };

test('menerjemahkan kode berkas di pesan backend', () => {
  expect(readableDocumentError('Berkas verifikasi festival belum lengkap: venue_permit, liability_statement'))
    .toBe('Berkas verifikasi festival belum lengkap: Izin venue, SPTJM');
});

test('menampilkan progres dan mengunggah berkas yang belum ada', async () => {
  jest.mocked(fetchOrganizerEventDocuments).mockResolvedValueOnce([pks] as never).mockResolvedValueOnce([pks, { ...pks, type: 'venue_permit' }] as never);
  jest.mocked(uploadOrganizerEventDocument).mockResolvedValue({} as never);
  render(<OrganizerEventDocuments event={event} onClose={jest.fn()} />);

  expect(await screen.findByText('1 dari 5 berkas')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Lihat' })).toHaveAttribute('href', 'https://x/pks');

  const file = new File(['%PDF'], 'izin.pdf', { type: 'application/pdf' });
  await userEvent.upload(screen.getByLabelText('Unggah Izin venue'), file);

  expect(uploadOrganizerEventDocument).toHaveBeenCalledWith('9', 'venue_permit', file);
  await waitFor(() => expect(screen.getByText('2 dari 5 berkas')).toBeInTheDocument());
});

test('menampilkan error per berkas dan menyembunyikan unggah saat konser terkunci', async () => {
  jest.mocked(fetchOrganizerEventDocuments).mockResolvedValue([] as never);
  jest.mocked(uploadOrganizerEventDocument).mockRejectedValue(new Error('Ukuran berkas maksimal 5 MB'));
  const { unmount } = render(<OrganizerEventDocuments event={event} onClose={jest.fn()} />);

  await userEvent.upload(await screen.findByLabelText('Unggah SPTJM'), new File(['x'], 'a.pdf', { type: 'application/pdf' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Ukuran berkas maksimal 5 MB');
  unmount();

  render(<OrganizerEventDocuments event={{ ...event, status: 'pending_review' }} onClose={jest.fn()} />);
  expect(await screen.findByText('0 dari 5 berkas')).toBeInTheDocument();
  expect(screen.queryByLabelText(/Unggah/)).not.toBeInTheDocument();
});
