export interface AcademicYear {
  id: string;
  year: number;
  name: string;
  semesters: Semester[];
}

export interface Semester {
  id: string;
  number: number;
  name: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  materials: Material[];
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'doc' | 'docx' | 'image' | 'video';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  downloads: number;
  tags: string[];
  subjectId: string;
  semesterId: string;
  yearId: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  yearId?: string;
  fullName: string;
  code: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadRequest {
  title: string;
  description?: string;
  file: File;
  subjectId: string;
  tags: string[];
}
