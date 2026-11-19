import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('FR-1: landing page konser publik', () => {
  it('menampilkan identitas Conser Id pada tautan beranda', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: /conser\s*id/i })).toHaveAttribute('href', '/');
  });

  it('menampilkan tautan menuju daftar konser tanpa login', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: /^beranda$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /jelajahi konser/i })).toHaveAttribute(
      'href',
      '#jelajahi',
    );
  });
});
