// Função para criar usuário via API
export const createUser = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  user_level: string;
}) => {
  const response = await fetch('/api/usuarios/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar usuário');
  }

  return await response.json();
};

// Função para editar usuário via API
export const editUser = async (id: number, userData: {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  user_level?: string;
}) => {
  const response = await fetch('/api/usuarios/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...userData }),
  });

  if (!response.ok) {
    throw new Error('Erro ao editar usuário');
  }

  return await response.json();
};

// Função para deletar usuário via API
export const deleteUser = async (id: string) => {
  const response = await fetch('/api/usuarios/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Erro ao excluir usuário');
  }

  return await response.json();
};
