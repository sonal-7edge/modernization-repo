import React, { useState } from 'react';
import type { Course } from '../types/index.js';
import CourseList from '../components/courses/CourseList';
import CourseForm from '../components/courses/CourseForm';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const CoursesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [showDetails, setShowDetails] = useState(false);

  const handleAdd = () => {
    setSelectedCourse(undefined);
    setShowForm(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleView = (course: Course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCourse(undefined);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedCourse(undefined);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">
                    <i className="fas fa-book me-2"></i>
                    Courses
                  </h4>
                  <small>Manage course catalog and schedules</small>
                </div>
                <Button variant="dark" onClick={handleAdd}>
                  <i className="fas fa-plus me-1"></i>
                  Add Course
                </Button>
              </div>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <CourseList 
            onEdit={handleEdit}
            onView={handleView}
          />
        </Col>
      </Row>

      <CourseForm
        show={showForm}
        course={selectedCourse}
        onClose={handleCloseForm}
      />
    </Container>
  );
};

export default CoursesPage;