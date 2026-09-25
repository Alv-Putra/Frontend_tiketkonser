import { setSessionCookie, clearSessionCookie } from '@/lib/sessionCookie';

function readCookie() {
  const match = document.cookie.match(/conser_session=([^;]+)/);
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match[1]));
}

describe('sessionCookie', () => {
  beforeEach(() => {
    clearSessionCookie();
  });

  it('setSessionCookie stores the role', () => {
    setSessionCookie('admin');
    expect(readCookie()).toEqual({ role: 'admin' });
  });

  it('setSessionCookie overwrites the previous role', () => {
    setSessionCookie('admin');
    setSessionCookie('customer');
    expect(readCookie()).toEqual({ role: 'customer' });
  });

  it('clearSessionCookie removes the cookie', () => {
    setSessionCookie('admin');
    clearSessionCookie();
    expect(document.cookie).not.toContain('conser_session');
  });
});