import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Students',
      description: 'Manage student records, enrollment, and academic information',
      icon: 'fa-user-graduate',
      color: 'primary',
      path: '/students'
    },
    {
      title: 'Instructors',
      description: 'Manage instructor profiles, assignments, and course relationships',
      icon: 'fa-chalkboard-teacher',
      color: 'info',
      path: '/instructors'
    },
    {
      title: 'Courses',
      description: 'Manage course catalog, schedules, and academic programs',
      icon: 'fa-book',
      color: 'warning',
      path: '/courses'
    },
    {
      title: 'Departments',
      description: 'Manage academic departments, budgets, and administrative structure',
      icon: 'fa-building',
      color: 'success',
      path: '/departments'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Card className="bg-primary text-white mb-4 shadow-lg">
        <Card.Body className="py-5">
          <div className="text-center">
            <i className="fas fa-graduation-cap fa-4x mb-4"></i>
            <h1 className="display-4 fw-bold mb-3">Welcome to Contoso University</h1>
            <p className="lead mb-4">
              A comprehensive academic management system built with modern web technologies
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="light" size="lg" onClick={() => navigate('/students')}>
                <i className="fas fa-user-graduate me-2"></i>
                Manage Students
              </Button>
              <Button variant="outline-light" size="lg" onClick={() => navigate('/about')}>
                <i className="fas fa-info-circle me-2"></i>
                Learn More
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Features Grid */}
      <Row className="g-4 mb-5">
        {features.map((feature, index) => (
          <Col key={index} md={6} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 feature-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(feature.path)}
            >
              <Card.Body className="text-center p-4">
                <div className={`text-${feature.color} mb-3`}>
                  <i className={`fas ${feature.icon} fa-3x`}></i>
                </div>
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text text-muted">{feature.description}</p>
                <Button variant={`outline-${feature.color}`} size="sm">
                  <i className="fas fa-arrow-right me-1"></i>
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Statistics Section */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <i className="fas fa-chart-bar me-2"></i>
            System Overview
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="text-center">
            <Col md={3}>
              <div className="p-3">
                <i className="fas fa-user-graduate fa-2x text-primary mb-2"></i>
                <h4 className="text-primary">Students</h4>
                <p className="text-muted mb-0">Manage student records and enrollment</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3">
                <i className="fas fa-chalkboard-teacher fa-2x text-info mb-2"></i>
                <h4 className="text-info">Instructors</h4>
                <p className="text-muted mb-0">Faculty management and assignments</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3">
                <i className="fas fa-book fa-2x text-warning mb-2"></i>
                <h4 className="text-warning">Courses</h4>
                <p className="text-muted mb-0">Course catalog and scheduling</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3">
                <i className="fas fa-building fa-2x text-success mb-2"></i>
                <h4 className="text-success">Departments</h4>
                <p className="text-muted mb-0">Academic department organization</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <i className="fas fa-bolt me-2"></i>
            Quick Actions
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/students')}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Student
                </Button>
                <Button variant="outline-info" onClick={() => navigate('/instructors')}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Instructor
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-grid gap-2">
                <Button variant="outline-warning" onClick={() => navigate('/courses')}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Course
                </Button>
                <Button variant="outline-success" onClick={() => navigate('/departments')}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Department
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <style>{`
        .feature-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default HomePage;