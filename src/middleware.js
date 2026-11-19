import { NextResponse } from 'next/server';

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/festivals') {
    return NextResponse.redirect(new URL('/#jelajahi', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/festivals',
  ],
};

