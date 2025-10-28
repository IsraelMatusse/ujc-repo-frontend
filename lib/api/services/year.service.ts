import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiGenericResponse, ApiResponse, YearCreationData, YearResponse } from '../types';

export const yearService = {
  getAll: async (): Promise<YearResponse[]> => {
    return (await apiRequest<ApiResponse<YearResponse[]>>(API_ENDPOINTS.YEARS)).data;
  },

  getById: async (id: string): Promise<YearResponse> => {
    return (await apiRequest<ApiResponse<YearResponse>>(API_ENDPOINTS.YEAR_BY_ID(id))).data;
  },

  create: async (data: YearCreationData): Promise<ApiGenericResponse> => {
    return apiRequest<ApiGenericResponse>(API_ENDPOINTS.YEARS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<YearCreationData>): Promise<ApiGenericResponse> => {
    return apiRequest<ApiGenericResponse>(API_ENDPOINTS.YEAR_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiGenericResponse> => {
    return apiRequest<ApiGenericResponse>(API_ENDPOINTS.YEAR_BY_ID(id), {
      method: 'DELETE',
    });
  },
};
