import React, { useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { studentService } from '../../services/studentService';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../../types/index.js';
import { formatDateForInput } from '../../utils/dateHelpers';

interface StudentFormProps {
  show: boolean;
  student?: Student;
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
  enrollmentDate: yup
    .string()
    .required('Enrollment date is required')
});

type FormData = {
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
};

const StudentForm: React.FC<StudentFormProps> = ({ show, student, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!student?.id;

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
      enrollmentDate: ''
    }
  });

  useEffect(() => {
    if (student) {
      setValue('lastName', student.lastName || '');
      setValue('firstMidName', student.firstMidName || '');
      setValue('enrollmentDate', formatDateForInput(student.enrollmentDate) || '');
    } else {
      reset();
    }
  }, [student, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created successfully');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create student');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) => 
      studentService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student');
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && student) {
      const updateData: UpdateStudentDto = {
        id: student.id,
        ...data
      };
      updateMutation.mutate({ id: student.id, data: updateData });
    } else {
      const createData: CreateStudentDto = data;
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
          {isEditing ? 'Edit Student' : 'Add New Student'}
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
                  Enrollment Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  {...register('enrollmentDate')}
                  isInvalid={!!errors.enrollmentDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.enrollmentDate?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  The date when the student enrolled
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {(createMutation.error || updateMutation.error) && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {(createMutation.error as any)?.response?.data?.message || 
               (updateMutation.error as any)?.response?.data?.message || 
               'An error occurred while saving the student'}
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
                {isEditing ? 'Update Student' : 'Create Student'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentForm;