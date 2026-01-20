import { apiClient } from './api';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto, DepartmentListResponse } from '../types/index.js';

export const departmentService = {
  async getDepartments(): Promise<DepartmentListResponse> {
    const response = await apiClient.get('/departments');
    return response.data;
  },

  async getDepartment(id: number): Promise<Department> {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(department: CreateDepartmentDto): Promise<Department> {
    const response = await apiClient.post('/departments', department);
    return response.data;
  },

  async updateDepartment(id: number, department: UpdateDepartmentDto): Promise<void> {
    await apiClient.put(`/departments/${id}`, department);
  },

  async deleteDepartment(id: number): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  },

  async getInstructorsForDropdown(): Promise<Array<{ id: number; fullName: string }>> {
    const response = await apiClient.get('/departments/instructors');
    return response.data;
  },
};