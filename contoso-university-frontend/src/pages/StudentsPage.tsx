import React, { useState } from 'react';
import type { Student } from '../types/index.js';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';
import StudentDetails from '../components/students/StudentDetails';

const StudentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();

  const handleAdd = () => {
    setSelectedStudent(undefined);
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedStudent(undefined);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedStudent(undefined);
  };

  const handleEditFromDetails = () => {
    setShowDetails(false);
    setShowForm(true);
  };

  return (
    <>
      <StudentList
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
      />

      <StudentForm
        show={showForm}
        student={selectedStudent}
        onClose={handleCloseForm}
      />

      <StudentDetails
        show={showDetails}
        student={selectedStudent}
        onClose={handleCloseDetails}
        onEdit={handleEditFromDetails}
      />
    </>
  );
};

export default StudentsPage;