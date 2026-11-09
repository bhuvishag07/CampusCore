import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Users, LayoutGrid, List } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addStudent,
  updateStudent,
  deleteStudent,
  setSearchQuery,
  setDepartmentFilter,
  setSemesterFilter,
  setStatusFilter,
  setSortBy,
} from '@/redux/slices/studentSlice';
import { addActivity } from '@/redux/slices/activitySlice';
import { useToast } from '@/components/common/Toast';
import { StudentRow } from '@/components/students/StudentRow';
import { StudentForm } from '@/components/students/StudentForm';
import { PillDropdown } from '@/components/common/PillDropdown';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import styles from '@/components/departments/Departments.module.css';

const semesterOptions = [
  { label: 'All Semesters', value: 'All' },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ label: `Semester ${s}`, value: s })),
];

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Enrolled', value: 'Enrolled' },
  { label: 'On leave', value: 'On leave' },
  { label: 'Graduated', value: 'Graduated' },
];

const sortOptions = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by ID', value: 'id' },
  { label: 'Sort by GPA', value: 'gpa' },
  { label: 'Sort by Admission', value: 'admission' },
];

export const StudentsPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const {
    items: studentsList,
    searchQuery,
    departmentFilter,
    semesterFilter,
    statusFilter,
    sortBy,
  } = useAppSelector((state) => state.students);

  const departments = useAppSelector((state) => state.departments.items);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deptOptions = [
    { label: 'All Departments', value: 'All' },
    ...departments.map((d) => ({ label: `${d.code} - ${d.name}`, value: d.code })),
  ];

  // Derived filtered and sorted students
  const filteredStudents = useMemo(() => {
    return studentsList
      .filter((stu) => {
        const matchesSearch =
          stu.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stu.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stu.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept =
          departmentFilter === 'All' ? true : stu.departmentCode === departmentFilter;
        const matchesSem =
          semesterFilter === 'All' ? true : stu.semester === Number(semesterFilter);
        const matchesStatus =
          statusFilter === 'All' ? true : stu.enrollmentStatus === statusFilter;

        return matchesSearch && matchesDept && matchesSem && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'id') return a.studentId.localeCompare(b.studentId);
        if (sortBy === 'gpa') return (b.gpa || 0) - (a.gpa || 0);
        if (sortBy === 'admission') return b.admissionDate.localeCompare(a.admissionDate);
        return 0;
      });
  }, [studentsList, searchQuery, departmentFilter, semesterFilter, statusFilter, sortBy]);

  const handleAddSubmit = (values) => {
    const newStudent = { ...values, id: 'stu-' + Date.now() };
    dispatch(addStudent(newStudent));
    dispatch(
      addActivity({
        title: 'Student enrolled',
        detail: `${newStudent.fullName} admitted to ${newStudent.departmentCode} (Sem ${newStudent.semester})`,
        category: 'Students',
        iconType: 'student',
      })
    );
    addToast(`${newStudent.fullName} enrolled successfully!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (values) => {
    dispatch(updateStudent(values));
    dispatch(
      addActivity({
        title: 'Student updated',
        detail: `Updated student record for ${values.fullName}`,
        category: 'Students',
        iconType: 'edit',
      })
    );
    addToast(`Updated record for ${values.fullName}`, 'success');
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteStudent(deleteTarget.id));
      dispatch(
        addActivity({
          title: 'Student removed',
          detail: `${deleteTarget.name} record was deleted`,
          category: 'Students',
          iconType: 'trash',
        })
      );
      addToast(`Student ${deleteTarget.name} removed.`, 'info');
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.deptContainer}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">
            Manage student registrations, academic cohorts, and semesters
          </p>
        </div>

        <button
          type="button"
          className="btn-dark"
          onClick={() => setIsAddModalOpen(true)}
          style={{ padding: '10px 20px' }}
        >
          <Plus size={16} />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} color="var(--ink-soft)" />
          <input
            type="text"
            placeholder="Search students by name, ID or email..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            style={{ background: 'transparent', border: 'none', padding: 4, width: '100%', fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <PillDropdown
            value={departmentFilter}
            options={deptOptions}
            onChange={(val) => dispatch(setDepartmentFilter(val))}
          />
          <PillDropdown
            value={semesterFilter}
            options={semesterOptions}
            onChange={(val) => dispatch(setSemesterFilter(val))}
          />
          <PillDropdown
            value={statusFilter}
            options={statusOptions}
            onChange={(val) => dispatch(setStatusFilter(val))}
          />
          <PillDropdown
            value={sortBy}
            options={sortOptions}
            onChange={(val) => dispatch(setSortBy(val))}
          />
          <span className={styles.countPill}>
            {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
          </span>
        </div>
      </div>

      {/* Students List in Friends Score style */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No students found"
          subtext="No records matched the selected filters. Enroll a new student using the button above."
          icon={Users}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredStudents.map((student) => (
            <StudentRow
              key={student.id}
              {...student}
              onEdit={() => setEditingStudent(student)}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        maxWidth={580}
      >
        <StudentForm
          departments={departments}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student Record"
        maxWidth={580}
      >
        {editingStudent && (
          <StudentForm
            initialValues={editingStudent}
            departments={departments}
            onSubmit={handleEditSubmit}
            isEditMode={true}
            onCancel={() => setEditingStudent(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
