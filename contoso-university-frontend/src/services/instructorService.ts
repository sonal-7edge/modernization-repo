import { apiClient } from './api';
import type { Instructor, CreateInstructorDto, UpdateInstructorDto, InstructorListResponse } from '../types/index.js';

export const instructorService = {
  async getInstructors(): Promise<InstructorListResponse> {
    const response = await apiClient.get('/instructors');
    return response.data;
  },

  async getInstructor(id: number): Promise<Instructor> {
    const response = await apiClient.get(`/instructors/${id}`);
    return response.data;
  },

  async createInstructor(instructor: CreateInstructorDto): Promise<Instructor> {
    const response = await apiClient.post('/instructors', instructor);
    return response.data;
  },

  async updateInstructor(id: number, instructor: UpdateInstructorDto): Promise<void> {
    await apiClient.put(`/instructors/${id}`, instructor);
  },

  async deleteInstructor(id: number): Promise<void> {
    await apiClient.delete(`/instructors/${id}`);
  },
};