import { apiRequest, API_ENDPOINTS } from '../config';
import type { ApiResponse, CourseDetails, CourseRequest, CourseResponse } from '../types';

export const courseService = {
  getAll: async (): Promise<CourseResponse[]> => {
    return (await apiRequest<ApiResponse<CourseResponse[]>>(API_ENDPOINTS.COURSES)).data;
  },
  getById: async (id: string): Promise<CourseResponse> => {
    return (await apiRequest<ApiResponse<CourseResponse>>(API_ENDPOINTS.COURSE_BY_ID(id))).data;
  },

  create: async (data: CourseRequest): Promise<CourseResponse> => {
    return apiRequest<ApiResponse<CourseResponse>>(API_ENDPOINTS.COURSES, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(response => response.data);
  },

  getDetails: async (id: string): Promise<CourseDetails> => {
    return (await apiRequest<ApiResponse<CourseDetails>>(API_ENDPOINTS.COURSE_BY_ID(id))).data;
  },

  update: async (id: string, data: Partial<CourseRequest>): Promise<CourseResponse> => {
    return apiRequest<ApiResponse<CourseResponse>>(API_ENDPOINTS.COURSE_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(response => response.data);
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.COURSE_BY_ID(id), {
      method: 'DELETE',
    });
  },
};
