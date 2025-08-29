// Tipo do usuário conforme a tabela user_profiles
export interface Usuario {
  id: string | number;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
  created_at?: string;
  email: string;
  permissions?: UserPermission[];
}

export interface UserPermission {
  id: number;
  permission: {
    id: number;
    name: string;
    label: string;
    description?: string;
    category: string;
  };
}

export interface Permission {
  id: number;
  name: string;
  label: string;
  description?: string;
  category: string;
}

export interface CreateUserForm extends Omit<Usuario, 'id' | 'created_at' | 'permissions'> {
  password: string;
  permissions?: number[]; // IDs das permissões selecionadas
}

export interface EditUserForm extends Omit<Usuario, 'id' | 'created_at' | 'permissions'> {
  password?: string; // Senha opcional para edição
  permissions?: number[]; // IDs das permissões selecionadas
}
