import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import { mockAcademicStructure } from "@/lib/data"
import { AcademicBreadcrumb } from "@/components/academic/academic-breadcrumb"
import { AcademicStats } from "@/components/academic/academic-stats"
import Link from "next/link"
import { notFound } from "next/navigation"

interface YearPageProps {
  params: {
    yearId: string
  }
}

export default function YearPage({ params }: YearPageProps) {
  const year = mockAcademicStructure.find((y) => y.id === params.yearId)

  if (!year) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <AcademicBreadcrumb yearId={params.yearId} />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-lg">
              <span className="text-3xl font-bold text-white">{year.year}º</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{year.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">Engenharia de Tecnologias e Sistemas de Informação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Year Stats */}
        <div className="mb-8">
          <AcademicStats yearId={params.yearId} />
        </div>

        {/* Semesters */}
        <div className="space-y-8">
          {year.semesters.map((semester) => (
            <section key={semester.id}>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{semester.name}</h2>
                <Badge variant="secondary">{semester.subjects.length} disciplinas</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semester.subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span>{subject.code}</span>
                            <span>•</span>
                            <span>{subject.credits} créditos</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{subject.materials.length} docs</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Material disponível:</span>
                          <span>{subject.materials.length} documentos</span>
                        </div>

                        {subject.materials.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tipos de material:</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-xs">
                                Exercícios
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Fichas
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Testes
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Nenhum material disponível ainda</p>
                        )}

                        <Button
                          asChild
                          className="w-full"
                          variant={subject.materials.length > 0 ? "default" : "outline"}
                        >
                          <Link href={`/browse/subject/${subject.id}`}>
                            {subject.materials.length > 0 ? "Ver Material" : "Contribuir"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
