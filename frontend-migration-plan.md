# ContosoUniversity Frontend Migration Plan: Razor Pages to React

**Date:** January 20, 2026  
**Project:** ContosoUniversity Frontend Migration  
**Migration Type:** Razor Pages → React + ASP.NET Core Web API  

## Executive Summary

This document outlines the complete migration strategy for converting the ContosoUniversity frontend from Razor Pages to a modern React application while maintaining the .NET 8 backend as a Web API.

## Current State Analysis

### Frontend Components Identified
- **Pages:** Students, Departments, Instructors, Courses, About, Privacy
- **Features:** CRUD operations, Search, Sorting, Pagination, Form validation
- **UI Elements:** Tables, Forms, Navigation, Error handling
- **Static Assets:** CSS, JavaScript, Bootstrap styling

### Backend Logic to Preserve
- Entity Framework Core with PostgreSQL
- Data models and relationships
- Business logic in PageModel classes
- Authentication and authorization
- Database seeding and migrations

---

## Migration Strategy

### Phase 1: Backend API Preparation
1. Convert PageModel classes to API Controllers
2. Create DTOs for API contracts
3. Implement proper error handling and validation
4. Configure CORS for React development
5. Add API documentation (Swagger)

### Phase 2: React Application Setup
1. Create React project with Vite
2. Set up routing and navigation
3. Implement API client layer
4. Create reusable components
5. Implement state management

### Phase 3: Feature Migration
1. Students management (CRUD + Search + Pagination)
2. Departments management
3. Instructors management
4. Courses management
5. About and informational pages

### Phase 4: Testing and Optimization
1. End-to-end testing
2. Performance optimization
3. Error handling refinement
4. Production build configuration

---

## Detailed Implementation Plan

### Step 1: Backend API Transformation

#### 1.1 Project Structure Changes

**Remove Frontend Dependencies:**
```xml
<!-- Remove from ContosoUniversity.csproj -->
<PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" />
<PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" />
```

**Add API Dependencies:**
```xml
<!-- Add to ContosoUniversity.csproj -->
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

#### 1.2 Program.cs Configuration

**New Configuration:**
```csharp
using ContosoUniversity.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<SchoolContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SchoolContext")));

// CORS configuration for React development
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDevelopment", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("ReactDevelopment");
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SchoolContext>();
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}

app.Run();
```

#### 1.3 Create DTOs

**Student DTOs:**
```csharp
// DTOs/StudentDto.cs
namespace ContosoUniversity.DTOs;

public class StudentDto
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public string FullName => $"{FirstMidName} {LastName}";
}

public class CreateStudentDto
{
    [Required]
    [StringLength(50)]
    public string LastName { get; set; }
    
    [Required]
    [StringLength(50)]
    public string FirstMidName { get; set; }
    
    [Required]
    public DateTime EnrollmentDate { get; set; }
}

public class UpdateStudentDto : CreateStudentDto
{
    public int ID { get; set; }
}

public class StudentListDto
{
    public List<StudentDto> Students { get; set; }
    public int PageIndex { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
    public int TotalCount { get; set; }
}
```

**Department DTOs:**
```csharp
// DTOs/DepartmentDto.cs
namespace ContosoUniversity.DTOs;

public class DepartmentDto
{
    public int DepartmentID { get; set; }
    public string Name { get; set; }
    public decimal Budget { get; set; }
    public DateTime StartDate { get; set; }
    public int? InstructorID { get; set; }
    public string AdministratorName { get; set; }
    public string ConcurrencyToken { get; set; }
}

public class CreateDepartmentDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Name { get; set; }
    
    [Required]
    public decimal Budget { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    public int? InstructorID { get; set; }
}
```

#### 1.4 Create API Controllers

**Students API Controller:**
```csharp
// Controllers/StudentsController.cs
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContosoUniversity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly SchoolContext _context;
    private readonly IConfiguration _configuration;

    public StudentsController(SchoolContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<StudentListDto>> GetStudents(
        string? sortOrder = null,
        string? searchString = null,
        int pageIndex = 1)
    {
        var studentsQuery = _context.Students.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrEmpty(searchString))
        {
            studentsQuery = studentsQuery.Where(s => 
                s.LastName.Contains(searchString) || 
                s.FirstMidName.Contains(searchString));
        }

        // Apply sorting
        studentsQuery = sortOrder switch
        {
            "name_desc" => studentsQuery.OrderByDescending(s => s.LastName),
            "Date" => studentsQuery.OrderBy(s => s.EnrollmentDate),
            "date_desc" => studentsQuery.OrderByDescending(s => s.EnrollmentDate),
            _ => studentsQuery.OrderBy(s => s.LastName)
        };

        var pageSize = _configuration.GetValue("PageSize", 4);
        var paginatedList = await PaginatedList<Student>.CreateAsync(
            studentsQuery.AsNoTracking(), pageIndex, pageSize);

        var result = new StudentListDto
        {
            Students = paginatedList.Select(s => new StudentDto
            {
                ID = s.ID,
                LastName = s.LastName,
                FirstMidName = s.FirstMidName,
                EnrollmentDate = s.EnrollmentDate
            }).ToList(),
            PageIndex = paginatedList.PageIndex,
            TotalPages = paginatedList.TotalPages,
            HasPreviousPage = paginatedList.HasPreviousPage,
            HasNextPage = paginatedList.HasNextPage,
            TotalCount = paginatedList.TotalCount
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        
        if (student == null)
            return NotFound();

        var studentDto = new StudentDto
        {
            ID = student.ID,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate
        };

        return Ok(studentDto);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = new Student
        {
            LastName = createDto.LastName,
            FirstMidName = createDto.FirstMidName,
            EnrollmentDate = DateTime.SpecifyKind(createDto.EnrollmentDate, DateTimeKind.Utc)
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var studentDto = new StudentDto
        {
            ID = student.ID,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate
        };

        return CreatedAtAction(nameof(GetStudent), new { id = student.ID }, studentDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto updateDto)
    {
        if (id != updateDto.ID)
            return BadRequest();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound();

        student.LastName = updateDto.LastName;
        student.FirstMidName = updateDto.FirstMidName;
        student.EnrollmentDate = DateTime.SpecifyKind(updateDto.EnrollmentDate, DateTimeKind.Utc);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StudentExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound();

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StudentExists(int id)
    {
        return _context.Students.Any(e => e.ID == id);
    }
}
```

### Step 2: React Application Setup

#### 2.1 Create React Project

**Commands:**
```bash
# Create React project with Vite
npm create vite@latest contoso-university-frontend -- --template react-ts
cd contoso-university-frontend

# Install dependencies
npm install
npm install @tanstack/react-query axios react-router-dom
npm install -D @types/node

# Install UI library (optional)
npm install @mui/material @emotion/react @emotion/styled
# OR
npm install react-bootstrap bootstrap
```

#### 2.2 Project Structure

```
contoso-university-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── students/
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   ├── StudentDetails.tsx
│   │   │   └── StudentSearch.tsx
│   │   ├── departments/
│   │   ├── instructors/
│   │   └── courses/
│   ├── services/
│   │   ├── api.ts
│   │   ├── studentService.ts
│   │   ├── departmentService.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useStudents.ts
│   │   ├── useDepartments.ts
│   │   └── usePagination.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── StudentsPage.tsx
│   │   ├── DepartmentsPage.tsx
│   │   └── AboutPage.tsx
│   ├── utils/
│   │   ├── dateHelpers.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

#### 2.3 API Service Layer

**Base API Configuration:**
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens (future use)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Type Definitions:**
```typescript
// src/services/types.ts
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
```

**Student Service:**
```typescript
// src/services/studentService.ts
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
```

#### 2.4 React Components

**Student List Component:**
```typescript
// src/components/students/StudentList.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { Student } from '../../services/types';
import StudentSearch from './StudentSearch';
import LoadingSpinner from '../common/LoadingSpinner';

interface StudentListProps {
  onEdit: (student: Student) => void;
  onView: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onEdit, onView }) => {
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['students', { sortOrder, searchString, pageIndex }],
    queryFn: () => studentService.getStudents({ sortOrder, searchString, pageIndex }),
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleSort = (field: string) => {
    const newSortOrder = sortOrder === field ? `${field}_desc` : field;
    setSortOrder(newSortOrder);
    setPageIndex(1);
  };

  const handleSearch = (search: string) => {
    setSearchString(search);
    setPageIndex(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">Error loading students</div>;
  if (!data) return null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Students</h2>
        <button className="btn btn-primary" onClick={() => onEdit({} as Student)}>
          Create New
        </button>
      </div>

      <StudentSearch onSearch={handleSearch} currentFilter={searchString} />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => handleSort('name')}
              >
                Last Name {sortOrder.includes('name') && (sortOrder.includes('desc') ? '↓' : '↑')}
              </button>
            </th>
            <th>First Name</th>
            <th>
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => handleSort('Date')}
              >
                Enrollment Date {sortOrder.includes('Date') && (sortOrder.includes('desc') ? '↓' : '↑')}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map((student) => (
            <tr key={student.id}>
              <td>{student.lastName}</td>
              <td>{student.firstMidName}</td>
              <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-outline-info me-1"
                  onClick={() => onView(student)}
                >
                  Details
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(student.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-primary"
          disabled={!data.hasPreviousPage}
          onClick={() => setPageIndex(pageIndex - 1)}
        >
          Previous
        </button>
        <span>Page {data.pageIndex} of {data.totalPages}</span>
        <button 
          className="btn btn-primary"
          disabled={!data.hasNextPage}
          onClick={() => setPageIndex(pageIndex + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentList;
```

**Student Form Component:**
```typescript
// src/components/students/StudentForm.tsx
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../services/types';

interface StudentFormProps {
  student?: Student;
  onClose: () => void;
  onSuccess: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstMidName: '',
    enrollmentDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();
  const isEditing = !!student?.id;

  useEffect(() => {
    if (student) {
      setFormData({
        lastName: student.lastName || '',
        firstMidName: student.firstMidName || '',
        enrollmentDate: student.enrollmentDate ? 
          new Date(student.enrollmentDate).toISOString().split('T')[0] : '',
      });
    }
  }, [student]);

  const createMutation = useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onSuccess();
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { general: 'An error occurred' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) => 
      studentService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onSuccess();
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { general: 'An error occurred' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isEditing && student) {
      const updateData: UpdateStudentDto = {
        id: student.id,
        ...formData,
      };
      updateMutation.mutate({ id: student.id, data: updateData });
    } else {
      const createData: CreateStudentDto = formData;
      createMutation.mutate(createData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? 'Edit Student' : 'Create Student'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}
              
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="firstMidName" className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.firstMidName ? 'is-invalid' : ''}`}
                  id="firstMidName"
                  name="firstMidName"
                  value={formData.firstMidName}
                  onChange={handleChange}
                  required
                />
                {errors.firstMidName && (
                  <div className="invalid-feedback">{errors.firstMidName}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="enrollmentDate" className="form-label">Enrollment Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.enrollmentDate ? 'is-invalid' : ''}`}
                  id="enrollmentDate"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  required
                />
                {errors.enrollmentDate && (
                  <div className="invalid-feedback">{errors.enrollmentDate}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
```

#### 2.5 Main App Configuration

**App.tsx:**
```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import InstructorsPage from './pages/InstructorsPage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/instructors" element={<InstructorsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### Step 3: Development Configuration

#### 3.1 Environment Configuration

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://localhost:7000/api
```

**Backend (appsettings.Development.json):**
```json
{
  "DetailedErrors": true,
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

#### 3.2 Build and Run Scripts

**Frontend package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

**Development Commands:**
```bash
# Terminal 1: Start .NET API
cd ContosoUniversity
dotnet run --urls "https://localhost:7000"

# Terminal 2: Start React app
cd contoso-university-frontend
npm run dev
```

---

## API Contract Examples

### Students API

```
GET /api/students?sortOrder=name&searchString=john&pageIndex=1
POST /api/students
PUT /api/students/{id}
DELETE /api/students/{id}
GET /api/students/{id}
```

### Departments API

```
GET /api/departments
POST /api/departments
PUT /api/departments/{id}
DELETE /api/departments/{id}
GET /api/departments/{id}
GET /api/departments/{id}/courses
```

---

## Best Practices for Long-term Maintenance

### 1. Code Organization
- **Separation of Concerns:** Keep API logic separate from UI logic
- **Reusable Components:** Create generic components for forms, tables, modals
- **Custom Hooks:** Extract data fetching logic into reusable hooks
- **Type Safety:** Use TypeScript throughout for better maintainability

### 2. Error Handling
- **Global Error Boundary:** Catch and handle React errors gracefully
- **API Error Interceptors:** Centralized error handling for API calls
- **User-Friendly Messages:** Convert technical errors to user-friendly messages
- **Logging:** Implement proper logging for debugging

### 3. Performance Optimization
- **React Query Caching:** Leverage caching for better performance
- **Code Splitting:** Use lazy loading for route-based code splitting
- **Memoization:** Use React.memo and useMemo for expensive operations
- **Bundle Analysis:** Regular bundle size monitoring

### 4. Testing Strategy
- **Unit Tests:** Test individual components and services
- **Integration Tests:** Test API endpoints
- **E2E Tests:** Test complete user workflows
- **API Contract Tests:** Ensure API contracts remain stable

### 5. Development Workflow
- **Hot Reloading:** Both frontend and backend support hot reloading
- **API Documentation:** Maintain up-to-date Swagger documentation
- **Version Control:** Separate repositories or monorepo with clear structure
- **CI/CD Pipeline:** Automated testing and deployment

---

## Migration Timeline

### Week 1: Backend API Setup
- Convert PageModels to Controllers
- Create DTOs and API contracts
- Set up CORS and Swagger
- Test API endpoints

### Week 2: React Foundation
- Set up React project structure
- Implement routing and navigation
- Create base components and services
- Set up state management

### Week 3: Core Features
- Migrate Students functionality
- Migrate Departments functionality
- Implement search and pagination
- Add form validation

### Week 4: Remaining Features
- Migrate Instructors and Courses
- Implement error handling
- Add loading states and UX improvements
- Testing and bug fixes

### Week 5: Polish and Deploy
- Performance optimization
- Final testing
- Documentation updates
- Production deployment setup

---

## Conclusion

This migration plan provides a comprehensive roadmap for converting ContosoUniversity from a Razor Pages application to a modern React frontend with .NET 8 Web API backend. The approach ensures:

- **Maintainability:** Clear separation of concerns and modern architecture
- **Scalability:** Modular structure that can grow with requirements
- **Performance:** Optimized data fetching and caching strategies
- **Developer Experience:** Hot reloading, TypeScript, and modern tooling
- **User Experience:** Responsive UI with proper error handling and loading states

The migration preserves all existing functionality while providing a foundation for future enhancements and modern web development practices.a