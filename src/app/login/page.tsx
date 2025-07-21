'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
<<<<<<< HEAD
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useEffect } from 'react';
=======
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
>>>>>>> main

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
<<<<<<< HEAD
=======
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
>>>>>>> main

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/');
      }
    }
    checkAuth();
<<<<<<< HEAD
  }, [router]);
=======
  }, [router, showForgot, forgotEmail]);
>>>>>>> main

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

<<<<<<< HEAD
=======
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotStatus(null);
    const redirectTo = window.location.origin + '/reset-password';
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo
    });
    if (error) {
      setForgotStatus('Erro ao enviar e-mail de redefinição: ' + error.message);
    } else {
      setForgotStatus('E-mail de redefinição enviado com sucesso!');
    }
  }

>>>>>>> main
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Card className="w-full max-w-sm shadow-2xl bg-slate-800 border-none">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl font-bold">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
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
=======
          {!showForgot ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email:</Label>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      {...field}
                      required
                      className="bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                      autoComplete="username"
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Senha:</Label>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      required
                      className="bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                      autoComplete="current-password"
                    />
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="text-blue-400 hover:underline text-sm bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotEmail('');
                    setForgotStatus(null);
                  }}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <Button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer">
                Entrar
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="forgot_email" className="text-white">E-mail para redefinir senha:</Label>
                <Input
                  id="forgot_email"
                  type="email"
                  value={forgotEmail ?? ''}
                  onChange={e => {
                    setForgotEmail(e.target.value);
                  }}
                  required
                  className="bg-slate-700 text-white border-slate-600 placeholder:text-slate-400"
                  autoComplete="username"
                />
              </div>
              {forgotStatus && <div className="text-center text-sm text-green-400">{forgotStatus}</div>}
              <div className="flex gap-2">
                <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer" onClick={() => {
                  setShowForgot(false);
                  setForgotEmail('');
                  setForgotStatus(null);
                }}>
                  Voltar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Enviar e-mail
                </Button>
              </div>
            </form>
          )}
>>>>>>> main
        </CardContent>
      </Card>
    </div>
  );
}
