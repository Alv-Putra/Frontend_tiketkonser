import { NextResponse } from 'next/server';

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (pathname === '/festivals') {
    return NextResponse.redirect(new URL('/#jelajahi', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/organizer/:path*',
    '/auth/:path*',
    '/festivals',
  ],
};
