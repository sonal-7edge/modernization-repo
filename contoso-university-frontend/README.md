# Contoso University Frontend

A modern React frontend for the Contoso University academic management system.

## 🚀 Features

- **Modern React 18** with TypeScript for type safety
- **Responsive Design** with Bootstrap 5 and custom CSS
- **State Management** with React Query for server state
- **Form Handling** with React Hook Form and Yup validation
- **Real-time Updates** with optimistic updates and caching
- **Component Architecture** with reusable, modular components
- **Error Handling** with comprehensive error boundaries and user feedback
- **Accessibility** with ARIA labels and keyboard navigation support

## 📋 Implemented Features

### ✅ Students Management
- List students with search, sorting, and pagination
- Add new students with form validation
- Edit existing student records
- View detailed student information
- Delete students with confirmation

### ✅ Departments Management
- List all departments with budget and administrator info
- Add new departments with instructor assignment
- Edit department details including concurrency handling
- Delete departments with confirmation

### ✅ Common Features
- Responsive navigation with active state indicators
- Loading states and error handling
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Search functionality with real-time filtering
- Pagination with page info and navigation
- Modern UI with hover effects and animations

### 🔄 Coming Soon
- Instructors management (placeholder ready)
- Courses management (placeholder ready)
- Student enrollment management
- Grade tracking and reporting

## 🛠 Technology Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **React Query** - Server state management and caching
- **React Router** - Client-side routing
- **React Hook Form** - Performant form handling
- **Yup** - Schema validation
- **Bootstrap 5** - Responsive UI framework
- **React Bootstrap** - Bootstrap components for React
- **FontAwesome** - Icon library
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Layout, Loading, etc.)
│   ├── students/        # Student-specific components
│   └── departments/     # Department-specific components
├── pages/               # Page components (route handlers)
├── services/            # API services and HTTP client
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and customizations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- .NET 8 API running on https://localhost:7000

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# .env file is already configured for local development
VITE_API_BASE_URL=https://localhost:7000/api
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration

### API Configuration
The frontend is configured to connect to the .NET API at `https://localhost:7000/api`. 

To change the API URL, update the `VITE_API_BASE_URL` in the `.env` file.

### HTTPS Development
The application is configured to work with the self-signed certificate from the .NET development server. If you encounter certificate issues:

1. Trust the .NET development certificate:
```bash
dotnet dev-certs https --trust
```

2. Or access the API directly in your browser first to accept the certificate.

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Bootstrap's default palette with custom enhancements
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent spacing using Bootstrap's spacing utilities
- **Icons**: FontAwesome icons for visual consistency

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Responsive across all screen sizes
- **Touch-friendly**: Appropriate touch targets for mobile

### Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators

## 🔄 State Management

### React Query
- **Caching**: Automatic caching of API responses
- **Background Updates**: Automatic refetching of stale data
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Error Handling**: Centralized error handling with retry logic

### Local State
- **Form State**: Managed with React Hook Form
- **UI State**: Component-level state with useState
- **Modal State**: Local state for modal visibility and data

## 📱 Component Architecture

### Common Components
- **Layout**: Main application layout with navigation
- **LoadingSpinner**: Reusable loading indicator
- **ErrorBoundary**: Error boundary for graceful error handling
- **ConfirmDialog**: Reusable confirmation modal
- **SearchBar**: Reusable search input component
- **Pagination**: Reusable pagination component

### Feature Components
- **StudentList**: Student listing with search and pagination
- **StudentForm**: Student creation and editing form
- **StudentDetails**: Student detail view modal
- **DepartmentList**: Department listing and management
- **DepartmentForm**: Department creation and editing form

## 🔐 Security Considerations

### API Security
- **HTTPS**: All API calls use HTTPS
- **Error Handling**: Sensitive information not exposed in errors
- **Token Management**: Ready for JWT token implementation

### Input Validation
- **Client-side Validation**: Form validation with Yup schemas
- **Server-side Validation**: API validation errors properly handled
- **XSS Prevention**: React's built-in XSS protection

## 🚀 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based code splitting ready
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Optimized images and fonts

### Runtime Performance
- **React Query Caching**: Reduced API calls
- **Memoization**: Strategic use of React.memo and useMemo
- **Lazy Loading**: Components loaded on demand

## 🧪 Testing Strategy

### Testing Setup (Ready for Implementation)
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing with Cypress
- **Accessibility Tests**: Automated accessibility testing

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set the following environment variables for production:
- `VITE_API_BASE_URL`: Production API URL

### Hosting Options
- **Netlify**: Automatic deployments from Git
- **Vercel**: Optimized for React applications
- **AWS S3 + CloudFront**: Scalable static hosting
- **Azure Static Web Apps**: Integrated with Azure services

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: All new code must be TypeScript
2. **Components**: Use functional components with hooks
3. **Styling**: Use Bootstrap classes with custom CSS for enhancements
4. **State**: Use React Query for server state, local state for UI
5. **Forms**: Use React Hook Form with Yup validation
6. **Testing**: Write tests for new components and features

### Code Style
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use PascalCase for components, camelCase for functions
- **File Structure**: Group related files in feature folders

## 📚 Documentation

### API Documentation
- Swagger UI available at: https://localhost:7000/swagger
- API endpoints documented in the backend project

### Component Documentation
- Each component includes TypeScript interfaces
- Props are documented with JSDoc comments
- Usage examples in component files

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure .NET API is running on https://localhost:7000
   - Check CORS configuration in the API
   - Verify SSL certificate is trusted

2. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 16+)
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for detailed error messages
   - Verify API responses match expected TypeScript interfaces
   - Check network tab for failed API calls

### Getting Help
- Check the browser console for error messages
- Review the API logs for backend issues
- Ensure all environment variables are set correctly

---

**Built with ❤️ using modern web technologies**