import React, { useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { courseService } from '../../services/courseService';
import { departmentService } from '../../services/departmentService';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../../types/index.js';

interface CourseFormProps {
  show: boolean;
  course?: Course;
  onClose: () => void;
}

const schema = yup.object({
  courseID: yup
    .number()
    .required('Course number is required')
    .min(1000, 'Course number must be between 1000 and 9999')
    .max(9999, 'Course number must be between 1000 and 9999')
    .typeError('Course number must be a valid number'),
  title: yup
    .string()
    .required('Course title is required')
    .min(3, 'Course title must be at least 3 characters')
    .max(50, 'Course title must be less than 50 characters'),
  credits: yup
    .number()
    .required('Credits is required')
    .min(0, 'Credits must be between 0 and 5')
    .max(5, 'Credits must be between 0 and 5')
    .typeError('Credits must be a valid number'),
  departmentID: yup
    .number()
    .required('Department is required')
    .typeError('Please select a department')
});

type FormData = {
  courseID: number;
  title: string;
  credits: number;
  departmentID: number;
  instructorIDs: number[];
};

const CourseForm: React.FC<CourseFormProps> = ({ show, course, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!course?.courseID;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      courseID: 0,
      title: '',
      credits: 0,
      departmentID: 0,
      instructorIDs: []
    }
  });

  // Fetch departments for dropdown
  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getDepartments,
    enabled: show
  });

  // Fetch instructors for dropdown
  const { data: instructors } = useQuery({
    queryKey: ['instructors-dropdown'],
    queryFn: courseService.getInstructorsForDropdown,
    enabled: show
  });

  useEffect(() => {
    if (course) {
      setValue('courseID', course.courseID || 0);
      setValue('title', course.title || '');
      setValue('credits', course.credits || 0);
      setValue('departmentID', course.departmentID || 0);
      setValue('instructorIDs', course.instructors?.map(i => i.id) || []);
    } else {
      reset();
    }
  }, [course, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseDto }) => 
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course');
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && course) {
      const updateData: UpdateCourseDto = {
        courseID: data.courseID,
        title: data.title,
        credits: data.credits,
        departmentID: data.departmentID,
        instructorIDs: data.instructorIDs
      };
      updateMutation.mutate({ id: course.courseID, data: updateData });
    } else {
      const createData: CreateCourseDto = {
        courseID: data.courseID,
        title: data.title,
        credits: data.credits,
        departmentID: data.departmentID,
        instructorIDs: data.instructorIDs
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
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Course Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  {...register('courseID')}
                  isInvalid={!!errors.courseID}
                  placeholder="e.g., 1050"
                  disabled={isEditing}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.courseID?.message}
                </Form.Control.Feedback>
                {isEditing && (
                  <Form.Text className="text-muted">
                    Course number cannot be changed
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Credits <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="5"
                  {...register('credits')}
                  isInvalid={!!errors.credits}
                  placeholder="0-5"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.credits?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Course Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('title')}
                  isInvalid={!!errors.title}
                  placeholder="Enter course title"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Department <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  {...register('departmentID')}
                  isInvalid={!!errors.departmentID}
                >
                  <option value="">Select a department</option>
                  {departmentsData?.departments?.map((department) => (
                    <option key={department.departmentID} value={department.departmentID}>
                      {department.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.departmentID?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Instructors</Form.Label>
                <Form.Select
                  multiple
                  {...register('instructorIDs')}
                  size={4}
                >
                  {instructors?.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.fullName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Hold Ctrl/Cmd to select multiple instructors
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {(createMutation.error || updateMutation.error) && (
            <Alert variant="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {(createMutation.error as any)?.response?.data?.message || 
               (updateMutation.error as any)?.response?.data?.message || 
               'An error occurred while saving the course'}
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
                {isEditing ? 'Update Course' : 'Create Course'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CourseForm;