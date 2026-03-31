'use client';

import { useState, useMemo } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { useYears, useCreateYear, useUpdateYear, useDeleteYear } from '@/hooks/use-years';
import { toast } from 'sonner';
import type { YearCreationData } from '@/lib/api/types';

export function YearsManagement() {
  const { data: years, isLoading } = useYears();
  const createYear = useCreateYear();
  const updateYear = useUpdateYear();
  const deleteYear = useDeleteYear();

  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<{
    id: string;
    name: string;
    order: number;
  } | null>(null);
  const [formData, setFormData] = useState<YearCreationData>({ name: '', order: 1 });
  const [yearToDelete, setYearToDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!years) return [];
    const q = search.toLowerCase();
    return years.filter(y => y.name.toLowerCase().includes(q) || String(y.order).includes(q));
  }, [years, search]);

  const handleCreate = async () => {
    try {
      await createYear.mutateAsync(formData);
      toast.success('Ano académico criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', order: 1 });
    } catch {
      toast.error('Erro ao criar ano académico');
    }
  };

  const handleUpdate = async () => {
    if (!editingYear) return;
    try {
      await updateYear.mutateAsync({ id: editingYear.id, data: formData });
      toast.success('Ano académico actualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingYear(null);
    } catch {
      toast.error('Erro ao actualizar ano académico');
    }
  };

  const handleDelete = async () => {
    if (!yearToDelete) return;
    try {
      await deleteYear.mutateAsync(yearToDelete);
      setYearToDelete(null);
    } catch {
      // Error handled by hook
    }
  };

  const openEditDialog = (year: { id: string; name: string; order: number }) => {
    setEditingYear(year);
    setFormData({ name: year.name, order: year.order });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Anos Académicos</h3>
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
              <DialogTitle>Adicionar Ano Académico</DialogTitle>
              <DialogDescription>Criar um novo ano académico no sistema</DialogDescription>
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome ou ordem..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3 pl-4 w-10">#</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Nome</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Ordem</TableHead>
              <TableHead className="font-semibold text-foreground py-3 pr-4 text-right">
                Acções
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    {search ? 'Nenhum resultado encontrado' : 'Nenhum ano académico cadastrado'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((year, index) => (
                <TableRow
                  key={year.id}
                  className="border-t border-border hover:bg-blue-50/40 transition-colors"
                >
                  <TableCell className="py-3 pl-4 text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3 font-medium">{year.name}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {year.order}º
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(year)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setYearToDelete(year.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'ano encontrado' : 'anos encontrados'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ano Académico</DialogTitle>
            <DialogDescription>Actualizar informações do ano académico</DialogDescription>
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
                {updateYear.isPending ? 'Actualizando...' : 'Actualizar'}
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
              Esta acção não pode ser desfeita. O ano académico será permanentemente removido do
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}