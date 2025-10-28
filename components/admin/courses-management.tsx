'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Edit, Trash2, GraduationCap, Eye } from 'lucide-react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/use-courses';
import { toast } from 'sonner';
import type { CourseRequest } from '@/lib/api/types';
import Link from 'next/link';

export function CoursesManagement() {
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<CourseRequest>({ name: '' });
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      await createCourse.mutateAsync(formData);
      toast.success('Curso criado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '' });
    } catch (error) {
      toast.error('Erro ao criar curso');
    }
  };

  const handleUpdate = async () => {
    if (!editingCourse) return;
    try {
      await updateCourse.mutateAsync({ id: editingCourse.id, data: formData });
      toast.success('Curso atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      toast.error('Erro ao atualizar curso');
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse.mutateAsync(courseToDelete);
      setCourseToDelete(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const openEditDialog = (course: { id: string; name: string }) => {
    setEditingCourse(course);
    setFormData({ name: course.name });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map(course => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                {course.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Link href={`/admin/courses/${course.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(course)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCourseToDelete(course.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum curso cadastrado</p>
            <p className="text-sm text-muted-foreground">Clique em "Novo Curso" para começar</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>Atualizar informações do curso</DialogDescription>
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
                {updateCourse.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O curso será permanentemente removido do sistema.
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
