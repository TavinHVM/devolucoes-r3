'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

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
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        
        console.log('Login bem-sucedido, dados salvos no localStorage');
        console.log('Usuário:', result.user);
        console.log('Token:', result.token);
        
        // Aguardar um momento para garantir que o localStorage foi salvo
        setTimeout(() => {
          console.log('Redirecionando para home...');
          router.push('/');
        }, 100);
      } else {
        // Erro no login
        setLoginError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      setLoginError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus('Funcionalidade de redefinição de senha será implementada em breve.');
    // Aqui você pode implementar a funcionalidade de redefinição de senha no futuro
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Card className="w-full max-w-sm shadow-2xl bg-slate-800 border-none">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl font-bold">Devoluções R3 - Login</CardTitle>
        </CardHeader>
        <CardContent>
          {!showForgot ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              {loginError && (
                <div className="text-center text-sm text-red-400 bg-red-900/20 p-2 rounded">
                  {loginError}
                </div>
              )}
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
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
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
        </CardContent>
      </Card>
    </div>
  );
}
