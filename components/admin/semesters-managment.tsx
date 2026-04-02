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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, Layers, X } from 'lucide-react';
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

  const [search, setSearch] = useState('');
  // undefined = sem filtro activo (evita passar string vazia ao Select)
  const [filterYearId, setFilterYearId] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<{
    id: string;
    name: string;
    yearId: string;
  } | null>(null);
  const [formData, setFormData] = useState<SemesterCreationData>({ name: '', yearId: '' });
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

  const getYearName = (yearId: string) => years?.find(y => y.id === yearId)?.name || 'N/A';

  const filtered = useMemo(() => {
    if (!semesters) return [];
    return semesters.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        getYearName(s.yearId).toLowerCase().includes(search.toLowerCase());
      const matchesYear = !filterYearId || s.yearId === filterYearId;
      return matchesSearch && matchesYear;
    });
  }, [semesters, search, filterYearId, years]);

  const handleCreate = async () => {
    try {
      await createSemester.mutateAsync(formData);
      toast.success('Semestre criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', yearId: '' });
    } catch {
      toast.error('Erro ao criar semestre');
    }
  };

  const handleUpdate = async () => {
    if (!editingSemester) return;
    try {
      await updateSemester.mutateAsync({ id: editingSemester.id, data: formData });
      toast.success('Semestre actualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingSemester(null);
    } catch {
      toast.error('Erro ao actualizar semestre');
    }
  };

  const handleDelete = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester.mutateAsync(semesterToDelete);
      setSemesterToDelete(null);
    } catch {
      // Error handled by hook
    }
  };

  const openEditDialog = (semester: { id: string; name: string; yearId: string }) => {
    setEditingSemester(semester);
    setFormData({ name: semester.name, yearId: semester.yearId });
    setIsEditDialogOpen(true);
  };

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
                <Label>Ano Académico</Label>
                {/* value nunca é string vazia — usa undefined para mostrar placeholder */}
                <Select
                  value={formData.yearId || undefined}
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

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Dropdown de filtro sem opção com value="" */}
          <Select value={filterYearId} onValueChange={v => setFilterYearId(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por ano" />
            </SelectTrigger>
            <SelectContent>
              {years?.map(year => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Botão X para limpar o filtro em vez de SelectItem vazio */}
          {filterYearId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterYearId(undefined)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Limpar filtro"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-blue-100 dark:bg-blue-900">
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3 pl-4 w-10">#</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Nome</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Ano Académico</TableHead>
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
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    {search || filterYearId
                      ? 'Nenhum resultado encontrado'
                      : 'Nenhum semestre cadastrado'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((semester, index) => (
                <TableRow
                  key={semester.id}
                  className="border-t border-border hover:bg-blue-50/40 transition-colors"
                >
                  <TableCell className="py-3 pl-4 text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3 font-medium">{semester.name}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {getYearName(semester.yearId)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(semester)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSemesterToDelete(semester.id)}
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
            {filtered.length}{' '}
            {filtered.length === 1 ? 'semestre encontrado' : 'semestres encontrados'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Semestre</DialogTitle>
            <DialogDescription>Actualizar informações do semestre</DialogDescription>
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
              <Label>Ano Académico</Label>
              <Select
                value={formData.yearId || undefined}
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
                {updateSemester.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!semesterToDelete} onOpenChange={() => setSemesterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acção não pode ser desfeita. O semestre será permanentemente removido do sistema.
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