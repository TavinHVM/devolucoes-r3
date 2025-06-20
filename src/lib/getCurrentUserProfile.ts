import { supabase } from './supabaseClient';

export async function getCurrentUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
  return profile;
}
