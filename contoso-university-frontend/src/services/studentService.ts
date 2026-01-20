import { apiClient } from './api';
import type { Student, CreateStudentDto, UpdateStudentDto, StudentListResponse, PaginationParams } from '../types/index.js';

export const studentService = {
  async getStudents(params: PaginationParams = {}): Promise<StudentListResponse> {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  async getStudent(id: number): Promise<Student> {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  async createStudent(student: CreateStudentDto): Promise<Student> {
    const response = await apiClient.post('/students', student);
    return response.data;
  },

  async updateStudent(id: number, student: UpdateStudentDto): Promise<void> {
    await apiClient.put(`/students/${id}`, student);
  },

  async deleteStudent(id: number): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },
};