import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiResponse, SubjectRequestData, SubjectResponse } from '../types';

export const subjectService = {
  getAll: async (): Promise<SubjectResponse[]> => {
    return (await apiRequest<ApiResponse<SubjectResponse[]>>(API_ENDPOINTS.SUBJECTS)).data;
  },

  getById: async (id: string): Promise<SubjectResponse> => {
    return (await apiRequest<ApiResponse<SubjectResponse>>(API_ENDPOINTS.SUBJECT_BY_ID(id))).data;
  },

  getByCourse: async (courseId: string): Promise<SubjectResponse[]> => {
    return (
      await apiRequest<ApiResponse<SubjectResponse[]>>(API_ENDPOINTS.SUBJECTS_BY_COURSE(courseId))
    ).data;
  },

  create: async (data: SubjectRequestData): Promise<SubjectResponse> => {
    return apiRequest<SubjectResponse>(API_ENDPOINTS.SUBJECTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<SubjectRequestData>): Promise<SubjectResponse> => {
    return apiRequest<SubjectResponse>(API_ENDPOINTS.SUBJECT_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.SUBJECT_BY_ID(id), {
      method: 'DELETE',
    });
  },
};
