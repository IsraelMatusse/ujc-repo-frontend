import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { yearService } from "@/lib/api/services/year.service"
import type { YearCreationData } from "@/lib/api/types"

export function useYears() {
  return useQuery({
    queryKey: ["years"],
    queryFn: yearService.getAll,
  })
}

export function useYear(id: string) {
  return useQuery({
    queryKey: ["years", id],
    queryFn: () => yearService.getById(id),
    enabled: !!id,
  })
}

export function useCreateYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: YearCreationData) => yearService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] })
    },
  })
}

export function useUpdateYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<YearCreationData> }) => yearService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] })
    },
  })
}

export function useDeleteYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => yearService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] })
    },
  })
}
