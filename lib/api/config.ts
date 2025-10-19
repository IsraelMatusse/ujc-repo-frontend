export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Years
  YEARS: "/years",
  YEAR_BY_ID: (id: string) => `/years/${id}`,

  // Semesters
  SEMESTERS: "/semesters",
  SEMESTER_BY_ID: (id: string) => `/semesters/${id}`,

  // Courses
  COURSES: "/courses",
  COURSE_BY_ID: (id: string) => `/courses/${id}`,

  // Subjects
  SUBJECTS: "/subjects",
  SUBJECT_BY_ID: (id: string) => `/subjects/${id}`,
  SUBJECTS_BY_COURSE: (courseId: string) => `/subjects/course/${courseId}`,

  // Materials
  MATERIALS: "/materials",
  MATERIAL_BY_ID: (id: string) => `/materials/${id}`,
  MATERIALS_BY_SUBJECT: (subjectId: string) => `/materials/subject/${subjectId}`,
  UPLOAD_MATERIAL: "/materials/upload",
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Get token from localStorage if available
  const token = typeof window !== "undefined" ? localStorage.getItem("ujc-token") : null
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
