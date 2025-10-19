import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { mockAcademicStructure } from "@/lib/data"

interface AcademicBreadcrumbProps {
  yearId?: string
  semesterId?: string
  subjectId?: string
  customItems?: Array<{ label: string; href?: string }>
}

export function AcademicBreadcrumb({ yearId, semesterId, subjectId, customItems = [] }: AcademicBreadcrumbProps) {
  const year = mockAcademicStructure.find((y) => y.id === yearId)
  const semester = year?.semesters.find((s) => s.id === semesterId)
  const subject = semester?.subjects.find((s) => s.id === subjectId)

  const items = [{ label: "Início", href: "/" }, { label: "Explorar", href: "/browse" }, ...customItems]

  if (year) {
    items.push({ label: year.name, href: `/browse/year/${year.id}` })
  }

  if (semester) {
    items.push({ label: semester.name })
  }

  if (subject) {
    items.push({ label: subject.name, href: `/browse/subject/${subject.id}` })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href && index < items.length - 1 ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
