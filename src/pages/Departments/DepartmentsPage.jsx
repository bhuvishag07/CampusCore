import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/components/common/Toast';
import { getTone } from '@/utils/tones';
import { DepartmentCard } from '@/components/departments/DepartmentCard';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { PillDropdown } from '@/components/common/PillDropdown';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import styles from '@/components/departments/Departments.module.css';

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const sortOptions = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Code', value: 'code' },
  { label: 'Sort by Students', value: 'students' },
  { label: 'Sort by Year', value: 'year' },
];

export const DepartmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const {
    departments,
    filteredDepartments,
    searchQuery,
    statusFilter,
    sortBy,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    handleAddDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
  } = useDepartments();

  const { addToast } = useToast();

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync url search query if present on load
  React.useEffect(() => {
    if (initialSearch && initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const existingCodes = departments.map((d) => d.code);

  const onAddSubmit = (values) => {
    const newDept = {
      ...values,
      id: 'dept-' + Date.now(),
      facultyCount: 0,
      studentCount: 0,
      courseCount: 0,
    };
    handleAddDepartment(newDept);
    addToast(`Department "${newDept.name}" created successfully!`, 'success');
  };

  const onEditSubmit = (values) => {
    handleUpdateDepartment(values);
    setEditingDepartment(null);
    addToast(`Department "${values.name}" updated successfully!`, 'success');
  };

  const onConfirmDelete = () => {
    if (deleteTarget) {
      handleDeleteDepartment(deleteTarget.id, deleteTarget.name);
      addToast(`Department "${deleteTarget.name}" deleted.`, 'info');
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.deptContainer}>
      {/* Top Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">
            Manage academic divisions, curriculum standards, and leadership
          </p>
        </div>

        {/* Link to Assignment View */}
        <Link
          to="/departments/basic-demo"
          className="btn-translucent"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Sparkles size={14} color="var(--chart-purple)" />
          <span>Assignment View (useState)</span>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className={styles.twoColumnLayout}>
        {/* Left Column: Department Form */}
        <DepartmentForm
          existingCodes={existingCodes}
          onSubmit={onAddSubmit}
        />

        {/* Right Column: Cards Grid and Filter Bar */}
        <div className={styles.rightGridArea}>
          {/* Filter, Search & Count Bar */}
          <div className={styles.filterBar}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
              <Search size={16} color="var(--ink-soft)" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 4,
                  width: '100%',
                  fontSize: 13,
                }}
              />
            </div>

            {/* Filter and Sort Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PillDropdown
                value={statusFilter}
                options={statusOptions}
                onChange={setStatusFilter}
              />
              <PillDropdown
                value={sortBy}
                options={sortOptions}
                onChange={setSortBy}
              />
              <span className={styles.countPill}>
                {filteredDepartments.length}{' '}
                {filteredDepartments.length === 1 ? 'department' : 'departments'}
              </span>
            </div>
          </div>

          {/* Cards Grid / Empty State */}
          {filteredDepartments.length === 0 ? (
            <EmptyState
              title="No department records available"
              subtext="Add your first department using the form."
            />
          ) : (
            <div className={styles.cardGrid}>
              {filteredDepartments.map((dept, idx) => (
                <DepartmentCard
                  key={dept.id}
                  id={dept.id}
                  name={dept.name}
                  code={dept.code}
                  hod={dept.hod}
                  description={dept.description}
                  establishedYear={dept.establishedYear}
                  status={dept.status}
                  facultyCount={dept.facultyCount}
                  studentCount={dept.studentCount}
                  courseCount={dept.courseCount}
                  tone={getTone(idx)}
                  onEdit={() => setEditingDepartment(dept)}
                  onDelete={() => setDeleteTarget(dept)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Department Modal */}
      <Modal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title="Edit Department"
        maxWidth={520}
      >
        {editingDepartment && (
          <DepartmentForm
            initialValues={editingDepartment}
            existingCodes={existingCodes}
            onSubmit={onEditSubmit}
            isEditMode={true}
            onCancel={() => setEditingDepartment(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog with Relationship Integrity Warning */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Department"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}" (${deleteTarget.code})? It currently has ${deleteTarget.studentCount || 0} enrolled students, ${deleteTarget.facultyCount || 0} faculty, and ${deleteTarget.courseCount || 0} courses. All associated links will be safely detached.`
            : 'Are you sure you want to delete this department?'
        }
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
