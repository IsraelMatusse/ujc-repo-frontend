'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yearService } from '@/lib/api/services/year.service';
import type { YearCreationData } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

export function useYears() {
  return useQuery({
    queryKey: ['years'],
    queryFn: yearService.getAll,
  });
}

export function useYear(id: string) {
  return useQuery({
    queryKey: ['years', id],
    queryFn: () => yearService.getById(id),
    enabled: !!id,
  });
}

export function useCreateYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: YearCreationData) => yearService.create(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
      toast({
        title: 'Sucesso',
        description: response.message || 'Ano criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar ano.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<YearCreationData> }) =>
      yearService.update(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
      toast({
        title: 'Sucesso',
        description: response.message || 'Ano atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar ano.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => yearService.delete(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
      toast({
        title: 'Sucesso',
        description: response.message || 'Ano deletado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao deletar ano.',
        variant: 'destructive',
      });
    },
  });
}
