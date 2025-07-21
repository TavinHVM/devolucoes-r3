"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

function getHashParams() {
  if (typeof window === 'undefined') return {};
  const hash = window.location.hash.substring(1);
  return Object.fromEntries(new URLSearchParams(hash));
}

export default function ResetPasswordInner() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [validLink, setValidLink] = useState<null | boolean>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Tenta pegar da query string
    const accessToken = searchParams?.get('access_token');
    const type = searchParams?.get('type');
    // 2. Se não tiver, tenta pegar do hash
    let hashParams = {};
    if (!accessToken && !type && typeof window !== 'undefined') {
      hashParams = getHashParams() as Record<string, string | undefined>;
    }
    const finalAccessToken = accessToken || (hashParams as Record<string, string | undefined>)['access_token'];
    const finalType = type || (hashParams as Record<string, string | undefined>)['type'];

    if (finalAccessToken || finalType === 'recovery') {
      setValidLink(true);
    } else {
      setValidLink(false);
      setStatus('Link inválido ou expirado.');
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus('Erro ao redefinir senha: ' + error.message);
    } else {
      setStatus('Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => router.push('/login'), 2000);
    }
  }

  if (validLink === null) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>
      {validLink ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xs bg-slate-800 p-4 rounded-md">
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-2 rounded text-white bg-slate-700"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white cursor-pointer">Redefinir</button>
        </form>
      ) : (
        <div className="mt-4">{status}</div>
      )}
      {status && validLink && <div className="mt-4">{status}</div>}
    </div>
  );
}
