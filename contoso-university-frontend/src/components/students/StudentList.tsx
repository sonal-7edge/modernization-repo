import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Card, Badge, ButtonGroup, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { studentService } from '../../services/studentService';
import type { Student } from '../../types/index.js';
import { formatDate } from '../../utils/dateHelpers';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import ConfirmDialog from '../common/ConfirmDialog';

interface StudentListProps {
  onEdit: (student: Student) => void;
  onView: (student: Student) => void;
  onAdd: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ onEdit, onView, onAdd }) => {
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; student?: Student }>({
    show: false
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['students', { sortOrder, searchString, pageIndex }],
    queryFn: () => studentService.getStudents({ sortOrder, searchString, pageIndex }),
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
      setDeleteConfirm({ show: false });
    },
    onError: () => {
      toast.error('Failed to delete student');
    }
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

  const handleDelete = (student: Student) => {
    setDeleteConfirm({ show: true, student });
  };

  const confirmDelete = () => {
    if (deleteConfirm.student) {
      deleteMutation.mutate(deleteConfirm.student.id);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortOrder === field) return <i className="fas fa-sort-up ms-1"></i>;
    if (sortOrder === `${field}_desc`) return <i className="fas fa-sort-down ms-1"></i>;
    return <i className="fas fa-sort ms-1 text-muted"></i>;
  };

  if (isLoading) return <LoadingSpinner text="Loading students..." />;
  
  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body className="text-center">
          <i className="fas fa-exclamation-triangle text-danger fa-2x mb-3"></i>
          <h5>Error Loading Students</h5>
          <p className="text-muted">Unable to load student data. Please try again.</p>
          <Button variant="outline-primary" onClick={() => window.location.reload()}>
            <i className="fas fa-redo me-1"></i>
            Retry
          </Button>
        </Card.Body>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className="fas fa-user-graduate me-2"></i>
                Students
              </h4>
              <small>Manage student records</small>
            </div>
            <Button variant="light" onClick={onAdd}>
              <i className="fas fa-plus me-1"></i>
              Add Student
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by name..."
                initialValue={searchString}
              />
            </div>
            <div className="col-md-6 text-md-end">
              <Badge bg="info" className="fs-6">
                {data.totalCount} total students
              </Badge>
            </div>
          </div>

          {data.students.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-user-graduate fa-3x text-muted mb-3"></i>
              <h5>No Students Found</h5>
              <p className="text-muted">
                {searchString ? 'No students match your search criteria.' : 'No students have been added yet.'}
              </p>
              {!searchString && (
                <Button variant="primary" onClick={onAdd}>
                  <i className="fas fa-plus me-1"></i>
                  Add First Student
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th 
                        className="cursor-pointer user-select-none"
                        onClick={() => handleSort('name')}
                      >
                        Last Name {getSortIcon('name')}
                      </th>
                      <th>First Name</th>
                      <th 
                        className="cursor-pointer user-select-none"
                        onClick={() => handleSort('Date')}
                      >
                        Enrollment Date {getSortIcon('Date')}
                      </th>
                      <th width="200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((student) => (
                      <tr key={student.id}>
                        <td className="fw-medium">{student.lastName}</td>
                        <td>{student.firstMidName}</td>
                        <td>{formatDate(student.enrollmentDate)}</td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button 
                              variant="outline-info"
                              onClick={() => onView(student)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button 
                              variant="outline-primary"
                              onClick={() => onEdit(student)}
                              title="Edit Student"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              variant="outline-danger"
                              onClick={() => handleDelete(student)}
                              disabled={deleteMutation.isPending}
                              title="Delete Student"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="mt-3">
                <Pagination
                  currentPage={data.pageIndex}
                  totalPages={data.totalPages}
                  totalItems={data.totalCount}
                  onPageChange={setPageIndex}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={deleteConfirm.show}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteConfirm.student?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false })}
      />
    </>
  );
};

export default StudentList;