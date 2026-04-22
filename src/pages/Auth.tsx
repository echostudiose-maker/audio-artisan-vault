import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().trim().email('Email inválido').max(255, 'Email muito longo');
const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(72, 'Senha deve ter no máximo 72 caracteres')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');
const nameSchema = z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo');

type View = 'auth' | 'forgot' | 'forgot-sent' | 'reset';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );

  // Detect reset password flow: Supabase puts type=recovery in URL hash
  const [view, setView] = useState<View>(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || searchParams.get('mode') === 'reset') {
      return 'reset';
    }
    return 'auth';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  useEffect(() => {
    // Only auto-redirect on normal auth views. During 'reset', the recovery
    // session counts as a logged-in user but we must keep them on this page.
    if (user && !isLoading && view === 'auth') {
      navigate('/');
    }
  }, [user, isLoading, navigate, view]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (mode === 'signup') {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada com sucesso! Você já pode usar a plataforma.');
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailResult = emailSchema.safeParse(forgotEmail);
    if (!emailResult.success) {
      toast.error(emailResult.error.errors[0].message);
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setView('forgot-sent');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwResult = passwordSchema.safeParse(newPassword);
    if (!pwResult.success) {
      toast.error(pwResult.error.errors[0].message);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Senha atualizada com sucesso!');
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) toast.error(error.message);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const GoogleButton = (
    <Button variant="outline" className="w-full gap-2 h-11" onClick={handleGoogle} type="button">
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continuar com Google
    </Button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>

        <Card className="border-border">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <Music className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl"><span className="text-primary">Echo</span>Music</CardTitle>
              <CardDescription>
                {view === 'reset'
                  ? 'Defina sua nova senha'
                  : view === 'forgot' || view === 'forgot-sent'
                  ? 'Recuperar senha'
                  : mode === 'login'
                  ? 'Entre na sua conta para continuar'
                  : 'Crie sua conta para começar'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {view === 'auth' && (
              <>
                <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Seu nome"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isSubmitting}
                          maxLength={100}
                          autoComplete="name"
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive">{errors.fullName}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={255}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setForgotEmail(email);
                              setView('forgot');
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Esqueci minha senha
                          </button>
                        )}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={72}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                        </>
                      ) : (
                        mode === 'login' ? 'Entrar' : 'Criar conta'
                      )}
                    </Button>
                  </form>
                </Tabs>
              </>
            )}

            {view === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Email</Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={isSubmitting}
                    maxLength={255}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
                  ) : (
                    'Enviar link de redefinição'
                  )}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setView('auth')}>
                  Voltar
                </Button>
              </form>
            )}

            {view === 'forgot-sent' && (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Enviamos um link para o seu email. Verifique sua caixa de entrada.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setView('auth')}>
                  Voltar para o login
                </Button>
              </div>
            )}

            {view === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                    maxLength={72}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    maxLength={72}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary hover:opacity-90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Atualizando...</>
                  ) : (
                    'Atualizar senha'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
