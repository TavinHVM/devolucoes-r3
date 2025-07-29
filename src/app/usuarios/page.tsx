'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { handleCreateUser } from '../../utils/usuarios/handleCreateUser';
import { handleEditUser } from '../../utils/usuarios/handleEditUSer';
import { handleDeleteUser } from '../../utils/usuarios/handleDeleteUser';
import { fetchUsuarios } from '../../utils/usuarios/fetchUsuarios';

// Tipo do usuário conforme a tabela user_profiles
export interface Usuario {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
  created_at?: string;
  email: string;
}

// Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  return (
    <div className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
      role="alert">
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg leading-none">×</button>
      </div>
    </div>
  );
}

export default function Usuarios() {
  // const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Usuario, 'id' | 'created_at'> & { password: string }>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState<Omit<Usuario, 'id' | 'created_at'>>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchUsuariosList();
  }, []);


  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleCreateUser(form);
      setToast({ message: 'Usuário criado com sucesso!', type: 'success' });
      setShowModal(false);
      setForm({
        first_name: '',
        last_name: '',
        role: '',
        user_level: '',
        email: '',
        password: '',
      });
      fetchUsuariosList(); // Refresh the user list
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setToast({ message: 'Erro ao criar usuário.', type: 'error' });
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await handleEditUser(Number(editUser.id), editForm);
      setToast({ message: 'Usuário editado com sucesso!', type: 'success' });
      setEditUser(null);
      fetchUsuariosList(); // Refresh the user list
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      setToast({ message: 'Erro ao editar usuário.', type: 'error' });
    }
  };

  const handleDeleteUserConfirm = async (id: string) => {
    try {
      await handleDeleteUser(Number(id));
      setToast({ message: 'Usuário excluído com sucesso!', type: 'success' });
      setConfirmDeleteId(null);
      fetchUsuariosList(); // Refresh the user list
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setToast({ message: 'Erro ao excluir usuário.', type: 'error' });
    }
  };

  const fetchUsuariosList = async () => {
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
  };

  const openEditModal = (usuario: Usuario) => {
    setEditUser(usuario);
    setEditForm({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      role: usuario.role,
      user_level: usuario.user_level,
      email: usuario.email,
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* Toast Overlay */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <h1 className="text-3xl font-bold text-center md:text-left text-white">Usuários</h1>
        <Button className="bg-green-600 hover:bg-green-700 mt-6 mb-4 cursor-pointer" onClick={() => setShowModal(true)}>
          Cadastrar novo usuário
        </Button>

        {/* Modal de criação */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-slate-800 rounded-lg shadow-lg p-8 w-full max-w-md relative text-white">
              <button className="absolute top-2 right-3 text-xl" onClick={() => setShowModal(false)} type="button">×</button>
              <h2 className="text-xl font-bold mb-4">Cadastrar novo usuário</h2>
              <form onSubmit={handleCreateUserSubmit} className="flex flex-col gap-3">
                <div><Label htmlFor="email">E-mail</Label><Input id="email" name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
                <div><Label htmlFor="first_name">Nome</Label><Input id="first_name" name="first_name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required /></div>
                <div><Label htmlFor="last_name">Sobrenome</Label><Input id="last_name" name="last_name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required /></div>
                <div><Label htmlFor="role">Cargo</Label><Input id="role" name="role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required /></div>
                <div><Label htmlFor="user_level">Nível</Label>
                  <select
                    id="user_level"
                    name="user_level"
                    className="w-full rounded border px-2 py-2 text-white bg-slate-700"
                    value={form.user_level}
                    onChange={e => setForm(f => ({ ...f, user_level: e.target.value }))}
                    required
                  >
                    <option value="">Selecione o nível</option>
                    <option value="adm">Adm</option>
                    <option value="vendas">Vendas</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="logistica">Logística</option>
                  </select>
                </div>
                <div><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" className="w-full mt-2 cursor-pointer bg-blue-500 hover:bg-blue-600">Cadastrar</Button>
              </form>
            </div>
          </div>
        )}
        {/* Modal de edição */}
        {editUser && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-slate-800 rounded-lg shadow-lg p-8 w-full max-w-md relative text-white">
              <button className="absolute top-2 right-3 text-xl" onClick={() => setEditUser(null)} type="button">×</button>
              <h2 className="text-xl font-bold mb-4">Editar usuário</h2>
              <form onSubmit={handleEditUserSubmit} className="flex flex-col gap-3">
                <div><Label htmlFor="edit_email">E-mail</Label><Input id="edit_email" name="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required /></div>
                <div><Label htmlFor="edit_first_name">Nome</Label><Input id="edit_first_name" name="first_name" value={editForm.first_name} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} required /></div>
                <div><Label htmlFor="edit_last_name">Sobrenome</Label><Input id="edit_last_name" name="last_name" value={editForm.last_name} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} required /></div>
                <div><Label htmlFor="edit_role">Cargo</Label><Input id="edit_role" name="role" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} required /></div>
                <div><Label htmlFor="edit_user_level">Nível</Label>
                  <select
                    id="edit_user_level"
                    name="user_level"
                    className="w-full rounded border px-2 py-2 text-white"
                    value={editForm.user_level}
                    onChange={e => setEditForm(f => ({ ...f, user_level: e.target.value }))}
                    required
                  >
                    <option value="">Selecione o nível</option>
                    <option value="adm">Adm</option>
                    <option value="vendas">Vendas</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="logistica">Logística</option>
                  </select>
                </div>
                <Button className="bg-slate-500 hover:bg-slate-600 cursor-pointer" onClick={() => setResetEmail(editUser.email)} size="sm">Redefinir senha</Button>
                <Button type="submit" className="w-full mt-2 cursor-pointer bg-blue-500 hover:bg-blue-600">Salvar</Button>
              </form>
            </div>
          </div>
        )}
        {/* Modal de confirmação de exclusão */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-slate-800 rounded-lg shadow-lg p-8 w-full max-w-md relative text-white">
              <h2 className="text-xl font-bold mb-4">Confirmar exclusão</h2>
              <div className="mb-6 text-center">Tem certeza que deseja excluir este usuário?</div>
              <div className="flex flex-row gap-2 justify-end">
                <Button className="bg-gray-500 hover:bg-gray-600 cursor-pointer" onClick={() => setConfirmDeleteId(null)} type="button">Cancelar</Button>
                <Button className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => handleDeleteUserConfirm(confirmDeleteId)} type="button">Excluir</Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de usuários */}
        <div className="w-full max-w-4xl mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-slate-800 text-white rounded-lg">
              <thead>
                <tr className="bg-slate-700 text-slate-300">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Sobrenome</th>
                  <th className="px-4 py-2 text-left">E-mail</th>
                  <th className="px-4 py-2 text-left">Cargo</th>
                  <th className="px-4 py-2 text-left">Nível</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="even:bg-slate-700 odd:bg-slate-800 border-b border-slate-700">
                    <td className="px-4 py-2 break-all">{usuario.id}</td>
                    <td className="px-4 py-2">{usuario.first_name}</td>
                    <td className="px-4 py-2">{usuario.last_name}</td>
                    <td className="px-4 py-2">{usuario.email}</td>
                    <td className="px-4 py-2">{usuario.role}</td>
                    <td className="px-4 py-2">{usuario.user_level}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer" onClick={() => openEditModal(usuario)} size="sm">Editar</Button>
                        <Button className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => setConfirmDeleteId(usuario.id)} size="sm">Excluir</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}