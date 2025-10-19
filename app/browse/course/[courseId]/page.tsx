'use client';

import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, BookOpen, FileText, Download, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { useCourseDetails } from '@/hooks/use-courses';
import { MaterialType } from '@/lib/api/types';

const materialTypeLabels: Record<MaterialType, string> = {
  [MaterialType.FICHA]: 'Ficha',
  [MaterialType.LIVRO]: 'Livro',
  [MaterialType.EBOOK]: 'E-book',
  [MaterialType.ARTIGO]: 'Artigo',
  [MaterialType.VIDEO_AULA]: 'Vídeo Aula',
  [MaterialType.SLIDES]: 'Slides',
  [MaterialType.TESTE]: 'Teste',
  [MaterialType.EXERCICIOS]: 'Exercícios',
  [MaterialType.IMAGEM]: 'Imagem',
  [MaterialType.OUTRO]: 'Outro',
};

const materialTypeColors: Record<MaterialType, string> = {
  [MaterialType.FICHA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [MaterialType.LIVRO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [MaterialType.EBOOK]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [MaterialType.ARTIGO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [MaterialType.VIDEO_AULA]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [MaterialType.SLIDES]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [MaterialType.TESTE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [MaterialType.EXERCICIOS]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  [MaterialType.IMAGEM]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [MaterialType.OUTRO]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { data: courseDetails, isLoading } = useCourseDetails(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando detalhes do curso...</p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Curso não encontrado</p>
          <Button asChild>
            <Link href="/browse">Voltar para Cursos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {courseDetails.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Código: {courseDetails.code}
                </span>
                <Badge variant={courseDetails.status ? 'default' : 'secondary'}>
                  {courseDetails.status ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de Material</div>
              <div className="text-3xl font-bold text-blue-600">
                {courseDetails.material.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Estrutura Acadêmica</TabsTrigger>
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
            <TabsTrigger value="materials">Material ({courseDetails.material.length})</TabsTrigger>
          </TabsList>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            {courseDetails.years.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhum ano acadêmico cadastrado para este curso
                  </p>
                </CardContent>
              </Card>
            ) : (
              courseDetails.years.map(year => (
                <Card key={year.code}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{year.name}</CardTitle>
                        <CardDescription>
                          {year.semesters.length} semestre{year.semesters.length !== 1 ? 's' : ''} •
                          Código: {year.code}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {year.order}º Ano
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {year.semesters.map(semester => {
                        const semesterSubjects = courseDetails.subjects.filter(
                          s => s.semesterId === semester.id,
                        );
                        const semesterMaterials = courseDetails.material.filter(
                          m => m.year === year.name && m.semester === semester.name,
                        );

                        return (
                          <div key={semester.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {semester.name}
                                </h3>
                                <Badge variant="outline">
                                  {semesterSubjects.length} disciplinas
                                </Badge>
                                <Badge variant="secondary">
                                  {semesterMaterials.length} materiais
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-500">Código: {semester.code}</span>
                            </div>

                            {semesterSubjects.length === 0 ? (
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                                Nenhuma disciplina cadastrada
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-7">
                                {semesterSubjects.map(subject => {
                                  const subjectMaterials = courseDetails.material.filter(
                                    m => m.subject === subject.name,
                                  );
                                  return (
                                    <Card
                                      key={subject.id}
                                      className="hover:shadow-md transition-shadow"
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                            <h4 className="font-medium text-sm">{subject.name}</h4>
                                          </div>
                                          <Badge variant="secondary" className="text-xs">
                                            {subject.credits} cr
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                                          <FileText className="h-3 w-3" />
                                          <span>{subjectMaterials.length} materiais</span>
                                        </div>
                                        <Button asChild size="sm" className="w-full">
                                          <Link href={`/browse/subject/${subject.id}`}>
                                            Ver Material
                                          </Link>
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            {courseDetails.subjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhuma disciplina cadastrada para este curso
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseDetails.subjects.map(subject => {
                  const subjectMaterials = courseDetails.material.filter(
                    m => m.subject === subject.name,
                  );
                  return (
                    <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <Badge variant="secondary">{subject.credits} créditos</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {subjectMaterials.length} material
                          {subjectMaterials.length !== 1 ? 'is' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link href={`/browse/subject/${subject.id}`}>Ver Material</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials">
            {courseDetails.material.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhum material disponível para este curso
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courseDetails.material.map(material => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                              {material.title || material.file.designation}
                            </h3>
                            <Badge className={materialTypeColors[material.type]}>
                              {materialTypeLabels[material.type]}
                            </Badge>
                          </div>

                          {material.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {material.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {material.subject}
                            </span>
                            {material.semester && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {material.semester}
                              </span>
                            )}
                            {material.year && <span>• {material.year}</span>}
                            {material.author && (
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {material.author}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {material.createdAt}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() =>
                            handleDownload(material.file.path, material.file.designation)
                          }
                          className="flex-shrink-0"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
