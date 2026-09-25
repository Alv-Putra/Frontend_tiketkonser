import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'conser_session';

const roleProtected = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/organizer', role: 'organizer' },
];

const anyLoginPaths = ['/profile', '/my-tickets', '/orders', '/checkout'];

function readRole(request) {
  const cookie = request.cookies.get(SESSION_COOKIE);
  if (!cookie) return null;
  let raw = cookie.value;
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // tetap pakai nilai mentah bila bukan percent-encoded
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.role === 'string' ? parsed.role : null;
  } catch {
    return null;
  }
}

function redirectToLogin(request, pathname) {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';
  url.searchParams.set('redirect', pathname);
  return NextResponse.redirect(url);
}

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const role = readRole(request);

  for (const route of roleProtected) {
    if (pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)) {
      if (role !== route.role) {
        return redirectToLogin(request, pathname);
      }
      break;
    }
  }

  for (const page of anyLoginPaths) {
    if (pathname === page || pathname.startsWith(`${page}/`)) {
      if (!role) {
        return redirectToLogin(request, pathname);
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/organizer/:path*',
    '/profile/:path*',
    '/my-tickets/:path*',
    '/orders/:path*',
    '/checkout/:path*',
  ],
};