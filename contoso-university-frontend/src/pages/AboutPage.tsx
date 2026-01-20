import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  const technologies = [
    { name: 'React 18', icon: 'fab fa-react', color: 'info' },
    { name: 'TypeScript', icon: 'fab fa-js-square', color: 'primary' },
    { name: '.NET 8', icon: 'fas fa-code', color: 'success' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: 'warning' },
    { name: 'Bootstrap 5', icon: 'fab fa-bootstrap', color: 'purple' },
    { name: 'React Query', icon: 'fas fa-sync', color: 'danger' }
  ];

  const features = [
    {
      title: 'Modern Architecture',
      description: 'Built with React frontend and .NET 8 Web API backend for scalability and maintainability',
      icon: 'fas fa-sitemap'
    },
    {
      title: 'Responsive Design',
      description: 'Mobile-first responsive design that works seamlessly across all devices',
      icon: 'fas fa-mobile-alt'
    },
    {
      title: 'Real-time Updates',
      description: 'Optimistic updates and real-time data synchronization for better user experience',
      icon: 'fas fa-sync-alt'
    },
    {
      title: 'Type Safety',
      description: 'Full TypeScript implementation ensures type safety and better developer experience',
      icon: 'fas fa-shield-alt'
    }
  ];

  return (
    <div>
      {/* Header */}
      <Card className="bg-gradient-primary text-white mb-4 shadow-lg">
        <Card.Body className="py-5 text-center">
          <i className="fas fa-info-circle fa-4x mb-4"></i>
          <h1 className="display-4 fw-bold mb-3">About Contoso University</h1>
          <p className="lead">
            A modern academic management system showcasing best practices in web development
          </p>
        </Card.Body>
      </Card>

      {/* Project Overview */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h4 className="mb-0">
            <i className="fas fa-project-diagram me-2"></i>
            Project Overview
          </h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <p className="lead">
                Contoso University is a comprehensive academic management system designed to demonstrate 
                modern web development practices and technologies.
              </p>
              <p>
                This application was migrated from a traditional ASP.NET Core Razor Pages application 
                to a modern React frontend with a .NET 8 Web API backend, showcasing the evolution 
                from server-side rendering to a decoupled, API-first architecture.
              </p>
              <p>
                The system manages students, instructors, courses, and departments with full CRUD 
                operations, search functionality, pagination, and real-time updates.
              </p>
            </Col>
            <Col md={4}>
              <Card className="border-primary">
                <Card.Header className="bg-primary text-white text-center">
                  <h6 className="mb-0">Quick Stats</h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="mb-2">
                    <i className="fas fa-code fa-2x text-primary"></i>
                    <div className="mt-1">
                      <strong>Modern Stack</strong>
                    </div>
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-mobile-alt fa-2x text-success"></i>
                    <div className="mt-1">
                      <strong>Responsive</strong>
                    </div>
                  </div>
                  <div>
                    <i className="fas fa-shield-alt fa-2x text-warning"></i>
                    <div className="mt-1">
                      <strong>Type Safe</strong>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Technologies Used */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h4 className="mb-0">
            <i className="fas fa-tools me-2"></i>
            Technologies Used
          </h4>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {technologies.map((tech, index) => (
              <Col key={index} md={4} lg={2}>
                <div className="text-center p-3 border rounded">
                  <i className={`${tech.icon} fa-2x text-${tech.color} mb-2`}></i>
                  <div className="fw-medium">{tech.name}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Features */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h4 className="mb-0">
            <i className="fas fa-star me-2"></i>
            Key Features
          </h4>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6}>
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <i className={feature.icon}></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Architecture */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h4 className="mb-0">
            <i className="fas fa-layer-group me-2"></i>
            System Architecture
          </h4>
        </Card.Header>
        <Card.Body>
          <Row className="text-center">
            <Col md={4}>
              <Card className="border-info h-100">
                <Card.Body>
                  <i className="fab fa-react fa-3x text-info mb-3"></i>
                  <h5>Frontend</h5>
                  <p className="text-muted">
                    React 18 with TypeScript, React Query for state management, 
                    and Bootstrap for responsive UI components.
                  </p>
                  <Badge bg="info">SPA</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-success h-100">
                <Card.Body>
                  <i className="fas fa-server fa-3x text-success mb-3"></i>
                  <h5>Backend API</h5>
                  <p className="text-muted">
                    .NET 8 Web API with Entity Framework Core, 
                    RESTful endpoints, and comprehensive error handling.
                  </p>
                  <Badge bg="success">REST API</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-warning h-100">
                <Card.Body>
                  <i className="fas fa-database fa-3x text-warning mb-3"></i>
                  <h5>Database</h5>
                  <p className="text-muted">
                    PostgreSQL database with Entity Framework migrations, 
                    optimized queries, and data integrity constraints.
                  </p>
                  <Badge bg="warning">PostgreSQL</Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AboutPage;