import { fireEvent, render, screen, within } from '@testing-library/react';
import Home from '../page';

const LIVE = [
  { id: '1', title: 'Rock Revolution Festival 2026', genre: 'Rock', city: 'Jakarta', date: '2026-08-15T15:00:00Z', priceStart: 450000 },
];
const LOCAL = [
  { id: 'f1', title: 'Java Jazz Festival 2026', genre: 'Jazz', city: 'Jakarta', date: '2026-05-15T14:00:00Z', priceStart: 350000 },
  { id: 'f5', title: 'Hindia: The Tour 2026', genre: 'Indie', city: 'Jakarta', date: '2026-08-28T12:00:00Z', priceStart: 300000 },
  // Duplikat judul event backend: tidak boleh tampil dua kali.
  { id: 'f9', title: 'Rock Revolution Festival 2026', genre: 'Rock', city: 'Jakarta', date: '2026-08-15T15:00:00Z', priceStart: 450000 },
];

jest.mock('@/services/festivalService', () => ({
  __esModule: true,
  default: {
    getPublishedFestivals: jest.fn((options?: { useApi?: boolean }) =>
      Promise.resolve(options?.useApi ? LIVE : LOCAL)
    ),
  },
}));

describe('Landing page Tixo', () => {
  it('menampilkan logo Tixo yang menuju beranda', () => {
    render(<Home />);
    expect(screen.getAllByRole('link', { name: /tixo beranda/i })[0]).toHaveAttribute('href', '/');
  });

  it('mengajak penonton membeli tiket lewat app', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/jangan cuma nonton story orang/i);
    expect(screen.getByRole('link', { name: /beli tiket di app/i })).toHaveAttribute('href', '#penonton');
    const audience = document.getElementById('penonton') as HTMLElement;
    expect(within(audience).getByText('Google Play')).toBeInTheDocument();
  });

  it('mengajak pengunjung menjadi organizer', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /jadi organizer/i })).toHaveAttribute('href', '#organizer');
    expect(screen.getByRole('link', { name: /^buka dashboard organizer$/i })).toHaveAttribute('href', '/organizer');
  });

  it('melengkapi event backend dengan event lokal tanpa duplikat', async () => {
    render(<Home />);
    const events = document.getElementById('event') as HTMLElement;
    expect(await within(events).findByRole('link', { name: /rock revolution festival 2026/i }, { timeout: 3000 })).toHaveAttribute(
      'href',
      '/concerts/1'
    );
    expect(within(events).getByRole('link', { name: /java jazz festival 2026/i })).toHaveAttribute('href', '/concerts/f1');
    expect(within(events).getAllByRole('link', { name: /rock revolution/i })).toHaveLength(1);
    expect(within(events).getByText(/3 event siap dikejar/i)).toBeInTheDocument();
  });

  it('memfilter tiket berdasarkan genre', async () => {
    render(<Home />);
    const events = document.getElementById('event') as HTMLElement;
    fireEvent.click(await within(events).findByRole('tab', { name: 'Jazz' }, { timeout: 3000 }));
    expect(within(events).getByRole('tab', { name: 'Jazz' })).toHaveAttribute('aria-selected', 'true');
    expect(await within(events).findByRole('link', { name: /java jazz/i })).toBeInTheDocument();
  });

  it('menampilkan foto JPEG di kartu tiket', async () => {
    render(<Home />);
    const events = document.getElementById('event') as HTMLElement;
    const card = await within(events).findByRole('link', { name: /java jazz festival 2026/i }, { timeout: 3000 });
    const photo = card.querySelector('img') as HTMLImageElement;
    expect(photo.getAttribute('src')).toBe('/images/events/java-jazz.jpg');
    expect(within(events).queryByRole('button', { name: /tiket berikutnya/i })).not.toBeInTheDocument();
  });
});
