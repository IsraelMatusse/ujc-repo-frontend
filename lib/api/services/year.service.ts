import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiResponse, YearCreationData, YearResponse } from '../types';

export const yearService = {
  getAll: async (): Promise<YearResponse[]> => {
    return (await apiRequest<ApiResponse<YearResponse[]>>(API_ENDPOINTS.YEARS)).data;
  },

  getById: async (id: string): Promise<YearResponse> => {
    return (await apiRequest<ApiResponse<YearResponse>>(API_ENDPOINTS.YEAR_BY_ID(id))).data;
  },

  create: async (data: YearCreationData): Promise<YearResponse> => {
    return apiRequest<YearResponse>(API_ENDPOINTS.YEARS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<YearCreationData>): Promise<YearResponse> => {
    return apiRequest<YearResponse>(API_ENDPOINTS.YEAR_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.YEAR_BY_ID(id), {
      method: 'DELETE',
    });
  },
};
