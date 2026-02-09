import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');


  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dealer') || 
                          request.nextUrl.pathname.startsWith('/renter');


  if (!token && !isAuthPage && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dealer/:path*', '/renter/:path*'],
};