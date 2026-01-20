#!/bin/bash

# ContosoUniversity React Frontend Setup Script
echo "🚀 Setting up ContosoUniversity React Frontend..."

# Create React project with Vite
echo "📦 Creating React project with Vite..."
npm create vite@latest contoso-university-frontend -- --template react-ts

cd contoso-university-frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install
npm install @tanstack/react-query axios react-router-dom
npm install react-bootstrap bootstrap
npm install -D @types/node

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/common
mkdir -p src/components/students
mkdir -p src/components/departments
mkdir -p src/components/instructors
mkdir -p src/components/courses
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/utils

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env << EOF
VITE_API_BASE_URL=https://localhost:7000/api
EOF

# Create basic API service
echo "🔧 Creating API service..."
cat > src/services/api.ts << 'EOF'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
EOF

# Create type definitions
echo "🔧 Creating type definitions..."
cat > src/services/types.ts << 'EOF'
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

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
EOF

# Create student service
echo "🔧 Creating student service..."
cat > src/services/studentService.ts << 'EOF'
import { apiClient } from './api';
import { Student, CreateStudentDto, UpdateStudentDto, StudentListResponse } from './types';

export const studentService = {
  async getStudents(params: {
    sortOrder?: string;
    searchString?: string;
    pageIndex?: number;
  } = {}): Promise<StudentListResponse> {
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
EOF

# Update main App.tsx
echo "🔧 Creating main App component..."
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple placeholder components
const HomePage = () => (
  <div>
    <h1>Welcome to Contoso University</h1>
    <p>This is the React frontend for Contoso University.</p>
  </div>
);

const StudentsPage = () => (
  <div>
    <h2>Students</h2>
    <p>Student management will be implemented here.</p>
  </div>
);

const DepartmentsPage = () => (
  <div>
    <h2>Departments</h2>
    <p>Department management will be implemented here.</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
              <Link className="navbar-brand" to="/">Contoso University</Link>
              <div className="navbar-nav">
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/students">Students</Link>
                <Link className="nav-link" to="/departments">Departments</Link>
              </div>
            </div>
          </nav>
          
          <main className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
EOF

# Update package.json scripts
echo "🔧 Updating package.json scripts..."
npm pkg set scripts.dev="vite --host"
npm pkg set scripts.build="tsc && vite build"
npm pkg set scripts.preview="vite preview --host"

echo "✅ React frontend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd contoso-university-frontend"
echo "2. npm run dev"
echo ""
echo "🔧 Backend setup:"
echo "1. Make sure your .NET API is running on https://localhost:7000"
echo "2. Test the API endpoints at https://localhost:7000/swagger"
echo ""
echo "🌐 Frontend will be available at: http://localhost:5173"
EOF

chmod +x create-react-frontend.sh