import React from 'react';
import { Modal, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import type { Student } from '../../types/index.js';
import { formatDate } from '../../utils/dateHelpers';

interface StudentDetailsProps {
  show: boolean;
  student?: Student;
  onClose: () => void;
  onEdit: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ 
  show, 
  student, 
  onClose, 
  onEdit 
}) => {
  if (!student) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-user-graduate me-2"></i>
          Student Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Card className="border-0">
          <Card.Body>
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-user-graduate fa-2x"></i>
              </div>
              <h4 className="mt-3 mb-1">{student.fullName}</h4>
              <Badge bg="primary">Student ID: {student.id}</Badge>
            </div>

            <Row>
              <Col md={6}>
                <Card className="h-100 border-light">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      Personal Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>First Name:</strong>
                      <div className="text-muted">{student.firstMidName}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Last Name:</strong>
                      <div className="text-muted">{student.lastName}</div>
                    </div>
                    <div className="mb-0">
                      <strong>Full Name:</strong>
                      <div className="text-muted">{student.fullName}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-light">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-calendar me-2"></i>
                      Academic Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Enrollment Date:</strong>
                      <div className="text-muted">{formatDate(student.enrollmentDate)}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Student Status:</strong>
                      <div>
                        <Badge bg="success">Active</Badge>
                      </div>
                    </div>
                    <div className="mb-0">
                      <strong>Academic Year:</strong>
                      <div className="text-muted">
                        {new Date(student.enrollmentDate).getFullYear()}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Placeholder for future features */}
            <Card className="mt-3 border-light">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <i className="fas fa-book me-2"></i>
                  Enrollments
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-3">
                  <i className="fas fa-book-open fa-2x text-muted mb-2"></i>
                  <p className="text-muted mb-0">
                    Course enrollment information will be displayed here.
                  </p>
                  <small className="text-muted">Feature coming soon...</small>
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onEdit}>
          <i className="fas fa-edit me-1"></i>
          Edit Student
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentDetails;