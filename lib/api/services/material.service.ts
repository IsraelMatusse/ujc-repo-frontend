import { API_ENDPOINTS, apiRequest } from '../config';
import type { ApiResponse, MaterialRequest, MaterialResponse } from '../types';

export const materialService = {
  createMaterial: async (data: MaterialRequest): Promise<MaterialResponse> => {
    const response = await apiRequest<ApiResponse<MaterialResponse>>('/materials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },
  getMaterialsByCourse: async (courseId: string): Promise<MaterialResponse[]> => {
    const response = await apiRequest<ApiResponse<MaterialResponse[]>>(
      `/materials/course/${courseId}`,
    );
    return response.data;
  },

  getAllMeterials: async (): Promise<MaterialResponse[]> => {
    const response = await apiRequest<ApiResponse<MaterialResponse[]>>('/materials');
    return response.data;
  },

  getMaterialsBySubject: async (subjectId: string): Promise<MaterialResponse[]> => {
    const response = await apiRequest<ApiResponse<MaterialResponse[]>>(
      `/materials/subject/${subjectId}`,
    );
    return response.data;
  },

  getMaterialById: async (id: string): Promise<MaterialResponse> => {
    const response = await apiRequest<ApiResponse<MaterialResponse>>(`/materials/${id}`);
    return response.data;
  },

  deleteMaterial: async (id: string): Promise<void> => {
    await apiRequest<void>(`/materials/${id}`, {
      method: 'DELETE',
    });
  },
};
