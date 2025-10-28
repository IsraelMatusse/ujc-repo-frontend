'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import {
  useSemesters,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
} from '@/hooks/use-semesters';
import { useYears } from '@/hooks/use-years';
import { toast } from 'sonner';
import type { SemesterCreationData } from '@/lib/api/types';
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

export function SemestersManagement() {
  const { data: semesters, isLoading } = useSemesters();
  const { data: years } = useYears();
  const createSemester = useCreateSemester();
  const updateSemester = useUpdateSemester();
  const deleteSemester = useDeleteSemester();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<{
    id: string;
    name: string;
    yearId: string;
  } | null>(null);
  const [formData, setFormData] = useState<SemesterCreationData>({ name: '', yearId: '' });
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      await createSemester.mutateAsync(formData);
      toast.success('Semestre criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', yearId: '' });
    } catch (error) {
      toast.error('Erro ao criar semestre');
    }
  };

  const handleUpdate = async () => {
    if (!editingSemester) return;
    try {
      await updateSemester.mutateAsync({ id: editingSemester.id, data: formData });
      toast.success('Semestre atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingSemester(null);
    } catch (error) {
      toast.error('Erro ao atualizar semestre');
    }
  };

  const handleDelete = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester.mutateAsync(semesterToDelete);
      setSemesterToDelete(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const openEditDialog = (semester: { id: string; name: string; yearId: string }) => {
    setEditingSemester(semester);
    setFormData({ name: semester.name, yearId: semester.yearId });
    setIsEditDialogOpen(true);
  };

  const getYearName = (yearId: string) => {
    return years?.find(y => y.id === yearId)?.name || 'N/A';
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Semestres</h3>
          <p className="text-sm text-muted-foreground">Criar e gerir semestres por ano</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Semestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Semestre</DialogTitle>
              <DialogDescription>Criar um novo semestre no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester-name">Nome do Semestre</Label>
                <Input
                  id="semester-name"
                  placeholder="Ex: 1º Semestre"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester-year">Ano Acadêmico</Label>
                <Select
                  value={formData.yearId}
                  onValueChange={value => setFormData({ ...formData, yearId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years?.map(year => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={createSemester.isPending}>
                  {createSemester.isPending ? 'Criando...' : 'Criar Semestre'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {semesters?.map(semester => (
          <Card key={semester.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                {semester.name}
              </CardTitle>
              <CardDescription>Ano: {getYearName(semester.yearId)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(semester)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSemesterToDelete(semester.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {semesters?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum semestre cadastrado</p>
            <p className="text-sm text-muted-foreground">Clique em "Novo Semestre" para começar</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Semestre</DialogTitle>
            <DialogDescription>Atualizar informações do semestre</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-semester-name">Nome do Semestre</Label>
              <Input
                id="edit-semester-name"
                placeholder="Ex: 1º Semestre"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-semester-year">Ano Acadêmico</Label>
              <Select
                value={formData.yearId}
                onValueChange={value => setFormData({ ...formData, yearId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years?.map(year => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateSemester.isPending}>
                {updateSemester.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!semesterToDelete} onOpenChange={() => setSemesterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O semestre será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
