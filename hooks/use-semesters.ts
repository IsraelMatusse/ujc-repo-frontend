import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { semesterService } from "@/lib/api/services/semester.service"
import type { SemesterCreationData } from "@/lib/api/types"

export function useSemesters() {
  return useQuery({
    queryKey: ["semesters"],
    queryFn: semesterService.getAll,
  })
}

export function useSemester(id: string) {
  return useQuery({
    queryKey: ["semesters", id],
    queryFn: () => semesterService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SemesterCreationData) => semesterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] })
    },
  })
}

export function useUpdateSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SemesterCreationData> }) => semesterService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] })
    },
  })
}

export function useDeleteSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => semesterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] })
    },
  })
}
