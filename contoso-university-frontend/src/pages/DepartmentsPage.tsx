import React, { useState } from 'react';
import type { Department } from '../types/index.js';
import DepartmentList from '../components/departments/DepartmentList';
import DepartmentForm from '../components/departments/DepartmentForm';

const DepartmentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();

  const handleAdd = () => {
    setSelectedDepartment(undefined);
    setShowForm(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  const handleView = (department: Department) => {
    // For now, just edit - we can add a details view later
    handleEdit(department);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDepartment(undefined);
  };

  return (
    <>
      <DepartmentList
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
      />

      <DepartmentForm
        show={showForm}
        department={selectedDepartment}
        onClose={handleCloseForm}
      />
    </>
  );
};

export default DepartmentsPage;