import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Users, Download, TrendingUp } from "lucide-react"
import { mockAcademicStructure } from "@/lib/data"

interface AcademicStatsProps {
  yearId?: string
  semesterId?: string
  subjectId?: string
}

export function AcademicStats({ yearId, semesterId, subjectId }: AcademicStatsProps) {
  // Calculate stats based on selection
  let stats = {
    subjects: 0,
    materials: 0,
    students: 0,
    downloads: 0,
  }

  if (subjectId) {
    // Stats for specific subject
    const subject = mockAcademicStructure
      .flatMap((y) => y.semesters.flatMap((s) => s.subjects))
      .find((s) => s.id === subjectId)

    if (subject) {
      stats = {
        subjects: 1,
        materials: subject.materials.length,
        students: Math.floor(Math.random() * 100) + 50,
        downloads: Math.floor(Math.random() * 500) + 100,
      }
    }
  } else if (semesterId) {
    // Stats for specific semester
    const semester = mockAcademicStructure.flatMap((y) => y.semesters).find((s) => s.id === semesterId)

    if (semester) {
      stats = {
        subjects: semester.subjects.length,
        materials: semester.subjects.reduce((total, s) => total + s.materials.length, 0),
        students: Math.floor(Math.random() * 200) + 100,
        downloads: Math.floor(Math.random() * 1000) + 500,
      }
    }
  } else if (yearId) {
    // Stats for specific year
    const year = mockAcademicStructure.find((y) => y.id === yearId)

    if (year) {
      stats = {
        subjects: year.semesters.reduce((total, s) => total + s.subjects.length, 0),
        materials: year.semesters.reduce(
          (total, s) => total + s.subjects.reduce((subTotal, sub) => subTotal + sub.materials.length, 0),
          0,
        ),
        students: Math.floor(Math.random() * 300) + 200,
        downloads: Math.floor(Math.random() * 2000) + 1000,
      }
    }
  } else {
    // Overall stats
    stats = {
      subjects: mockAcademicStructure.reduce(
        (total, y) => total + y.semesters.reduce((semTotal, s) => semTotal + s.subjects.length, 0),
        0,
      ),
      materials: mockAcademicStructure.reduce(
        (total, y) =>
          total +
          y.semesters.reduce(
            (semTotal, s) => semTotal + s.subjects.reduce((subTotal, sub) => subTotal + sub.materials.length, 0),
            0,
          ),
        0,
      ),
      students: 573,
      downloads: 1234,
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.subjects}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Disponíveis
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Material</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.materials}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Documentos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.students}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Ativos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.downloads}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
