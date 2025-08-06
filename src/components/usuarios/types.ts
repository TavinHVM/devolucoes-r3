// Tipo do usuário conforme a tabela user_profiles
export interface Usuario {
  id: string | number;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
  created_at?: string;
  email: string;
}

export interface CreateUserForm extends Omit<Usuario, 'id' | 'created_at'> {
  password: string;
}

export interface EditUserForm extends Omit<Usuario, 'id' | 'created_at'> {
  password?: string; // Senha opcional para edição
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}
