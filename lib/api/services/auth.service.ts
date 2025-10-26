import { apiRequest, API_ENDPOINTS } from "../config"
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
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

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<any>> => {
    return apiRequest<ApiResponse<any>>(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<any>> => {
    return apiRequest<ApiResponse<any>>(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<any>> => {
    return apiRequest<ApiResponse<any>>(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
