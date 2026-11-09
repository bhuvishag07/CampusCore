import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, GraduationCap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  setSearchQuery,
  setDepartmentFilter,
  setDesignationFilter,
  setSortBy,
} from '@/redux/slices/facultySlice';
import { addActivity } from '@/redux/slices/activitySlice';
import { useToast } from '@/components/common/Toast';
import { getTone } from '@/utils/tones';
import { FacultyCard } from '@/components/faculty/FacultyCard';
import { FacultyForm } from '@/components/faculty/FacultyForm';
import { PillDropdown } from '@/components/common/PillDropdown';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import styles from '@/components/departments/Departments.module.css';

const sortOptions = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Designation', value: 'designation' },
  { label: 'Sort by Joining Date', value: 'joiningDate' },
];

export const FacultyPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const {
    items: facultyList,
    searchQuery,
    departmentFilter,
    designationFilter,
    sortBy,
  } = useAppSelector((state) => state.faculty);

  const departments = useAppSelector((state) => state.departments.items);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deptOptions = [
    { label: 'All Departments', value: 'All' },
    ...departments.map((d) => ({ label: `${d.code} - ${d.name}`, value: d.code })),
  ];

  const designationOptions = [
    { label: 'All Designations', value: 'All' },
    { label: 'Professor & HOD', value: 'Professor & HOD' },
    { label: 'Professor', value: 'Professor' },
    { label: 'Associate Professor', value: 'Associate Professor' },
    { label: 'Assistant Professor', value: 'Assistant Professor' },
  ];

  // Derived filtered & sorted faculty
  const filteredFaculty = useMemo(() => {
    return facultyList
      .filter((fac) => {
        const matchesSearch =
          fac.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fac.facultyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fac.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept =
          departmentFilter === 'All' ? true : fac.departmentCode === departmentFilter;
        const matchesDesig =
          designationFilter === 'All' ? true : fac.designation === designationFilter;

        return matchesSearch && matchesDept && matchesDesig;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'designation') return a.designation.localeCompare(b.designation);
        if (sortBy === 'joiningDate') return b.joiningDate.localeCompare(a.joiningDate);
        return 0;
      });
  }, [facultyList, searchQuery, departmentFilter, designationFilter, sortBy]);

  const handleAddSubmit = (values) => {
    const newFaculty = { ...values, id: 'fac-' + Date.now() };
    dispatch(addFaculty(newFaculty));
    dispatch(
      addActivity({
        title: 'Faculty registered',
        detail: `${newFaculty.fullName} joined ${newFaculty.departmentCode} as ${newFaculty.designation}`,
        category: 'Faculty',
        iconType: 'faculty',
      })
    );
    addToast(`${newFaculty.fullName} has been registered successfully!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (values) => {
    dispatch(updateFaculty(values));
    dispatch(
      addActivity({
        title: 'Faculty updated',
        detail: `Updated records for ${values.fullName}`,
        category: 'Faculty',
        iconType: 'edit',
      })
    );
    addToast(`Updated ${values.fullName}`, 'success');
    setEditingFaculty(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteFaculty(deleteTarget.id));
      dispatch(
        addActivity({
          title: 'Faculty removed',
          detail: `${deleteTarget.name} record was removed`,
          category: 'Faculty',
          iconType: 'trash',
        })
      );
      addToast(`Faculty ${deleteTarget.name} removed.`, 'info');
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.deptContainer}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Faculty</h1>
          <p className="page-subtitle">
            Manage academic instructors, professors, and research guides
          </p>
        </div>

        <button
          type="button"
          className="btn-dark"
          onClick={() => setIsAddModalOpen(true)}
          style={{ padding: '10px 20px' }}
        >
          <Plus size={16} />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} color="var(--ink-soft)" />
          <input
            type="text"
            placeholder="Search faculty by name, ID or specialization..."
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
            value={designationFilter}
            options={designationOptions}
            onChange={(val) => dispatch(setDesignationFilter(val))}
          />
          <PillDropdown
            value={sortBy}
            options={sortOptions}
            onChange={(val) => dispatch(setSortBy(val))}
          />
          <span className={styles.countPill}>
            {filteredFaculty.length} {filteredFaculty.length === 1 ? 'member' : 'faculty'}
          </span>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <EmptyState
          title="No faculty members found"
          subtext="No records matched the selected filters. Register a new faculty member using the button above."
          icon={GraduationCap}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredFaculty.map((fac, idx) => (
            <FacultyCard
              key={fac.id}
              {...fac}
              tone={getTone(idx)}
              onEdit={() => setEditingFaculty(fac)}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Faculty Member"
        maxWidth={580}
      >
        <FacultyForm
          departments={departments}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        isOpen={!!editingFaculty}
        onClose={() => setEditingFaculty(null)}
        title="Edit Faculty Member"
        maxWidth={580}
      >
        {editingFaculty && (
          <FacultyForm
            initialValues={editingFaculty}
            departments={departments}
            onSubmit={handleEditSubmit}
            isEditMode={true}
            onCancel={() => setEditingFaculty(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Faculty Member"
        message={`Are you sure you want to remove ${deleteTarget?.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
