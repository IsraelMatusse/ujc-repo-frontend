"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Calendar, GraduationCap, ChevronRight } from "lucide-react"
import { mockAcademicStructure } from "@/lib/data"

interface AcademicNavigatorProps {
  selectedYear?: string
  selectedSemester?: string
  selectedSubject?: string
  onYearChange?: (yearId: string) => void
  onSemesterChange?: (semesterId: string) => void
  onSubjectChange?: (subjectId: string) => void
  showSubjects?: boolean
  compact?: boolean
}

export function AcademicNavigator({
  selectedYear,
  selectedSemester,
  selectedSubject,
  onYearChange,
  onSemesterChange,
  onSubjectChange,
  showSubjects = true,
  compact = false,
}: AcademicNavigatorProps) {
  const selectedYearData = mockAcademicStructure.find((y) => y.id === selectedYear)
  const selectedSemesterData = selectedYearData?.semesters.find((s) => s.id === selectedSemester)
  const availableSubjects = selectedSemesterData?.subjects || []

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ano</label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent>
              {mockAcademicStructure.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Semestre</label>
          <Select value={selectedSemester} onValueChange={onSemesterChange} disabled={!selectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar semestre" />
            </SelectTrigger>
            <SelectContent>
              {selectedYearData?.semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showSubjects && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Disciplina</label>
            <Select value={selectedSubject} onValueChange={onSubjectChange} disabled={!selectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar disciplina" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Selecionar Ano Acadêmico
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAcademicStructure.map((year) => {
            const totalSubjects = year.semesters.reduce((total, sem) => total + sem.subjects.length, 0)
            const isSelected = selectedYear === year.id

            return (
              <Card
                key={year.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => onYearChange?.(year.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{year.year}º</span>
                    </div>
                    {isSelected && <ChevronRight className="h-5 w-5 text-blue-600" />}
                  </div>
                  <CardTitle className="text-lg">{year.name}</CardTitle>
                  <CardDescription>{totalSubjects} disciplinas</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Semester Selection */}
      {selectedYearData && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Selecionar Semestre - {selectedYearData.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedYearData.semesters.map((semester) => {
              const isSelected = selectedSemester === semester.id

              return (
                <Card
                  key={semester.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => onSemesterChange?.(semester.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{semester.name}</CardTitle>
                          <CardDescription>{semester.subjects.length} disciplinas</CardDescription>
                        </div>
                      </div>
                      {isSelected && <ChevronRight className="h-5 w-5 text-blue-600" />}
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Subject Selection */}
      {showSubjects && selectedSemesterData && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Selecionar Disciplina - {selectedSemesterData.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSubjects.map((subject) => {
              const isSelected = selectedSubject === subject.id

              return (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => onSubjectChange?.(subject.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{subject.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{subject.code}</span>
                          <span>•</span>
                          <span>{subject.credits} créditos</span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary">{subject.materials.length} docs</Badge>
                        {isSelected && <ChevronRight className="h-4 w-4 text-blue-600" />}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
