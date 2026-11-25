import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';

const options = [
  { value: 'active', label: 'Tersedia' },
  { value: 'sold_out', label: 'Habis' },
  { value: 'inactive', label: 'Nonaktif' },
];

test('memilih dengan klik dan mengirim nilai lewat form', async () => {
  render(<form aria-label="tiket"><label htmlFor="status">Status</label><Select id="status" name="status" defaultValue="active" options={options} /></form>);
  const trigger = screen.getByLabelText('Status');
  expect(trigger).toHaveTextContent('Tersedia');

  await userEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('option', { name: 'Tersedia' })).toHaveAttribute('aria-selected', 'true');
  await userEvent.click(screen.getByRole('option', { name: 'Habis' }));

  expect(trigger).toHaveTextContent('Habis');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(new FormData(screen.getByRole('form')).get('status')).toBe('sold_out');
});

test('bisa dipakai penuh dengan keyboard', async () => {
  const onChange = jest.fn();
  render(<Select aria-label="Status" value="active" onChange={onChange} options={options} />);
  const trigger = screen.getByRole('combobox', { name: 'Status' });

  trigger.focus();
  await userEvent.keyboard('{ArrowDown}');
  const list = screen.getByRole('listbox');
  expect(list).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}');
  expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Habis' }).id);
  await userEvent.keyboard('{End}{Home}{Enter}');
  expect(onChange).toHaveBeenCalledWith('active');
  expect(trigger).toHaveFocus();

  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('menyaring pilihan lewat kolom cari dan menutup saat klik di luar', async () => {
  const cities = Array.from({ length: 10 }, (_, i) => ({ value: String(i), label: i === 7 ? 'Bandung, Jawa Barat' : `Kota ${i}` }));
  const onChange = jest.fn();
  render(<><Select aria-label="Kota" placeholder="Pilih kota" options={cities} onChange={onChange} /><p>luar</p></>);
  const trigger = screen.getByRole('combobox', { name: 'Kota' });
  expect(trigger).toHaveTextContent('Pilih kota');

  await userEvent.click(trigger);
  const search = screen.getByRole('searchbox', { name: 'Cari pilihan' });
  expect(search).toHaveFocus();
  await userEvent.type(search, 'band');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledWith('7');

  await userEvent.click(trigger);
  await userEvent.type(screen.getByRole('searchbox'), 'zzz');
  expect(screen.getByText('Tidak ada yang cocok.')).toBeInTheDocument();
  await userEvent.click(screen.getByText('luar'));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('tidak terbuka saat nonaktif', async () => {
  render(<Select aria-label="Konser" disabled options={options} placeholder="Tidak ada konser" />);
  await userEvent.click(screen.getByRole('combobox', { name: 'Konser' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
