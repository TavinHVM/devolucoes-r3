'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert('Usuário ou senha inválidos');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email:</Label>
              <Input id="email" type="email" {...form.register('email')} required />
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
