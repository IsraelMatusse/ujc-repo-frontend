import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subjectService } from "@/lib/api/services/subject.service"
import type { SubjectRequestData } from "@/lib/api/types"

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: subjectService.getAll,
  })
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  })
}

export function useSubjectsByCourse(courseId: string) {
  return useQuery({
    queryKey: ["subjects", "course", courseId],
    queryFn: () => subjectService.getByCourse(courseId),
    enabled: !!courseId,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubjectRequestData) => subjectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubjectRequestData> }) => subjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
    },
  })
}
