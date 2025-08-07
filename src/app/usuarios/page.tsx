'use client';
import { useState } from 'react';
import { Users } from 'lucide-react';
import Header from '../../components/header';
import {
  UsuariosStats,
  UsuariosControls,
  UsuariosTable,
  CreateUserModal,
  EditUserModal,
  DeleteConfirmModal,
  Toast,
  useUsuarios,
  filterUsuarios,
  Usuario
} from '../../components/usuarios';

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const {
    usuarios,
    loading,
    toast,
    setToast,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  } = useUsuarios();

  const filteredUsuarios = filterUsuarios(usuarios, searchTerm, selectedLevel);

  const handleEditUserClick = (usuario: Usuario) => {
    setEditUser(usuario);
  };

  const handleDeleteUserClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Carregando usuários...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Users className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
              <p className="text-slate-400">Administre os usuários do sistema</p>
            </div>
          </div>
        </div>

        <UsuariosStats usuarios={usuarios} />

        <UsuariosControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />

        <UsuariosTable
          usuarios={filteredUsuarios}
          onEditUser={handleEditUserClick}
          onDeleteUser={handleDeleteUserClick}
          onCreateUser={() => setShowCreateModal(true)}
        />

        <CreateUserModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={handleCreateUser}
        />

        <EditUserModal
          user={editUser}
          onOpenChange={() => setEditUser(null)}
          onSubmit={handleEditUser}
        />

        <DeleteConfirmModal
          userId={confirmDeleteId}
          onOpenChange={() => setConfirmDeleteId(null)}
          onConfirm={handleDeleteUser}
        />
      </div>
    </div>
  );
}