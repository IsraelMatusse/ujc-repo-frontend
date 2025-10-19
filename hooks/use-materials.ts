import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '@/lib/api/services/material.service';
import { fileService } from '@/lib/api/services/file.service';
import type { MaterialRequest } from '@/lib/api/types';

export function useMaterialsBySubject(subjectId: string) {
  return useQuery({
    queryKey: ['materials', 'subject', subjectId],
    queryFn: () => materialService.getMaterialsBySubject(subjectId),
    enabled: !!subjectId,
  });
}

export function useMaterialsByCourse(courseId: string) {
  return useQuery({
    queryKey: ['materials', 'course', courseId],
    queryFn: () => materialService.getMaterialsByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useAllMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: () => materialService.getAllMeterials(),
    enabled: true,
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: () => materialService.getMaterialById(id),
    enabled: !!id,
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => fileService.uploadFile(file),
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialRequest) => materialService.createMaterial(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials', 'subject', variables.subjectId] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}
