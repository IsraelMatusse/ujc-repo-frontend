import { apiRequest } from '../config';
import { API_ENDPOINTS } from '../config';
import type { ApiResponse, User, MaterialResponse } from '../types';

export interface AdminStats {
  totalMaterials: number;
  totalUsers: number;
  totalDownloads: number;
  totalUploads: number;
  pendingUploads: number;
  materialsGrowth: number;
  usersGrowth: number;
  downloadsGrowth: number;
  uploadsGrowth: number;
}

export interface UploadHistory {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  file: {
    id: string;
    designation: string;
    type: string;
    path: string;
  };
  material: {
    id: string;
    title: string;
    type: string;
    subject: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const adminService = {
  // Get admin statistics
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    return apiRequest<ApiResponse<AdminStats>>(API_ENDPOINTS.ADMIN_STATS);
  },

  // Get upload history
  getUploads: async (): Promise<ApiResponse<UploadHistory[]>> => {
    return apiRequest<ApiResponse<UploadHistory[]>>(API_ENDPOINTS.ADMIN_UPLOADS);
  },

  // Get all users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiRequest<ApiResponse<User[]>>(API_ENDPOINTS.USERS);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>(API_ENDPOINTS.USER_BY_ID(id));
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>(API_ENDPOINTS.USER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<ApiResponse<void>>(API_ENDPOINTS.USER_BY_ID(id), {
      method: 'DELETE',
    });
  },

  // Delete material
  deleteMaterial: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<ApiResponse<void>>(API_ENDPOINTS.MATERIAL_BY_ID(id), {
      method: 'DELETE',
    });
  },

  // Update material
  updateMaterial: async (
    id: string,
    data: Partial<MaterialResponse>,
  ): Promise<ApiResponse<MaterialResponse>> => {
    return apiRequest<ApiResponse<MaterialResponse>>(API_ENDPOINTS.MATERIAL_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
