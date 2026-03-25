import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // In Next.js App Router, middleware runs on every request that matches the config
  const adminToken = request.cookies.get('admin_token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!adminToken) {
      // Redirect unauthorized/unauthenticated traffic back to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// matcher ensures this ONLY runs for /admin paths
export const config = {
  matcher: ['/admin/:path*'],
};
