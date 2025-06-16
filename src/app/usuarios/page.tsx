'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

// Novo tipo do usuário
type Usuario = {
  id: string; // uuid
  first_name: string;
  last_name: string;
  email?: string;
  role: string;
  user_level: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchUsuarios() {
      // Busca apenas user_profiles (sem join)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, role, user_level')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsuarios(data);
      }
      setLoading(false);
    }
    fetchUsuarios();
  }, []);

  async function excluirUsuario(id: string) {
    setDeleting(true);
    await supabase.from('user_profiles').delete().eq('id', id);
    setUsuarios(usuarios.filter(u => u.id !== id));
    setDeleting(false);
    setConfirmDeleteId(null);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(r => r.json());
    if (res.success) {
      setShowModal(false);
      setForm({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: '',
        user_level: '',
      });
      // Atualiza lista de usuários
      const { data } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, role, user_level')
        .order('created_at', { ascending: false });
      if (data) {
        setUsuarios(data);
      }
    } else {
      setError(res.error?.message || String(res.error));
    }
    setCreating(false);
  }

  function openEditModal(usuario: Usuario) {
    setEditUser(usuario);
    setEditForm({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      role: usuario.role,
      user_level: usuario.user_level,
    });
  }

  async function handleEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setEditing(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        role: editForm.role,
        user_level: editForm.user_level,
      })
      .eq('id', editUser.id);
    if (!error) {
      setUsuarios(usuarios.map(u =>
        u.id === editUser.id
          ? { ...u, ...editForm }
          : u
      ));
      setEditUser(null);
    }
    setEditing(false);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Modal de edição de usuário */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setEditUser(null)}
              type="button"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
            <form onSubmit={handleEditUser} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="edit_email">E-mail</Label>
                <Input
                  id="edit_email"
                  value={editUser.email}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="edit_first_name">Nome</Label>
                <Input
                  id="edit_first_name"
                  value={editForm.first_name}
                  onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_last_name">Sobrenome</Label>
                <Input
                  id="edit_last_name"
                  value={editForm.last_name}
                  onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_role">Cargo</Label>
                <Input
                  id="edit_role"
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_user_level">Nível</Label>
                <Select
                  value={editForm.user_level}
                  onValueChange={value => setEditForm(f => ({ ...f, user_level: value }))}
                >
                  <SelectTrigger id="edit_user_level" className="w-full">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adm">Adm</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="televendas">Televendas</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={editing}>
                {editing ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Modal de confirmação de exclusão */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4 text-center">Confirmar Exclusão</h2>
            <p className="mb-6 text-center">Tem certeza que deseja excluir este usuário?</p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="destructive"
                onClick={() => excluirUsuario(confirmDeleteId)}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Sim, excluir"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de criação de usuário */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setShowModal(false)}
              type="button"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Criar Novo Usuário</h2>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="user_level">Nível</Label>
                <Select
                  value={form.user_level}
                  onValueChange={value => setForm(f => ({ ...f, user_level: value }))}
                >
                  <SelectTrigger id="user_level" className="w-full">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adm">Adm</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="televendas">Televendas</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full mt-2" disabled={creating}>
                {creating ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-6 gap-4">
        <h1 className="text-3xl font-bold text-center md:text-left">Usuários Cadastrados</h1>
        <Button className="bg-green-500 hover:bg-green-600" type="button">
          Ativar Manutenção
        </Button>
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Lista de Usuários</span>
            <Button
              className="bg-green-500 hover:bg-green-600"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Criar Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">Carregando...</td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  usuarios.map(usuario => (
                    <tr key={usuario.id} className="bg-white border-b">
                      <td className="px-4 py-2 break-all">{usuario.id}</td>
                      <td className="px-4 py-2">{usuario.first_name}</td>
                      <td className="px-4 py-2">{usuario.last_name}</td>
                      <td className="px-4 py-2">{usuario.email}</td>
                      <td className="px-4 py-2">{usuario.role}</td>
                      <td className="px-4 py-2">{usuario.user_level}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(usuario)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmDeleteId(usuario.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}