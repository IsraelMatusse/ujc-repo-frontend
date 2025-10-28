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
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
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

export function SubjectsManagement() {
  const { data: subjects, isLoading } = useSubjects();
  const { data: courses } = useCourses();
  const { data: semesters } = useSemesters();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

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

  const handleCreate = async () => {
    try {
      await createSubject.mutateAsync(formData);
      toast.success('Disciplina criada com sucesso!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', credits: 0, courseId: '', semesterId: '' });
    } catch (error) {
      toast.error('Erro ao criar disciplina');
    }
  };

  const handleUpdate = async () => {
    if (!editingSubject) return;
    try {
      await updateSubject.mutateAsync({ id: editingSubject.id, data: formData });
      toast.success('Disciplina atualizada com sucesso!');
      setIsEditDialogOpen(false);
      setEditingSubject(null);
    } catch (error) {
      toast.error('Erro ao atualizar disciplina');
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject.mutateAsync(subjectToDelete);
      setSubjectToDelete(null);
    } catch (error) {
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

  const getCourseName = (courseId: string) => {
    return courses?.find(c => c.id === courseId)?.name || 'N/A';
  };

  const getSemesterName = (semesterId: string) => {
    return semesters?.find(s => s.id === semesterId)?.name || 'N/A';
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Nome da Disciplina</Label>
                <Input
                  id="subject-name"
                  placeholder="Ex: Programação I"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-credits">Créditos</Label>
                <Input
                  id="subject-credits"
                  type="number"
                  placeholder="6"
                  value={formData.credits}
                  onChange={e =>
                    setFormData({ ...formData, credits: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-course">Curso</Label>
                <Select
                  value={formData.courseId}
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
                <Label htmlFor="subject-semester">Semestre</Label>
                <Select
                  value={formData.semesterId}
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
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={createSubject.isPending}>
                  {createSubject.isPending ? 'Criando...' : 'Criar Disciplina'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {subjects?.map(subject => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {subject.name}
              </CardTitle>
              <CardDescription>
                {getCourseName(subject.courseId)} • {getSemesterName(subject.semesterId)} •{' '}
                {subject.credits} créditos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(subject)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubjectToDelete(subject.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhuma disciplina cadastrada</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Nova Disciplina" para começar
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Disciplina</DialogTitle>
            <DialogDescription>Atualizar informações da disciplina</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject-name">Nome da Disciplina</Label>
              <Input
                id="edit-subject-name"
                placeholder="Ex: Programação I"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-credits">Créditos</Label>
              <Input
                id="edit-subject-credits"
                type="number"
                placeholder="6"
                value={formData.credits}
                onChange={e =>
                  setFormData({ ...formData, credits: Number.parseInt(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject-course">Curso</Label>
              <Select
                value={formData.courseId}
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
              <Label htmlFor="edit-subject-semester">Semestre</Label>
              <Select
                value={formData.semesterId}
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={updateSubject.isPending}>
                {updateSubject.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A disciplina será permanentemente removida do
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
