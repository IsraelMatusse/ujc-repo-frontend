import { statsService } from '@/lib/api/services/stats.service';
import { useQuery } from '@tanstack/react-query';

export function useStats() {
  return useQuery({
    queryKey: ['generic-stats'],
    queryFn: statsService.getGenericStats,
  });
}
