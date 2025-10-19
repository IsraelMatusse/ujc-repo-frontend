'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, GraduationCap, Layers } from 'lucide-react';
import { YearsManagement } from '@/components/admin/years-managment';
import { SemestersManagement } from '@/components/admin/semesters-managment';
import { CoursesManagement } from '@/components/admin/courses-management';
import { SubjectsManagement } from '@/components/admin/subjects-management';
import { useYears } from '@/hooks/use-years';
import { useSemesters } from '@/hooks/use-semesters';
import { useCourses } from '@/hooks/use-courses';
import { useSubjects } from '@/hooks/use-subjects';

export default function AcademicManagement() {
  const { data: years } = useYears();
  const { data: semesters } = useSemesters();
  const { data: courses } = useCourses();
  const { data: subjects } = useSubjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estrutura Acadêmica</h2>
        <p className="text-muted-foreground">Gerir anos, semestres, cursos e disciplinas</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Anos Acadêmicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{years?.length || 0}</div>
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
            <div className="text-2xl font-bold">{semesters?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
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
            <div className="text-2xl font-bold">{subjects?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="years" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="years">Anos</TabsTrigger>
          <TabsTrigger value="semesters">Semestres</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="years">
          <YearsManagement />
        </TabsContent>

        <TabsContent value="semesters">
          <SemestersManagement />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesManagement />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
