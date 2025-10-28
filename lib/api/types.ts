export interface YearCreationData {
  name: string;
  order: number;
}

export interface YearResponse {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SemesterCreationData {
  name: string;
  yearId: string;
}

export interface SemesterResponse {
  id: string;
  name: string;
  yearId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRequest {
  name: string;
}

export interface CourseResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectRequestData {
  name: string;
  credits: number;
  courseId: string;
  semesterId: string;
}

export interface SubjectResponse {
  id: string;
  name: string;
  credits: number;
  courseId: string;
  semesterId: string;
  course?: CourseResponse;
  semester?: SemesterResponse;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequest {
  fileId: string;
  subjectId: string;
  title: string;
  description: string;
  type: MaterialType;
  author: string;
}

export interface FileUploadResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    designation: string;
    type: string;
    path: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export enum MaterialType {
  FICHA = 'FICHA',
  LIVRO = 'LIVRO',
  EBOOK = 'EBOOK',
  ARTIGO = 'ARTIGO',
  VIDEO_AULA = 'VIDEO_AULA',
  SLIDES = 'SLIDES',
  TESTE = 'TESTE',
  EXERCICIOS = 'EXERCICIOS',
  IMAGEM = 'IMAGEM',
  OUTRO = 'OUTRO',
}
export interface MaterialResponse {
  id: string;
  file: {
    id: string;
    designation: string;
    type: string;
    path: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  author: string;
  title: string;
  description: string;
  type: MaterialType;
  createdAt: string;
  status: boolean;
  subject: string;
}

export interface YearWithSemester {
  name: string;
  order: number;
  code: string;
  semesters: SemesterResponse[];
}

export interface CourseDetails {
  id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
  subjects: SubjectResponse[];
  years: YearWithSemester[];
  material: MaterialResponse[];
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  statusCode: number;
  token: string;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    role: 'USER' | 'ADMIN';
    code: string;
  };
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      status: boolean;
      createdAt: string;
      updatedAt: string;
      role: 'USER' | 'ADMIN';
      code: string;
    };
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  code: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiGenericResponse {
  statusCode: number;
  message: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
export interface UserStatsResponse {
  totalUploads: number;
  totalDownloads: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}
export interface GenereicStats {
  users: number;
  materials: number;
  courses: number;
  subjects: number;
}

