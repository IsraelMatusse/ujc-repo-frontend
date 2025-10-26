'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/services/user.service';
import type { UpdateEmailRequest, UpdatePasswordRequest } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await userService.getUserStats();
      return response.data;
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => userService.updateEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'Email atualizado',
        description: 'Seu email foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar email',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) => userService.updatePassword(data),
    onSuccess: () => {
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
