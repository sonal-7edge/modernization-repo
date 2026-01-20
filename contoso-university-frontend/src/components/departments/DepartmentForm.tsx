import React, { useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { departmentService } from '../../services/departmentService';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../../types/index.js';
import { formatDateForInput } from '../../utils/dateHelpers';

interface DepartmentFormProps {
  show: boolean;
  department?: Department;
  onClose: () => void;
}

const schema = yup.object({
  name: yup
    .string()
    .required('Department name is required')
    .min(3, 'Department name must be at least 3 characters')
    .max(50, 'Department name must be less than 50 characters'),
  budget: yup
    .number()
    .required('Budget is required')
    .min(0, 'Budget must be a positive number')
    .typeError('Budget must be a valid number'),
  startDate: yup
    .string()
    .required('Start date is required'),
  instructorID: yup
    .number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
});

type FormData = {
  name: string;
  budget: number;
  startDate: string;
  instructorID?: number | null;
};

const DepartmentForm: React.FC<DepartmentFormProps> = ({ show, department, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!department?.departmentID;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      budget: 0,
      startDate: '',
      instructorID: null
    }
  });

  // Fetch instructors for dropdown
  const { data: instructors } = useQuery({
    queryKey: ['instructors-dropdown'],
    queryFn: departmentService.getInstructorsForDropdown,
    enabled: show
  });

  useEffect(() => {
    if (department) {
      setValue('name', department.name || '');
      setValue('budget', department.budget || 0);
      setValue('startDate', formatDateForInput(department.startDate) || '');
      setValue('instructorID', department.instructorID || null);
    } else {
      reset();
    }
  }, [department, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create department');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDepartmentDto }) => 
      departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update department');
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && department) {
      const updateData: UpdateDepartmentDto = {
        departmentID: department.departmentID,
        name: data.name,
        budget: data.budget,
        startDate: data.startDate,
        instructorID: data.instructorID || undefined,
        concurrencyToken: department.concurrencyToken
      };
      updateMutation.mutate({ id: department.departmentID, data: updateData });
    } else {
      const createData: CreateDepartmentDto = {
        name: data.name,
        budget: data.budget,
        startDate: data.startDate,
        instructorID: data.instructorID || undefined
      };
      createMutation.mutate(createData);
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending && !updateMutation.isPending) {
      onClose();
      reset();
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {isEditing ? 'Edit Department' : 'Add New Department'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Department Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('name')}
                  isInvalid={!!errors.name}
                  placeholder="Enter department name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Budget <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('budget')}
                  isInvalid={!!errors.budget}
                  placeholder="Enter budget amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.budget?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Start Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  {...register('startDate')}
                  isInvalid={!!errors.startDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Administrator</Form.Label>
                <Form.Select
                  {...register('instructorID')}
                  isInvalid={!!errors.instructorID}
                >
                  <option value="">Select an administrator (optional)</option>
                  {instructors?.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.fullName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.instructorID?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Choose an instructor to be the department administrator
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {(createMutation.error || updateMutation.error) && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {(createMutation.error as any)?.response?.data?.message || 
               (updateMutation.error as any)?.response?.data?.message || 
               'An error occurred while saving the department'}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="success"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-1`}></i>
                {isEditing ? 'Update Department' : 'Create Department'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;