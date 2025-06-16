'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

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
    return <div className="flex h-screen items-center justify-center bg-gray-50">Carregando...</div>;
  }

  return (
    <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-16 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 text-green-700 drop-shadow text-center">
          Bem-vindo ao sistema de Devoluções R3
        </h1>
        <div className="w-full flex flex-col gap-2 mt-4">
          <span className="text-base text-gray-500 text-center">
            Utilize o menu lateral para navegar entre as funcionalidades do sistema.
          </span>
        </div>
      </div>
    </div>
  );
}
