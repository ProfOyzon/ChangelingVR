import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check session and redirect appropriately
  // Dashboard -> Auth if not logged in
  // Auth -> Dashboard if logged in
  const session = await getSession();
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } else if (session && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run on auth and dashboard routes
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
