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