import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Log the request path and token presence for debugging
  console.log('Request URL:', request.nextUrl.pathname);
  console.log('Token:', token);

  // Redirect to login if token is not present and accessing protected pages
  const protectedPaths = ['/', '/protected-page'];
  if (!token && protectedPaths.includes(request.nextUrl.pathname)) {
    console.log('Token not found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  console.log('Token found or not a protected path, allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
