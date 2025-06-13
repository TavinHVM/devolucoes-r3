// Página de login conforme requisitos do sistema
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      password: '',
    },
  });

  async function onSubmit(data: any) {
    // Exemplo: autenticação customizada (ajuste conforme sua estratégia)
    const { data: user } = await supabase
      .from('usuarios')
      .select('*')
      .eq('first_name', data.first_name)
      .eq('last_name', data.last_name)
      .single();
    if (user /* && user.password === data.password */) {
      router.push('/solicitacoes');
    } else {
      alert('Usuário ou senha inválidos');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">Nome:</Label>
              <Input id="first_name" {...form.register('first_name')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Sobrenome:</Label>
              <Input id="last_name" {...form.register('last_name')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha:</Label>
              <Input id="password" type="password" {...form.register('password')} required />
            </div>
            <Button type="submit" className="w-full mt-4">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
