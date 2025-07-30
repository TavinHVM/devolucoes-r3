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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl bg-slate-800 border border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6 px-8 pt-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-lg p-2">
                <img 
                  src="/r3logo.png" 
                  alt="R3 Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <CardTitle className="text-center text-white text-2xl font-bold tracking-tight">
              Devoluções R3
            </CardTitle>
            <p className="text-center text-slate-400 text-sm">
              Faça login para acessar o sistema
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
          {!showForgot ? (
            <div>
              {loginError && (
                <div className="mb-4 p-3 text-center text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg">
                  {loginError}
                </div>
              )}
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    Email
                  </Label>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        required
                        className="h-11 bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                        autoComplete="username"
                      />
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm font-medium">
                    Senha
                  </Label>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        required
                        className="h-11 bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                        autoComplete="current-password"
                      />
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
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
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Entrando...
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Redefinir Senha</h3>
                <p className="text-sm text-slate-400">
                  Digite seu email para receber as instruções
                </p>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="forgot_email" className="text-white text-sm font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="forgot_email"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotEmail ?? ''}
                    onChange={e => {
                      setForgotEmail(e.target.value);
                    }}
                    required
                    className="h-11 bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    autoComplete="username"
                  />
                </div>
                
                {forgotStatus && (
                  <div className="p-3 text-center text-sm text-green-400 bg-green-900/20 border border-green-700/30 rounded-lg">
                    {forgotStatus}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1 h-11 bg-slate-700/50 hover:bg-slate-600 text-white border-slate-600 transition-all duration-200"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotEmail('');
                      setForgotStatus(null);
                    }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
