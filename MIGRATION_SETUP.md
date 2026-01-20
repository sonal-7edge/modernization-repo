# ContosoUniversity Frontend Migration Setup Guide

This guide will help you migrate your ContosoUniversity application from Razor Pages to React + Web API.

## 🚀 Quick Start

### Step 1: Backend API Setup

1. **Install required packages:**
```bash
cd ContosoUniversity
dotnet add package Microsoft.AspNetCore.OpenApi --version 8.0.0
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
dotnet restore
```

2. **Test the API:**
```bash
dotnet run --urls "https://localhost:7000"
```

3. **Verify API endpoints:**
   - Open https://localhost:7000/swagger
   - Test the Students API endpoints
   - Test the Departments API endpoints

### Step 2: React Frontend Setup

1. **Run the setup script:**
```bash
chmod +x create-react-frontend.sh
./create-react-frontend.sh
```

2. **Start the React development server:**
```bash
cd contoso-university-frontend
npm run dev
```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: https://localhost:7000
   - Swagger UI: https://localhost:7000/swagger

## 📁 Project Structure After Migration

```
ContosoUniversity/                    # .NET 8 Web API
├── Controllers/
│   ├── StudentsController.cs        # ✅ Created
│   ├── DepartmentsController.cs     # ✅ Created
│   ├── InstructorsController.cs     # 🔄 To be created
│   └── CoursesController.cs         # 🔄 To be created
├── DTOs/
│   ├── StudentDto.cs                # ✅ Created
│   ├── DepartmentDto.cs             # ✅ Created
│   ├── InstructorDto.cs             # 🔄 To be created
│   └── CourseDto.cs                 # 🔄 To be created
├── Data/                            # ✅ Existing
├── Models/                          # ✅ Existing
├── Migrations/                      # ✅ Existing
└── Program.cs                       # ✅ Updated for API

contoso-university-frontend/          # React + TypeScript
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── students/
│   │   ├── departments/
│   │   ├── instructors/
│   │   └── courses/
│   ├── services/
│   │   ├── api.ts                   # ✅ Created
│   │   ├── types.ts                 # ✅ Created
│   │   ├── studentService.ts        # ✅ Created
│   │   └── departmentService.ts     # 🔄 To be created
│   ├── pages/
│   ├── hooks/
│   └── utils/
└── package.json
```

## 🔧 Development Workflow

### Running Both Applications

**Terminal 1 - Backend API:**
```bash
cd ContosoUniversity
dotnet run --urls "https://localhost:7000"
```

**Terminal 2 - React Frontend:**
```bash
cd contoso-university-frontend
npm run dev
```

### API Testing

1. **Test Students API:**
```bash
# Get all students
curl -X GET "https://localhost:7000/api/students" -k

# Create a student
curl -X POST "https://localhost:7000/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "lastName": "Doe",
    "firstMidName": "John",
    "enrollmentDate": "2024-01-15T00:00:00Z"
  }' -k
```

2. **Test Departments API:**
```bash
# Get all departments
curl -X GET "https://localhost:7000/api/departments" -k
```

## 📋 Migration Checklist

### ✅ Completed
- [x] Backend API configuration (Program.cs)
- [x] CORS setup for React development
- [x] Students API Controller with full CRUD
- [x] Departments API Controller with full CRUD
- [x] DTOs for Students and Departments
- [x] Swagger/OpenAPI documentation
- [x] React project structure
- [x] Basic API client setup
- [x] TypeScript type definitions

### 🔄 In Progress / To Do
- [ ] Instructors API Controller
- [ ] Courses API Controller
- [ ] Complete React components for Students
- [ ] Complete React components for Departments
- [ ] React components for Instructors
- [ ] React components for Courses
- [ ] Form validation in React
- [ ] Error handling and loading states
- [ ] Authentication (if needed)
- [ ] Unit tests for API
- [ ] E2E tests for React app

## 🎯 Next Development Steps

### 1. Complete Students Management (Priority 1)

**Backend:** Already complete ✅

**Frontend:** Create these components:
```typescript
// src/components/students/StudentList.tsx
// src/components/students/StudentForm.tsx
// src/components/students/StudentDetails.tsx
// src/hooks/useStudents.ts
```

### 2. Complete Departments Management (Priority 2)

**Backend:** Already complete ✅

**Frontend:** Create these components:
```typescript
// src/components/departments/DepartmentList.tsx
// src/components/departments/DepartmentForm.tsx
// src/services/departmentService.ts
```

### 3. Add Instructors Management (Priority 3)

**Backend:** Create `InstructorsController.cs` and `InstructorDto.cs`

**Frontend:** Create instructor components

### 4. Add Courses Management (Priority 4)

**Backend:** Create `CoursesController.cs` and `CourseDto.cs`

**Frontend:** Create course components

## 🔍 API Endpoints Reference

### Students API
```
GET    /api/students                 # List with pagination, search, sort
GET    /api/students/{id}            # Get single student
POST   /api/students                 # Create student
PUT    /api/students/{id}            # Update student
DELETE /api/students/{id}            # Delete student
```

### Departments API
```
GET    /api/departments              # List all departments
GET    /api/departments/{id}         # Get single department
POST   /api/departments              # Create department
PUT    /api/departments/{id}         # Update department
DELETE /api/departments/{id}         # Delete department
GET    /api/departments/instructors  # Get instructors for dropdown
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure the .NET API is running on https://localhost:7000
   - Check that CORS is configured correctly in Program.cs
   - Verify React is running on http://localhost:5173

2. **SSL Certificate Issues:**
   - Trust the development certificate: `dotnet dev-certs https --trust`
   - Or use the `-k` flag with curl for testing

3. **Database Connection Issues:**
   - Ensure PostgreSQL is running
   - Check connection string in appsettings.json
   - Run migrations: `dotnet ef database update`

4. **React Build Issues:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version (requires Node 16+)

### Debugging Tips

1. **API Debugging:**
   - Use Swagger UI at https://localhost:7000/swagger
   - Check browser Network tab for API calls
   - Enable detailed logging in appsettings.Development.json

2. **React Debugging:**
   - Use React Developer Tools browser extension
   - Check browser Console for JavaScript errors
   - Use React Query DevTools for API state debugging

## 📚 Additional Resources

- [ASP.NET Core Web API Tutorial](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [Bootstrap React Components](https://react-bootstrap.github.io/)

## 🤝 Contributing

When adding new features:

1. **Backend:** Create controller → Create DTOs → Update Program.cs if needed
2. **Frontend:** Create service → Create components → Add routing
3. **Testing:** Test API endpoints → Test React components → E2E testing
4. **Documentation:** Update this README → Update API documentation

---

**Happy coding! 🚀**