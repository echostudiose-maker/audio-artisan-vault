import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Crown, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const nameSchema = z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo');
const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(72, 'Senha deve ter no máximo 72 caracteres')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');

export default function ProfilePage() {
  const { user, profile, subscription, isSubscribed, isLoading, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameResult = nameSchema.safeParse(fullName);
    if (!nameResult.success) {
      toast.error(nameResult.error.errors[0].message);
      return;
    }
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('user_id', user!.id);

      if (error) {
        toast.error('Erro ao atualizar perfil');
      } else {
        toast.success('Perfil atualizado!');
        await refreshProfile();
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
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
    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Senha atualizada com sucesso!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" /> Perfil
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Lock className="h-4 w-4" /> Senha
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2">
              <Crown className="h-4 w-4" /> Plano
            </TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do perfil</CardTitle>
                <CardDescription>Atualize seu nome e dados pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome"
                      maxLength={100}
                    />
                  </div>
                  <Button type="submit" disabled={isSavingProfile} className="gradient-primary hover:opacity-90">
                    {isSavingProfile ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                    ) : (
                      'Salvar alterações'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Senha */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Alterar senha</CardTitle>
                <CardDescription>Defina uma nova senha para sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      maxLength={72}
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres, com maiúscula, minúscula e número
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      maxLength={72}
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" disabled={isSavingPassword} className="gradient-primary hover:opacity-90">
                    {isSavingPassword ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</>
                    ) : (
                      'Atualizar senha'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plano */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Seu plano</CardTitle>
                <CardDescription>Gerencie sua assinatura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Status:</span>
                  {isSubscribed ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                      <Check className="h-3 w-3" /> Premium Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Gratuito</Badge>
                  )}
                </div>

                {subscription && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Plano:</span>
                      <span className="text-sm text-muted-foreground capitalize">{subscription.plan_type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Ativo desde:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(subscription.current_period_start)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Expira em:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  </>
                )}

                {!isSubscribed && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Faça upgrade para o Premium e tenha acesso ilimitado.
                    </p>
                    <Button asChild className="gradient-primary hover:opacity-90">
                      <a href="/pricing">Ver planos</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
