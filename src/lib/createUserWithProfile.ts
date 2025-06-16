import { createClient } from '@supabase/supabase-js';

type CreateUserProfileParams = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
};

console.log("process.env.NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("process.env.SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}
if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function createUserWithProfile(
  params: CreateUserProfileParams
): Promise<{ success: boolean; error?: unknown; userId?: string }> {
  // 1. Cria usuário no Auth via Admin API
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
  });

  if (userError || !userData?.user?.id) {
    return { success: false, error: userError || 'Erro ao criar usuário' };
  }

  const userId = userData.user.id;

  // 2. Atualiza user_profiles com dados adicionais (incluindo email)
  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email, // salva o email também
      role: params.role,
      user_level: params.user_level,
    })
    .eq('id', userId);

  if (profileError) {
    return { success: false, error: profileError, userId };
  }

  return { success: true, userId };
}
