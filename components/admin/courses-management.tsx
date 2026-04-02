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
import { Plus, Edit, Trash2, Search, GraduationCap, Eye } from 'lucide-react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/use-courses';
import { toast } from 'sonner';
import type { CourseRequest } from '@/lib/api/types';
import Link from 'next/link';

export function CoursesManagement() {
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<CourseRequest>({ name: '' });
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [courses, search]);

  const handleCreate = async () => {
    try {
      await createCourse.mutateAsync(formData);
      toast.success('Curso criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '' });
    } catch {
      toast.error('Erro ao criar curso');
    }
  };

  const handleUpdate = async () => {
    if (!editingCourse) return;
    try {
      await updateCourse.mutateAsync({ id: editingCourse.id, data: formData });
      toast.success('Curso actualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } catch {
      toast.error('Erro ao actualizar curso');
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse.mutateAsync(courseToDelete);
      setCourseToDelete(null);
    } catch {
      // Error handled by hook
    }
  };

  const openEditDialog = (course: { id: string; name: string }) => {
    setEditingCourse(course);
    setFormData({ name: course.name });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Cursos</h3>
          <p className="text-sm text-muted-foreground">Criar e gerir cursos disponíveis</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Curso</DialogTitle>
              <DialogDescription>Criar um novo curso no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-name">Nome do Curso</Label>
                <Input
                  id="course-name"
                  placeholder="Ex: Engenharia de Tecnologias e Sistemas de Informação"
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={createCourse.isPending}>
                  {createCourse.isPending ? 'Criando...' : 'Criar Curso'}
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
          placeholder="Pesquisar por nome do curso..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-blue-100 dark:bg-blue-900">
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3 pl-4 w-10">#</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Nome do Curso</TableHead>
              <TableHead className="font-semibold text-foreground py-3 pr-4 text-right">
                Acções
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    {search ? 'Nenhum resultado encontrado' : 'Nenhum curso cadastrado'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((course, index) => (
                <TableRow
                  key={course.id}
                  className="border-t border-border hover:bg-blue-50/40 transition-colors"
                >
                  <TableCell className="py-3 pl-4 text-muted-foreground text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3 font-medium">{course.name}</TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                        title="Ver detalhes"
                      >
                        <Link href={`/admin/courses/${course.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(course)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                        title="Editar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCourseToDelete(course.id)}
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
            {filtered.length} {filtered.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>Actualizar informações do curso</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-course-name">Nome do Curso</Label>
              <Input
                id="edit-course-name"
                placeholder="Ex: Engenharia de Tecnologias e Sistemas de Informação"
                value={formData.name}
                onChange={e => setFormData({ name: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateCourse.isPending}>
                {updateCourse.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acção não pode ser desfeita. O curso será permanentemente removido do sistema.
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