import { supabase } from './supabaseClient';

export async function signUpWithProfile({
  email,
  password,
  first_name,
  last_name,
  role,
  user_level,
}: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
}) {
  // 1. Cria o usuário no Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData.user) {
    throw signUpError || new Error('Erro ao criar usuário');
  }

  // 2. Cria o perfil na tabela user_profiles
  const { error: profileError } = await supabase.from('user_profiles').insert([
    {
      id: signUpData.user.id, // mesmo id do Auth
      first_name,
      last_name,
      role,
      user_level,
    },
  ]);

  if (profileError) {
    // (Opcional) rollback: deletar usuário do Auth se perfil falhar
    // Necessário permissão de admin para usar esta função:
    // await supabase.auth.admin.deleteUser(signUpData.user.id);
    throw profileError;
  }

  return signUpData.user;
}
