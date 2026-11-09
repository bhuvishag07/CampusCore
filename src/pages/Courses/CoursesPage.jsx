import React, { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, Layers } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addCourse,
  updateCourse,
  deleteCourse,
  setSearchQuery,
  setDepartmentFilter,
  setSemesterFilter,
  setSortBy,
} from '@/redux/slices/courseSlice';
import { addActivity } from '@/redux/slices/activitySlice';
import { useToast } from '@/components/common/Toast';
import { getTone } from '@/utils/tones';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseForm } from '@/components/courses/CourseForm';
import { PillDropdown } from '@/components/common/PillDropdown';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import styles from '@/components/departments/Departments.module.css';

const semesterOptions = [
  { label: 'All Semesters', value: 'All' },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ label: `Semester ${s}`, value: s })),
];

const sortOptions = [
  { label: 'Sort by Code', value: 'code' },
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Credits', value: 'credits' },
  { label: 'Sort by Semester', value: 'semester' },
];

export const CoursesPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const {
    items: coursesList,
    searchQuery,
    departmentFilter,
    semesterFilter,
    sortBy,
  } = useAppSelector((state) => state.courses);

  const departments = useAppSelector((state) => state.departments.items);
  const faculty = useAppSelector((state) => state.faculty.items);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deptOptions = [
    { label: 'All Departments', value: 'All' },
    ...departments.map((d) => ({ label: `${d.code} - ${d.name}`, value: d.code })),
  ];

  // Filtered & sorted courses
  const filteredCourses = useMemo(() => {
    return coursesList
      .filter((crs) => {
        const matchesSearch =
          crs.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crs.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crs.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept =
          departmentFilter === 'All' ? true : crs.departmentCode === departmentFilter;
        const matchesSem =
          semesterFilter === 'All' ? true : crs.semester === Number(semesterFilter);

        return matchesSearch && matchesDept && matchesSem;
      })
      .sort((a, b) => {
        if (sortBy === 'code') return a.courseCode.localeCompare(b.courseCode);
        if (sortBy === 'name') return a.courseName.localeCompare(b.courseName);
        if (sortBy === 'credits') return b.credits - a.credits;
        if (sortBy === 'semester') return a.semester - b.semester;
        return 0;
      });
  }, [coursesList, searchQuery, departmentFilter, semesterFilter, sortBy]);

  const handleAddSubmit = (values) => {
    const newCourse = {
      ...values,
      id: 'course-' + Date.now(),
      courseId: 'CRS-' + values.courseCode,
    };
    dispatch(addCourse(newCourse));
    dispatch(
      addActivity({
        title: 'Course created',
        detail: `${newCourse.courseCode}: ${newCourse.courseName} added to ${newCourse.departmentCode}`,
        category: 'Courses',
        iconType: 'book',
      })
    );
    addToast(`Course ${newCourse.courseCode} added successfully!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (values) => {
    dispatch(updateCourse(values));
    dispatch(
      addActivity({
        title: 'Course updated',
        detail: `Updated course syllabus for ${values.courseCode}`,
        category: 'Courses',
        iconType: 'edit',
      })
    );
    addToast(`Updated ${values.courseCode}`, 'success');
    setEditingCourse(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteCourse(deleteTarget.id));
      dispatch(
        addActivity({
          title: 'Course deleted',
          detail: `${deleteTarget.name} removed from curriculum`,
          category: 'Courses',
          iconType: 'trash',
        })
      );
      addToast(`Course ${deleteTarget.name} deleted.`, 'info');
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.deptContainer}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">
            Accredited course curriculum, credits, and faculty allocations
          </p>
        </div>

        <button
          type="button"
          className="btn-dark"
          onClick={() => setIsAddModalOpen(true)}
          style={{ padding: '10px 20px' }}
        >
          <Plus size={16} />
          <span>Add Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} color="var(--ink-soft)" />
          <input
            type="text"
            placeholder="Search courses by title, code or topics..."
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
            value={sortBy}
            options={sortOptions}
            onChange={(val) => dispatch(setSortBy(val))}
          />
          <span className={styles.countPill}>
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </span>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          subtext="No records matched the selected filters. Add a new degree course using the button above."
          icon={BookOpen}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filteredCourses.map((crs, idx) => (
            <CourseCard
              key={crs.id}
              {...crs}
              tone={getTone(idx)}
              onEdit={() => setEditingCourse(crs)}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Degree Course"
        maxWidth={580}
      >
        <CourseForm
          departments={departments}
          faculty={faculty}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title="Edit Course Details"
        maxWidth={580}
      >
        {editingCourse && (
          <CourseForm
            initialValues={editingCourse}
            departments={departments}
            faculty={faculty}
            onSubmit={handleEditSubmit}
            isEditMode={true}
            onCancel={() => setEditingCourse(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Course"
        message={`Are you sure you want to remove ${deleteTarget?.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
