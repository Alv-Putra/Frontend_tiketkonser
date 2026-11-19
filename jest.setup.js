require('@testing-library/jest-dom');

const { TextEncoder } = require('util');
global.TextEncoder = TextEncoder;

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

jest.mock('next/navigation', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  };
  return {
    useRouter: jest.fn(() => mockRouter),
    usePathname: () => '/',
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(),
    redirect: jest.fn(),
  };
});
// jsdom belum punya API ini; GSAP (matchMedia) dan Framer Motion (IntersectionObserver) membutuhkannya.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (!window.IntersectionObserver) {
    // Langsung melapor "terlihat" agar konten yang dimuat saat masuk viewport ikut dirender di test.
    window.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe(target) {
        this.callback([{ isIntersecting: true, intersectionRatio: 1, target }], this);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }
}
