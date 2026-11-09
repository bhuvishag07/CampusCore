import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setSearchQuery,
  setStatusFilter,
  setSortBy,
} from '@/redux/slices/departmentSlice';
import { addActivity } from '@/redux/slices/activitySlice';
import { addNotification } from '@/redux/slices/notificationSlice';
import { Department } from '@/types';

export function useDepartments() {
  const dispatch = useAppDispatch();
  const { items, searchQuery, statusFilter, sortBy, status, error } = useAppSelector(
    (state) => state.departments
  );
  const faculty = useAppSelector((state) => state.faculty.items);
  const students = useAppSelector((state) => state.students.items);
  const courses = useAppSelector((state) => state.courses.items);

  // Compute live associated counts for each department
  const enrichedDepartments = useMemo(() => {
    return items.map((dept) => {
      const dFaculty = faculty.filter((f) => f.departmentCode === dept.code).length;
      const dStudents = students.filter((s) => s.departmentCode === dept.code).length;
      const dCourses = courses.filter((c) => c.departmentCode === dept.code).length;

      return {
        ...dept,
        facultyCount: dFaculty,
        studentCount: dStudents,
        courseCount: dCourses,
      };
    });
  }, [items, faculty, students, courses]);

  // Filtered and sorted departments
  const filteredDepartments = useMemo(() => {
    return enrichedDepartments
      .filter((dept) => {
        const matchesSearch =
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.hod.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'All' ? true : dept.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'code') return a.code.localeCompare(b.code);
        if (sortBy === 'students') return (b.studentCount || 0) - (a.studentCount || 0);
        if (sortBy === 'year') return b.establishedYear - a.establishedYear;
        return 0;
      });
  }, [enrichedDepartments, searchQuery, statusFilter, sortBy]);

  const handleAdd = (dept: Department) => {
    dispatch(addDepartment(dept));
    dispatch(
      addActivity({
        title: 'Department added',
        detail: `${dept.name} (${dept.code}) registered with HOD ${dept.hod}`,
        category: 'Departments',
        iconType: 'building',
      })
    );
    dispatch(
      addNotification({
        title: 'New Department Created',
        message: `${dept.name} (${dept.code}) has been added to academic records.`,
        category: 'Departments',
      })
    );
  };

  const handleUpdate = (dept: Department) => {
    dispatch(updateDepartment(dept));
    dispatch(
      addActivity({
        title: 'Department updated',
        detail: `Updated details for ${dept.code} - ${dept.name}`,
        category: 'Departments',
        iconType: 'edit',
      })
    );
  };

  const handleDelete = (id: string, name: string) => {
    dispatch(deleteDepartment(id));
    dispatch(
      addActivity({
        title: 'Department removed',
        detail: `${name} record was removed from portal`,
        category: 'Departments',
        iconType: 'trash',
      })
    );
    dispatch(
      addNotification({
        title: 'Department Removed',
        message: `${name} was deleted.`,
        category: 'Departments',
      })
    );
  };

  return {
    departments: enrichedDepartments,
    filteredDepartments,
    searchQuery,
    statusFilter,
    sortBy,
    status,
    error,
    setSearchQuery: (q: string) => dispatch(setSearchQuery(q)),
    setStatusFilter: (s: any) => dispatch(setStatusFilter(s)),
    setSortBy: (sb: any) => dispatch(setSortBy(sb)),
    handleAddDepartment: handleAdd,
    handleUpdateDepartment: handleUpdate,
    handleDeleteDepartment: handleDelete,
  };
}
