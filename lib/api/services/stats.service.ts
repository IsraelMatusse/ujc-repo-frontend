import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiResponse, GenereicStats } from '../types';

export const statsService = {
  getGenericStats: async (): Promise<GenereicStats> => {
    return (await apiRequest<ApiResponse<GenereicStats>>(API_ENDPOINTS.GET_GENERIC_STATS)).data;
  },
};
