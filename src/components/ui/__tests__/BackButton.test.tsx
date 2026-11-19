import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../BackButton';
import { useRouter } from 'next/navigation';

describe('BackButton component', () => {
  let mockBack;
  let mockPush;

  beforeEach(() => {
    mockBack = jest.fn();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders default button with default label', () => {
    render(<BackButton />);
    const button = screen.getByRole('button', { name: 'Kembali' });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Kembali')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<BackButton label="Kembali ke Beranda" />);
    const button = screen.getByRole('button', { name: 'Kembali ke Beranda' });
    expect(button).toBeInTheDocument();
  });

  it('renders as a Link when href is provided', () => {
    render(<BackButton href="/festivals" label="Ke Daftar Festival" />);
    const link = screen.getByRole('link', { name: 'Ke Daftar Festival' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/festivals');
  });

  it('calls router.back when clicked without href and history.length > 1', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 5 },
      writable: true,
    });

    render(<BackButton />);
    const button = screen.getByRole('button', { name: 'Kembali' });
    fireEvent.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('falls back to router.push("/") when history.length <= 1', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });

    render(<BackButton />);
    const button = screen.getByRole('button', { name: 'Kembali' });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('calls custom onClick handler if provided', () => {
    const customClick = jest.fn();
    render(<BackButton onClick={customClick} />);
    const button = screen.getByRole('button', { name: 'Kembali' });
    fireEvent.click(button);

    expect(customClick).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<BackButton variant="pill" />);
    let el = screen.getByRole('button');
    expect(el.className).toContain('rounded-full');

    rerender(<BackButton variant="button" />);
    el = screen.getByRole('button');
    expect(el.className).toContain('rounded-xl');

    rerender(<BackButton variant="subtle" className="custom-class" />);
    el = screen.getByRole('button');
    expect(el.className).toContain('custom-class');
  });
});
