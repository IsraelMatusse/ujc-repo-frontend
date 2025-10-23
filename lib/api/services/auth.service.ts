import { apiRequest, API_ENDPOINTS } from "../config"
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  RegisterResponse,
} from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
