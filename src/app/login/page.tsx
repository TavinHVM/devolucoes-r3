'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useEffect } from 'react';

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

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/');
      }
    }
    checkAuth();
  }, [router]);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Card className="w-full max-w-sm shadow-2xl bg-slate-800 border-none">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl font-bold">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email:</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                required
                className="bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                autoComplete="username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">Senha:</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                required
                className="bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
