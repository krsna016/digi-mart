import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // In a real production app, you would verify a JWT or session identifier here.
  // For this mock, we check for a simple identifying cookie.
  const adminToken = request.cookies.get('admin_token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!adminToken) {
      // Redirect unauthorized unauthenticated traffic directly back to the login gateway
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Ensure the middleware exclusively triggers on the admin path tree
export const config = {
  matcher: ['/admin/:path*'],
};
