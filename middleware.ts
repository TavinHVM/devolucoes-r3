import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const publicPaths = ['/login', '/reset-password', '/debug', '/test-login'];
  const pathname = request.nextUrl.pathname;

  console.log('Middleware executado para:', pathname);

  // Se for uma rota pública ou API, permitir acesso
  if (publicPaths.includes(pathname) || pathname.startsWith('/api/')) {
    console.log('Rota pública ou API, permitindo acesso');
    return NextResponse.next();
  }

  // Para debug, temporariamente só verificar se o cookie existe, sem validar JWT
  const token = request.cookies.get('auth-token')?.value;
  console.log('Token encontrado:', token ? 'SIM' : 'NÃO');

  if (!token) {
    console.log('Sem token, redirecionando para login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Token encontrado, permitindo acesso');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
