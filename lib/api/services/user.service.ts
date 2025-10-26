import { apiRequest, API_ENDPOINTS } from '../config';
import type {
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UserStatsResponse,
  ApiResponse,
} from '../types';

export const userService = {
  updateEmail: async (data: UpdateEmailRequest): Promise<ApiResponse<any>> => {
    return apiRequest<ApiResponse<any>>(API_ENDPOINTS.UPDATE_EMAIL, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<ApiResponse<any>> => {
    return apiRequest<ApiResponse<any>>(API_ENDPOINTS.UPDATE_PASSWORD, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getUserStats: async (): Promise<ApiResponse<UserStatsResponse>> => {
    return apiRequest<ApiResponse<UserStatsResponse>>(API_ENDPOINTS.USER_STATS, {
      method: 'GET',
    });
  },
};
