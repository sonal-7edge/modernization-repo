import React, { useState } from 'react';
import type { Instructor } from '../types/index.js';
import InstructorList from '../components/instructors/InstructorList';
import InstructorForm from '../components/instructors/InstructorForm';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const InstructorsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | undefined>();
  const [showDetails, setShowDetails] = useState(false);

  const handleAdd = () => {
    setSelectedInstructor(undefined);
    setShowForm(true);
  };

  const handleEdit = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowForm(true);
  };

  const handleView = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedInstructor(undefined);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedInstructor(undefined);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">
                    <i className="fas fa-chalkboard-teacher me-2"></i>
                    Instructors
                  </h4>
                  <small>Manage instructor records and assignments</small>
                </div>
                <Button variant="light" onClick={handleAdd}>
                  <i className="fas fa-plus me-1"></i>
                  Add Instructor
                </Button>
              </div>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <InstructorList 
            onEdit={handleEdit}
            onView={handleView}
          />
        </Col>
      </Row>

      <InstructorForm
        show={showForm}
        instructor={selectedInstructor}
        onClose={handleCloseForm}
      />
    </Container>
  );
};

export default InstructorsPage;