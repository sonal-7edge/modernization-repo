import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Card, Badge, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { instructorService } from '../../services/instructorService';
import type { Instructor } from '../../types/index.js';
import { formatDate } from '../../utils/dateHelpers';
import LoadingSpinner from '../common/LoadingSpinner';

interface InstructorListProps {
  onEdit: (instructor: Instructor) => void;
  onView: (instructor: Instructor) => void;
}

const InstructorList: React.FC<InstructorListProps> = ({ onEdit, onView }) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: instructorService.getInstructors,
  });

  const deleteMutation = useMutation({
    mutationFn: instructorService.deleteInstructor,
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete instructor');
    },
    onSettled: () => {
      setDeletingId(null);
    }
  });

  const handleDelete = (instructor: Instructor) => {
    if (window.confirm(`Are you sure you want to delete ${instructor.fullName}?`)) {
      deleteMutation.mutate(instructor.id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body className="text-center">
          <i className="fas fa-exclamation-triangle text-danger fa-2x mb-3"></i>
          <h5>Error Loading Instructors</h5>
          <p className="text-muted">Unable to load instructor data. Please try again.</p>
        </Card.Body>
      </Card>
    );
  }

  const instructors = data?.instructors || [];

  if (instructors.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <i className="fas fa-chalkboard-teacher fa-3x text-muted mb-3"></i>
          <h5>No Instructors Found</h5>
          <p className="text-muted">Start by adding your first instructor.</p>
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
            Instructors ({instructors.length})
          </h6>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Hire Date</th>
                <th>Office</th>
                <th>Courses</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>
                    <div>
                      <strong>{instructor.fullName}</strong>
                      <br />
                      <small className="text-muted">ID: {instructor.id}</small>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">
                      {formatDate(instructor.hireDate)}
                    </span>
                  </td>
                  <td>
                    {instructor.officeLocation ? (
                      <Badge bg="info">{instructor.officeLocation}</Badge>
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {instructor.courses?.length || 0} courses
                    </Badge>
                  </td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        onClick={() => onView(instructor)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        variant="outline-warning"
                        onClick={() => onEdit(instructor)}
                        title="Edit Instructor"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(instructor)}
                        disabled={deletingId === instructor.id}
                        title="Delete Instructor"
                      >
                        {deletingId === instructor.id ? (
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

export default InstructorList;