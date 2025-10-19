'use client';

import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { useCourse } from '@/hooks/use-courses';
import { useYears } from '@/hooks/use-years';
import { useSemesters } from '@/hooks/use-semesters';
import { useSubjects } from '@/hooks/use-subjects';

export default function AdminCourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: years = [], isLoading: yearsLoading } = useYears();
  const { data: semesters = [] } = useSemesters();
  const { data: subjects = [] } = useSubjects();

  // Filter subjects by course
  const courseSubjects = subjects.filter(subject => subject.courseId === courseId);

  // Group subjects by year and semester
  const yearData = years.map(year => {
    const yearSemesters = semesters.filter(sem => sem.yearId === year.id);
    return {
      ...year,
      semesters: yearSemesters.map(sem => ({
        ...sem,
        subjects: courseSubjects.filter(sub => sub.semesterId === sem.id),
      })),
    };
  });

  if (courseLoading || yearsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Curso não encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/admin/academic">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/admin/academic">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Gestão Acadêmica
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{course.name}</h2>
          <p className="text-muted-foreground">Estrutura acadêmica completa do curso</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Anos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yearData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Semestres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yearData.reduce((total, year) => total + year.semesters.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseSubjects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Créditos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseSubjects.reduce((total, subject) => total + subject.credits, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Years and Semesters Structure */}
      <div className="space-y-6">
        {yearData.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum ano acadêmico cadastrado para este curso
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/academic">Cadastrar Anos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          yearData.map(year => (
            <Card key={year.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{year.name}</CardTitle>
                    <CardDescription>
                      {year.semesters.length} semestre{year.semesters.length !== 1 ? 's' : ''} •{' '}
                      {year.semesters.reduce((total, sem) => total + sem.subjects.length, 0)}{' '}
                      disciplinas
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {year.order}º Ano
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {year.semesters.map(semester => (
                    <div key={semester.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{semester.name}</h3>
                        <Badge variant="outline">{semester.subjects.length} disciplinas</Badge>
                        <Badge variant="secondary">
                          {semester.subjects.reduce((total, sub) => total + sub.credits, 0)}{' '}
                          créditos
                        </Badge>
                      </div>

                      {semester.subjects.length === 0 ? (
                        <p className="text-sm text-muted-foreground ml-7">
                          Nenhuma disciplina cadastrada
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-7">
                          {semester.subjects.map(subject => (
                            <Card key={subject.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-medium text-sm">{subject.name}</h4>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {subject.credits} cr
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
