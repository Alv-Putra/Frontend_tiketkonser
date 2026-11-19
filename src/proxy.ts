import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/festivals') {
    // Daftar festival kini ada di section event landing page.
    return NextResponse.redirect(new URL('/#event', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/festivals',
  ],
};
