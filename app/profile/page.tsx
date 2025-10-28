'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { useUpdateEmail, useUpdatePassword, useUserStats } from '@/hooks/use-users';
import { Mail, Lock, User, Code, Loader2, Upload, Download, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const updateEmailMutation = useUpdateEmail();
  const updatePasswordMutation = useUpdatePassword();

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Você precisa estar autenticado para ver esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    await updateEmailMutation.mutateAsync({ email: newEmail });
    setEmailDialogOpen(false);
    setNewEmail('');
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    await updatePasswordMutation.mutateAsync({ currentPassword, newPassword });
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Seus dados cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarFallback className="bg-blue-600 text-white text-xl sm:text-2xl">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold">{user.fullName}</h3>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {user.role === 'ADMIN' ? 'Administrador' : 'Estudante'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium break-words">{user.email}</p>
                </div>
                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      Alterar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Atualizar Email</DialogTitle>
                      <DialogDescription>Digite seu novo endereço de email</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Novo Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="novo.email@ujc.ac.mz"
                          value={newEmail}
                          onChange={e => setNewEmail(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleUpdateEmail}
                        disabled={updateEmailMutation.isPending || !newEmail}
                        className="w-full"
                      >
                        {updateEmailMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Atualizando...
                          </>
                        ) : (
                          'Atualizar Email'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Code className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Código de Estudante</Label>
                  <p className="font-medium">{user.code}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <p className="font-medium">{user.status ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Atualizar Senha</DialogTitle>
                    <DialogDescription>Digite sua senha atual e a nova senha</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-red-600">As senhas não coincidem</p>
                    )}
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={
                        updatePasswordMutation.isPending ||
                        !currentPassword ||
                        !newPassword ||
                        newPassword !== confirmPassword
                      }
                      className="w-full"
                    >
                      {updatePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        'Atualizar Senha'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Sua atividade no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Uploads</span>
                    </div>
                    <span className="text-2xl font-bold">{stats?.totalUploads || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Downloads</span>
                    </div>
                    <span className="text-2xl font-bold">{stats?.totalDownloads || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
