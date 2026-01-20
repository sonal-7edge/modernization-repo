import { apiClient } from './api';
import type { Course, CreateCourseDto, UpdateCourseDto, CourseListResponse, InstructorSummary } from '../types/index.js';

export const courseService = {
  async getCourses(): Promise<CourseListResponse> {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  async getCourse(id: number): Promise<Course> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  async createCourse(course: CreateCourseDto): Promise<Course> {
    const response = await apiClient.post('/courses', course);
    return response.data;
  },

  async updateCourse(id: number, course: UpdateCourseDto): Promise<void> {
    await apiClient.put(`/courses/${id}`, course);
  },

  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  },

  async getInstructorsForDropdown(): Promise<InstructorSummary[]> {
    const response = await apiClient.get('/courses/instructors');
    return response.data;
  },
};