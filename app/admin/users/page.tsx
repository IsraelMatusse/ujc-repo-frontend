'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminUsers, useDeleteUser } from '@/hooks/use-admin';
import { Search, Trash2, UserCog, UserPlus, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type UserRole = 'ADMIN' | 'USER' | 'DOCENTE';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const EMPTY_FORM: RegisterFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function UsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const deleteUser = useDeleteUser();
  const { register } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Estado do dialog de registo
  const [registerOpen, setRegisterOpen] = useState(false);
  const [form, setForm] = useState<RegisterFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Filtro de pesquisa ──
  const filteredUsers = users?.filter(
    user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Handlers do formulário ──
  const handleField =
    (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setFormError('');
    };

  const handleRoleChange = (value: UserRole) => {
    setForm(prev => ({ ...prev, role: value }));
    setFormError('');
  };

  const handleRegisterOpen = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleRegisterSubmit = async () => {
    setFormError('');

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setFormError('Por favor, preencha todos os campos.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }

    if (form.password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await register(form.fullName, form.email, form.password, form.role);
      if (success) {
        setRegisterOpen(false);
        setForm(EMPTY_FORM);
      } else {
        setFormError('Erro ao criar utilizador. Verifique os dados e tente novamente.');
      }
    } catch {
      setFormError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
        </div>
        <Button onClick={handleRegisterOpen} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* ── Tabela ── */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Total de {users?.length || 0} usuários registados</CardDescription>
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.code}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'ADMIN'
                          ? 'default'
                          : user.role === 'DOCENTE'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {user.role === 'ADMIN'
                        ? 'Admin'
                        : user.role === 'DOCENTE'
                          ? 'Docente'
                          : 'Estudante'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status ? 'default' : 'destructive'}>
                      {user.status ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserToDelete(user.id)}
                        disabled={user.role === 'ADMIN'}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Dialog: Novo Usuário ── */}
      <Dialog open={registerOpen} onOpenChange={handleRegisterClose}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registar Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Crie uma conta para um novo utilizador. Aqui pode atribuir qualquer role ao
              utilizador.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-fullName">Nome Completo</Label>
              <Input
                id="reg-fullName"
                placeholder="Nome completo do utilizador"
                value={form.fullName}
                onChange={handleField('fullName')}
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="email@ujc.ac.mz"
                value={form.email}
                onChange={handleField('email')}
                disabled={isSubmitting}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-role">Role</Label>
              <Select value={form.role} onValueChange={handleRoleChange} disabled={isSubmitting}>
                <SelectTrigger id="reg-role">
                  <SelectValue placeholder="Selecionar role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Estudante</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="DOCENTE">Docente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Senha */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Senha</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Mín. 6 caracteres"
                  value={form.password}
                  onChange={handleField('password')}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-confirmPassword">Confirmar Senha</Label>
                <Input
                  id="reg-confirmPassword"
                  type="password"
                  placeholder="Repetir senha"
                  value={form.confirmPassword}
                  onChange={handleField('confirmPassword')}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Erro */}
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleRegisterClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleRegisterSubmit} disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />A criar...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Criar Utilizador
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog: Confirmar eliminação ── */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  deleteUser.mutate(userToDelete);
                  setUserToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}