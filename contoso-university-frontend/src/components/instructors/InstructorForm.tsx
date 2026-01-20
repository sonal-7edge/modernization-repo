import React, { useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { instructorService } from '../../services/instructorService';
import type { Instructor, CreateInstructorDto, UpdateInstructorDto } from '../../types/index.js';
import { formatDateForInput } from '../../utils/dateHelpers';

interface InstructorFormProps {
  show: boolean;
  instructor?: Instructor;
  onClose: () => void;
}

const schema = yup.object({
  lastName: yup
    .string()
    .required('Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  firstMidName: yup
    .string()
    .required('First name is required')
    .max(50, 'First name must be less than 50 characters'),
  hireDate: yup
    .string()
    .required('Hire date is required'),
  officeLocation: yup
    .string()
    .max(50, 'Office location must be less than 50 characters')
});

type FormData = {
  lastName: string;
  firstMidName: string;
  hireDate: string;
  officeLocation?: string;
};

const InstructorForm: React.FC<InstructorFormProps> = ({ show, instructor, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!instructor?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      lastName: '',
      firstMidName: '',
      hireDate: '',
      officeLocation: ''
    }
  });

  useEffect(() => {
    if (instructor) {
      setValue('lastName', instructor.lastName || '');
      setValue('firstMidName', instructor.firstMidName || '');
      setValue('hireDate', formatDateForInput(instructor.hireDate) || '');
      setValue('officeLocation', instructor.officeLocation || '');
    } else {
      reset();
    }
  }, [instructor, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: instructorService.createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor created successfully');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create instructor');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInstructorDto }) => 
      instructorService.updateInstructor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update instructor');
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && instructor) {
      const updateData: UpdateInstructorDto = {
        id: instructor.id,
        ...data
      };
      updateMutation.mutate({ id: instructor.id, data: updateData });
    } else {
      const createData: CreateInstructorDto = data;
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
          {isEditing ? 'Edit Instructor' : 'Add New Instructor'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Last Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('lastName')}
                  isInvalid={!!errors.lastName}
                  placeholder="Enter last name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  First Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('firstMidName')}
                  isInvalid={!!errors.firstMidName}
                  placeholder="Enter first name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstMidName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Hire Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  {...register('hireDate')}
                  isInvalid={!!errors.hireDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.hireDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Office Location</Form.Label>
                <Form.Control
                  type="text"
                  {...register('officeLocation')}
                  isInvalid={!!errors.officeLocation}
                  placeholder="Enter office location (optional)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.officeLocation?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Optional office assignment
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {(createMutation.error || updateMutation.error) && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {(createMutation.error as any)?.response?.data?.message || 
               (updateMutation.error as any)?.response?.data?.message || 
               'An error occurred while saving the instructor'}
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
            variant="primary"
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
                {isEditing ? 'Update Instructor' : 'Create Instructor'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InstructorForm;