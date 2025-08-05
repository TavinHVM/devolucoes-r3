'use client';
import { useState, useEffect } from 'react';
import { Usuario, CreateUserForm, EditUserForm, ToastMessage } from './types';
import { fetchUsuarios } from '../../utils/usuarios/fetchUsuarios';
import { createUser, editUser as editUserAPI, deleteUser } from '../../utils/usuarios/apiUtils';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchUsuariosList = async () => {
    try {
      setLoading(true);
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
      setToast({ message: 'Erro ao carregar usuários.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (form: CreateUserForm) => {
    try {
      await createUser(form);
      setToast({ message: 'Usuário criado com sucesso!', type: 'success' });
      fetchUsuariosList();
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setToast({ message: 'Erro ao criar usuário.', type: 'error' });
      return false;
    }
  };

  const handleEditUser = async (id: number, form: EditUserForm) => {
    try {
      await editUserAPI(id, form);
      setToast({ message: 'Usuário editado com sucesso!', type: 'success' });
      fetchUsuariosList();
      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      setToast({ message: 'Erro ao editar usuário.', type: 'error' });
      return false;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setToast({ message: 'Usuário excluído com sucesso!', type: 'success' });
      fetchUsuariosList();
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setToast({ message: 'Erro ao excluir usuário.', type: 'error' });
      return false;
    }
  };

  useEffect(() => {
    fetchUsuariosList();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    usuarios,
    loading,
    toast,
    setToast,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    refetch: fetchUsuariosList,
  };
};
