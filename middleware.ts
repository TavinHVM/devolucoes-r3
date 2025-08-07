import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface UserTokenPayload {
  userId: number;
  email: string;
  role: string;
  user_level: string;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const publicPaths = ["/login", "/reset-password", "/debug", "/test-login"];
  const adminOnlyPaths = ["/usuarios"];
  const adminOnlyApiPaths = ["/api/usuarios", "/api/usuarios/create", "/api/usuarios/edit", "/api/usuarios/delete"];
  const pathname = request.nextUrl.pathname;

  console.log("Middleware executado para:", pathname);

  // Se for uma rota pública, permitir acesso
  if (publicPaths.includes(pathname)) {
    console.log("Rota pública, permitindo acesso");
    return NextResponse.next();
  }

  // Para APIs que não precisam de verificação admin, permitir acesso (validação na própria API)
  if (pathname.startsWith("/api/") && !adminOnlyApiPaths.some(path => pathname.startsWith(path))) {
    console.log("API route não-admin, permitindo acesso (validação na própria API)");
    return NextResponse.next();
  }

  // Para outras rotas, verificar autenticação
  const token = request.cookies.get("auth-token")?.value;
  console.log("Token encontrado:", token ? "SIM" : "NÃO");

  if (!token) {
    console.log("Sem token, redirecionando para login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Validar JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as UserTokenPayload;

    console.log("Token válido para usuário:", payload.email);

    // Verificar se é uma rota/API que requer permissão de admin
    const isAdminOnlyPage = adminOnlyPaths.some(path => pathname.startsWith(path));
    const isAdminOnlyApi = adminOnlyApiPaths.some(path => pathname.startsWith(path));
    
    if ((isAdminOnlyPage || isAdminOnlyApi) && payload.user_level !== 'adm') {
      console.log("Acesso negado: usuário não é admin");
      if (isAdminOnlyApi) {
        return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.' }, { status: 403 });
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Adicionar dados do usuário aos headers para as páginas
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId.toString());
    response.headers.set("x-user-email", payload.email);
    response.headers.set("x-user-role", payload.role);
    response.headers.set("x-user-level", payload.user_level);

    return response;
  } catch (error) {
    console.log("Token inválido ou expirado:", error);

    // Limpar cookie inválido
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
