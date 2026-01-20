// Core entity types
export interface Student {
  id: number;
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
  fullName: string;
}

export interface CreateStudentDto {
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
}

export interface UpdateStudentDto extends CreateStudentDto {
  id: number;
}

export interface StudentListResponse {
  students: Student[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalCount: number;
}

export interface Department {
  departmentID: number;
  name: string;
  budget: number;
  startDate: string;
  instructorID?: number;
  administratorName?: string;
  concurrencyToken?: string;
}

export interface CreateDepartmentDto {
  name: string;
  budget: number;
  startDate: string;
  instructorID?: number;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  departmentID: number;
  concurrencyToken?: string;
}

export interface DepartmentListResponse {
  departments: Department[];
}

export interface Instructor {
  id: number;
  lastName: string;
  firstMidName: string;
  hireDate: string;
  fullName: string;
  officeLocation?: string;
  courses?: Course[];
}

export interface CreateInstructorDto {
  lastName: string;
  firstMidName: string;
  hireDate: string;
  officeLocation?: string;
}

export interface UpdateInstructorDto extends CreateInstructorDto {
  id: number;
}

export interface InstructorListResponse {
  instructors: Instructor[];
}



export interface Course {
  courseID: number;
  title: string;
  credits: number;
  departmentID: number;
  departmentName?: string;
  instructors?: InstructorSummary[];
  enrollmentCount?: number;
}

export interface CreateCourseDto {
  courseID: number;
  title: string;
  credits: number;
  departmentID: number;
  instructorIDs?: number[];
}

export interface UpdateCourseDto extends CreateCourseDto {
}

export interface CourseListResponse {
  courses: Course[];
}

export interface InstructorSummary {
  id: number;
  fullName: string;
}

export interface Enrollment {
  enrollmentID: number;
  courseID: number;
  studentID: number;
  grade?: Grade;
  course?: Course;
  student?: Student;
}

export enum Grade {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
  F = 4
}

// API response types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  pageIndex?: number;
  sortOrder?: string;
  searchString?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
}