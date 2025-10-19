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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este semestre?')) return;
    try {
      await deleteSemester.mutateAsync(id);
      toast.success('Semestre excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir semestre');
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
            <Button>
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
                <Layers className="h-5 w-5" />
                {semester.name}
              </CardTitle>
              <CardDescription>Ano: {getYearName(semester.yearId)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(semester)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(semester.id)}>
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
    </div>
  );
}
