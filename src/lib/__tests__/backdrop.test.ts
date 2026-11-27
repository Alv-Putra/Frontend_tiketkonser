import { closeOnBackdrop } from '../backdrop';

const event = (currentTarget: HTMLElement, target: EventTarget, clientX = 0, clientY = 0) =>
  ({ currentTarget, target, clientX, clientY }) as never;

test('menutup bila klik dimulai dan selesai di latar', () => {
  const close = jest.fn();
  const overlay = document.createElement('div');
  const handlers = closeOnBackdrop(close);
  handlers.onPointerDown(event(overlay, overlay));
  handlers.onClick(event(overlay, overlay));
  expect(close).toHaveBeenCalledTimes(1);
});

test('tidak menutup saat klik di isi atau seret dari isi ke latar', () => {
  const close = jest.fn();
  const overlay = document.createElement('div');
  const content = document.createElement('input');
  const handlers = closeOnBackdrop(close);
  handlers.onPointerDown(event(overlay, content));
  handlers.onClick(event(overlay, overlay));
  handlers.onClick(event(overlay, overlay));
  expect(close).not.toHaveBeenCalled();
});

test('dialog hanya menutup bila klik di luar kotaknya', () => {
  const close = jest.fn();
  const dialog = document.createElement('dialog');
  dialog.getBoundingClientRect = () => ({ left: 10, right: 100, top: 10, bottom: 100 }) as DOMRect;
  const handlers = closeOnBackdrop(close);
  for (const [x, y] of [[50, 50], [5, 50], [150, 50], [50, 5], [50, 150]]) {
    handlers.onPointerDown(event(dialog, dialog, x, y));
    handlers.onClick(event(dialog, dialog, x, y));
  }
  expect(close).toHaveBeenCalledTimes(4);
});
