"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredLevel?: string;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredLevel,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-slate-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Redirecionando para login...</p>
          <div className="w-8 h-8 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Verificar permissões se especificadas
  if (requiredLevel && user?.user_level !== requiredLevel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-red-400 mb-2">Acesso Negado</h2>
          <p className="text-slate-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-red-400 mb-2">Acesso Negado</h2>
          <p className="text-slate-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
