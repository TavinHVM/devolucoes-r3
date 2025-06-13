'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Tipo do usuário
type Usuario = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    async function fetchUsuarios() {
      const { data } = await supabase.from('usuarios').select('*').order('id');
      setUsuarios(data || []);
    }
    fetchUsuarios();
  }, []);

  async function excluirUsuario(id: number) {
    await supabase.from('usuarios').delete().eq('id', id);
    setUsuarios(usuarios.filter(u => u.id !== id));
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-4">Usuários Cadastrados</h1>
      <div className="flex justify-center mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Ativar Manutenção</button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">E-mail</th>
              <th className="px-4 py-2 text-left">Cargo</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td className="px-4 py-2">{usuario.id}</td>
                <td className="px-4 py-2">{usuario.nome}</td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">{usuario.cargo}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => excluirUsuario(usuario.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Criar Novo Usuário</button>
        </div>
      </div>
    </div>
  );
} 