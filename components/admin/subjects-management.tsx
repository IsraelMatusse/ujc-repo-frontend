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
import { Plus, Edit, Trash2, Search, BookOpen, X } from 'lucide-react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '@/hooks/use-subjects';
import { useCourses } from '@/hooks/use-courses';
import { useSemesters } from '@/hooks/use-semesters';
import { toast } from 'sonner';
import type { SubjectRequestData } from '@/lib/api/types';

export function SubjectsManagement() {
  const { data: subjects, isLoading } = useSubjects();
  const { data: courses } = useCourses();
  const { data: semesters } = useSemesters();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

  const [search, setSearch] = useState('');
  // undefined = sem filtro (evita string vazia no Select)
  const [filterCourseId, setFilterCourseId] = useState<string | undefined>(undefined);
  const [filterSemesterId, setFilterSemesterId] = useState<string | undefined>(undefined);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{
    id: string;
    name: string;
    credits: number;
    courseId: string;
    semesterId: string;
  } | null>(null);
  const [formData, setFormData] = useState<SubjectRequestData>({
    name: '',
    credits: 0,
    courseId: '',
    semesterId: '',
  });
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const getCourseName = (courseId: string) => courses?.find(c => c.id === courseId)?.name || 'N/A';

  const getSemesterName = (semesterId: string) =>
    semesters?.find(s => s.id === semesterId)?.name || 'N/A';

  const filtered = useMemo(() => {
    if (!subjects) return [];
    return subjects.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        getCourseName(s.courseId).toLowerCase().includes(search.toLowerCase());
      const matchesCourse = !filterCourseId || s.courseId === filterCourseId;
      const matchesSemester = !filterSemesterId || s.semesterId === filterSemesterId;
      return matchesSearch && matchesCourse && matchesSemester;
    });
  }, [subjects, search, filterCourseId, filterSemesterId, courses, semesters]);

  const handleCreate = async () => {
    try {
      await createSubject.mutateAsync(formData);
      toast.success('Disciplina criada com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', credits: 0, courseId: '', semesterId: '' });
    } catch {
      toast.error('Erro ao criar disciplina');
    }
  };

  const handleUpdate = async () => {
    if (!editingSubject) return;
    try {
      await updateSubject.mutateAsync({ id: editingSubject.id, data: formData });
      toast.success('Disciplina actualizada com sucesso!');
      setIsEditDialogOpen(false);
      setEditingSubject(null);
    } catch {
      toast.error('Erro ao actualizar disciplina');
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject.mutateAsync(subjectToDelete);
      setSubjectToDelete(null);
    } catch {
      // Error handled by hook
    }
  };

  const openEditDialog = (subject: {
    id: string;
    name: string;
    credits: number;
    courseId: string;
    semesterId: string;
  }) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      credits: subject.credits,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
    });
    setIsEditDialogOpen(true);
  };

  // Formulário partilhado entre criar e editar
  const SubjectForm = ({ idPrefix }: { idPrefix: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`}>Nome da Disciplina</Label>
        <Input
          id={`${idPrefix}-name`}
          placeholder="Ex: Programação I"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-credits`}>Créditos</Label>
        <Input
          id={`${idPrefix}-credits`}
          type="number"
          placeholder="6"
          value={formData.credits}
          onChange={e => setFormData({ ...formData, credits: Number.parseInt(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label>Curso</Label>
        {/* value nunca é string vazia */}
        <Select
          value={formData.courseId || undefined}
          onValueChange={value => setFormData({ ...formData, courseId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o curso" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Semestre</Label>
        <Select
          value={formData.semesterId || undefined}
          onValueChange={value => setFormData({ ...formData, semesterId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o semestre" />
          </SelectTrigger>
          <SelectContent>
            {semesters?.map(semester => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Disciplinas</h3>
          <p className="text-sm text-muted-foreground">
            Criar e gerir disciplinas por curso e semestre
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Disciplina</DialogTitle>
              <DialogDescription>Criar uma nova disciplina no sistema</DialogDescription>
            </DialogHeader>
            <SubjectForm idPrefix="add" />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={createSubject.isPending}>
                {createSubject.isPending ? 'Criando...' : 'Criar Disciplina'}
              </Button>
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

        {/* Filtro curso — sem SelectItem com value="" */}
        <div className="flex items-center gap-2">
          <Select value={filterCourseId} onValueChange={v => setFilterCourseId(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por curso" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterCourseId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterCourseId(undefined)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Limpar filtro de curso"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filtro semestre — sem SelectItem com value="" */}
        <div className="flex items-center gap-2">
          <Select value={filterSemesterId} onValueChange={v => setFilterSemesterId(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por semestre" />
            </SelectTrigger>
            <SelectContent>
              {semesters?.map(semester => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterSemesterId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterSemesterId(undefined)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Limpar filtro de semestre"
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
              <TableHead className="font-semibold text-foreground py-3">Curso</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Semestre</TableHead>
              <TableHead className="font-semibold text-foreground py-3 text-center">
                Créditos
              </TableHead>
              <TableHead className="font-semibold text-foreground py-3 pr-4 text-right">
                Acções
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    {search || filterCourseId || filterSemesterId
                      ? 'Nenhum resultado encontrado'
                      : 'Nenhuma disciplina cadastrada'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((subject, index) => (
                <TableRow
                  key={subject.id}
                  className="border-t border-border hover:bg-blue-50/40 transition-colors"
                >
                  <TableCell className="py-3 pl-4 text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3 font-medium">{subject.name}</TableCell>
                  <TableCell className="py-3 max-w-[180px]">
                    <span
                      className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20 truncate max-w-full"
                      title={getCourseName(subject.courseId)}
                    >
                      {getCourseName(subject.courseId)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {getSemesterName(subject.semesterId)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                      {subject.credits} cr.
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                        title="Editar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSubjectToDelete(subject.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        title="Eliminar"
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
            {filtered.length === 1 ? 'disciplina encontrada' : 'disciplinas encontradas'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Disciplina</DialogTitle>
            <DialogDescription>Actualizar informações da disciplina</DialogDescription>
          </DialogHeader>
          <SubjectForm idPrefix="edit" />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={updateSubject.isPending}>
              {updateSubject.isPending ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acção não pode ser desfeita. A disciplina será permanentemente removida do
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