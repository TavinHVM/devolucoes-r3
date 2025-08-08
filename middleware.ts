import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface UserTokenPayload {
  userId: number;
  email: string;
  role: string;
  user_level: string;
  name: string;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const publicPaths = ["/login", "/reset-password", "/debug", "/test-login"];
  const pathname = request.nextUrl.pathname;

  console.log("Middleware executado para:", pathname);

  // Se for uma rota pública, permitir acesso
  if (publicPaths.includes(pathname)) {
    console.log("Rota pública, permitindo acesso");
    return NextResponse.next();
  }

  // Se for API route, não bloquear no middleware (deixar para a própria API validar)
  if (pathname.startsWith("/api/")) {
    console.log("API route, permitindo acesso (validação na própria API)");
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
