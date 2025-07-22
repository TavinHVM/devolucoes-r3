'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/header';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
<<<<<<< HEAD
    return <div className="flex h-screen items-center justify-center bg-gray-50">Carregando...</div>;
=======
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
>>>>>>> main
  }

  return (
    <>
      <Header />
      <div className="flex w-full h-full items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-2xl shadow-2xl px-10 py-16 max-w-xl w-full flex flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow text-center">
            Bem-vindo ao sistema de Devoluções R3
          </h1>
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
