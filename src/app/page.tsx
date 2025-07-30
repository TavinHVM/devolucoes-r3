'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';
import Header from '../components/header';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null; // Vai redirecionar para login
  }

  return (
    <>
      <Header />
      <div className="flex w-full h-full items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-2xl shadow-2xl px-10 py-16 max-w-xl w-full flex flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow text-center">
            Bem-vindo ao sistema de Devoluções R3
          </h1>
          {user && (
            <p className="text-xl text-green-400 mb-4 text-center">
              Olá, {user.first_name} {user.last_name}!
            </p>
          )}
          <div className="w-full flex flex-col gap-2 mt-4">
            <span className="text-white text-center text-lg">
              Utilize o menu para navegar entre as funcionalidades do sistema.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
