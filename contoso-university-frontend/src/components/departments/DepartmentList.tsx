import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Card, Badge, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { departmentService } from '../../services/departmentService';
import type { Department } from '../../types/index.js';
import { formatDate, formatCurrency } from '../../utils/dateHelpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';

interface DepartmentListProps {
  onEdit: (department: Department) => void;
  onView: (department: Department) => void;
  onAdd: () => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ onEdit, onView, onAdd }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; department?: Department }>({
    show: false
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getDepartments,
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
      setDeleteConfirm({ show: false });
    },
    onError: () => {
      toast.error('Failed to delete department');
    }
  });

  const handleDelete = (department: Department) => {
    setDeleteConfirm({ show: true, department });
  };

  const confirmDelete = () => {
    if (deleteConfirm.department) {
      deleteMutation.mutate(deleteConfirm.department.departmentID);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading departments..." />;
  
  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body className="text-center">
          <i className="fas fa-exclamation-triangle text-danger fa-2x mb-3"></i>
          <h5>Error Loading Departments</h5>
          <p className="text-muted">Unable to load department data. Please try again.</p>
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
        <Card.Header className="bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className="fas fa-building me-2"></i>
                Departments
              </h4>
              <small>Manage academic departments</small>
            </div>
            <Button variant="light" onClick={onAdd}>
              <i className="fas fa-plus me-1"></i>
              Add Department
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-12 text-end">
              <Badge bg="info" className="fs-6">
                {data.departments.length} total departments
              </Badge>
            </div>
          </div>

          {data.departments.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-building fa-3x text-muted mb-3"></i>
              <h5>No Departments Found</h5>
              <p className="text-muted">No departments have been added yet.</p>
              <Button variant="success" onClick={onAdd}>
                <i className="fas fa-plus me-1"></i>
                Add First Department
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Department Name</th>
                    <th>Budget</th>
                    <th>Start Date</th>
                    <th>Administrator</th>
                    <th>Concurrency Token</th>
                    <th width="200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.departments.map((department) => (
                    <tr key={department.departmentID}>
                      <td className="fw-medium">
                        <i className="fas fa-building me-2 text-muted"></i>
                        {department.name}
                      </td>
                      <td>
                        <Badge bg="success" className="fs-6">
                          {formatCurrency(department.budget)}
                        </Badge>
                      </td>
                      <td>{formatDate(department.startDate)}</td>
                      <td>
                        {department.administratorName ? (
                          <span>
                            <i className="fas fa-user-tie me-1 text-muted"></i>
                            {department.administratorName}
                          </span>
                        ) : (
                          <span className="text-muted">
                            <i className="fas fa-user-slash me-1"></i>
                            No administrator
                          </span>
                        )}
                      </td>
                      <td>
                        <code className="small">
                          {department.concurrencyToken ? 
                            department.concurrencyToken.substring(0, 8) + '...' : 
                            'N/A'
                          }
                        </code>
                      </td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-info"
                            onClick={() => onView(department)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button 
                            variant="outline-primary"
                            onClick={() => onEdit(department)}
                            title="Edit Department"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="outline-danger"
                            onClick={() => handleDelete(department)}
                            disabled={deleteMutation.isPending}
                            title="Delete Department"
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
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={deleteConfirm.show}
        title="Delete Department"
        message={`Are you sure you want to delete the ${deleteConfirm.department?.name} department? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false })}
      />
    </>
  );
};

export default DepartmentList;