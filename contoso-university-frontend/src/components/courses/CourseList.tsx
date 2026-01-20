import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Card, Badge, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types/index.js';
import LoadingSpinner from '../common/LoadingSpinner';

interface CourseListProps {
  onEdit: (course: Course) => void;
  onView: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onEdit, onView }) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getCourses,
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    },
    onSettled: () => {
      setDeletingId(null);
    }
  });

  const handleDelete = (course: Course) => {
    if (window.confirm(`Are you sure you want to delete ${course.title}?`)) {
      deleteMutation.mutate(course.courseID);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body className="text-center">
          <i className="fas fa-exclamation-triangle text-danger fa-2x mb-3"></i>
          <h5>Error Loading Courses</h5>
          <p className="text-muted">Unable to load course data. Please try again.</p>
        </Card.Body>
      </Card>
    );
  }

  const courses = data?.courses || [];

  if (courses.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <i className="fas fa-book fa-3x text-muted mb-3"></i>
          <h5>No Courses Found</h5>
          <p className="text-muted">Start by adding your first course.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Courses ({courses.length})
          </h6>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Course</th>
                <th>Department</th>
                <th>Credits</th>
                <th>Instructors</th>
                <th>Enrollments</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseID}>
                  <td>
                    <div>
                      <strong>{course.courseID} - {course.title}</strong>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{course.departmentName}</Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">{course.credits}</Badge>
                  </td>
                  <td>
                    {course.instructors && course.instructors.length > 0 ? (
                      <div>
                        {course.instructors.map((instructor, index) => (
                          <Badge key={instructor.id} bg="success" className="me-1">
                            {instructor.fullName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No instructors assigned</span>
                    )}
                  </td>
                  <td>
                    <Badge bg="primary">
                      {course.enrollmentCount || 0} students
                    </Badge>
                  </td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        onClick={() => onView(course)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        variant="outline-warning"
                        onClick={() => onEdit(course)}
                        title="Edit Course"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(course)}
                        disabled={deletingId === course.courseID}
                        title="Delete Course"
                      >
                        {deletingId === course.courseID ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseList;