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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useYears, useCreateYear, useUpdateYear, useDeleteYear } from '@/hooks/use-years';
import { toast } from 'sonner';
import type { YearCreationData } from '@/lib/api/types';
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

export function YearsManagement() {
  const { data: years, isLoading } = useYears();
  const createYear = useCreateYear();
  const updateYear = useUpdateYear();
  const deleteYear = useDeleteYear();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<{
    id: string;
    name: string;
    order: number;
  } | null>(null);
  const [formData, setFormData] = useState<YearCreationData>({ name: '', order: 1 });
  const [yearToDelete, setYearToDelete] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      await createYear.mutateAsync(formData);
      toast.success('Ano acadêmico criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', order: 1 });
    } catch (error) {
      toast.error('Erro ao criar ano acadêmico');
    }
  };

  const handleUpdate = async () => {
    if (!editingYear) return;
    try {
      await updateYear.mutateAsync({ id: editingYear.id, data: formData });
      toast.success('Ano acadêmico atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingYear(null);
    } catch (error) {
      toast.error('Erro ao atualizar ano acadêmico');
    }
  };

  const handleDelete = async () => {
    if (!yearToDelete) return;
    try {
      await deleteYear.mutateAsync(yearToDelete);
      setYearToDelete(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const openEditDialog = (year: { id: string; name: string; order: number }) => {
    setEditingYear(year);
    setFormData({ name: year.name, order: year.order });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Anos Acadêmicos</h3>
          <p className="text-sm text-muted-foreground">Criar e gerir anos do curso</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Ano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Ano Acadêmico</DialogTitle>
              <DialogDescription>Criar um novo ano acadêmico no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year-name">Nome do Ano</Label>
                <Input
                  id="year-name"
                  placeholder="Ex: 1º Ano"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year-order">Ordem</Label>
                <Input
                  id="year-order"
                  type="number"
                  placeholder="1"
                  value={formData.order}
                  onChange={e =>
                    setFormData({ ...formData, order: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={createYear.isPending}>
                  {createYear.isPending ? 'Criando...' : 'Criar Ano'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {years?.map(year => (
          <Card key={year.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {year.name}
              </CardTitle>
              <CardDescription>Ordem: {year.order}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(year)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setYearToDelete(year.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {years?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum ano acadêmico cadastrado</p>
            <p className="text-sm text-muted-foreground">Clique em "Novo Ano" para começar</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ano Acadêmico</DialogTitle>
            <DialogDescription>Atualizar informações do ano acadêmico</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-year-name">Nome do Ano</Label>
              <Input
                id="edit-year-name"
                placeholder="Ex: 1º Ano"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year-order">Ordem</Label>
              <Input
                id="edit-year-order"
                type="number"
                placeholder="1"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateYear.isPending}>
                {updateYear.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!yearToDelete} onOpenChange={() => setYearToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O ano acadêmico será permanentemente removido do
              sistema.
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
