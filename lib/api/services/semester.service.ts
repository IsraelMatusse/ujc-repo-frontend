import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiResponse, SemesterCreationData, SemesterResponse } from '../types';

export const semesterService = {
  getAll: async (): Promise<SemesterResponse[]> => {
    return (await apiRequest<ApiResponse<SemesterResponse[]>>(API_ENDPOINTS.SEMESTERS)).data;
  },

  getById: async (id: string): Promise<SemesterResponse> => {
    return (await apiRequest<ApiResponse<SemesterResponse>>(API_ENDPOINTS.SEMESTER_BY_ID(id))).data;
  },

  create: async (data: SemesterCreationData): Promise<SemesterResponse> => {
    return apiRequest<SemesterResponse>(API_ENDPOINTS.SEMESTERS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<SemesterCreationData>): Promise<SemesterResponse> => {
    return apiRequest<SemesterResponse>(API_ENDPOINTS.SEMESTER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.SEMESTER_BY_ID(id), {
      method: 'DELETE',
    });
  },
};
