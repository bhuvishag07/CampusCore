import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '@/components/departments/Departments.module.css';

const courseValidationSchema = Yup.object({
  courseName: Yup.string().trim().min(3, 'At least 3 characters').required('Course name is required'),
  courseCode: Yup.string().trim().required('Course code is required'),
  departmentCode: Yup.string().required('Department is required'),
  credits: Yup.number().min(1).max(6).required('Credits required'),
  semester: Yup.number().min(1).max(8).required('Semester required'),
  description: Yup.string().trim().min(10, 'At least 10 characters').required('Description is required'),
  assignedFacultyId: Yup.string().nullable(),
});

export const CourseForm = ({
  initialValues,
  departments = [],
  faculty = [],
  onSubmit,
  isEditMode = false,
  onCancel,
}) => {
  const defaultInitialValues = useMemo(
    () => ({
      courseName: '',
      courseCode: 'CS' + Math.floor(200 + Math.random() * 700),
      departmentCode: '',
      credits: 4,
      semester: 4,
      description: '',
      assignedFacultyId: '',
    }),
    []
  );
  const formInitialValues = initialValues || defaultInitialValues;

  const formik = useFormik({
    initialValues: {
      ...formInitialValues,
      departmentCode: formInitialValues.departmentCode || (departments[0]?.code || 'CSE'),
    },
    enableReinitialize: true,
    validationSchema: courseValidationSchema,
    onSubmit: (values) => {
      const selectedFaculty = faculty.find((f) => f.id === values.assignedFacultyId);
      onSubmit({
        ...values,
        credits: Number(values.credits),
        semester: Number(values.semester),
        courseCode: values.courseCode.toUpperCase().trim(),
        assignedFacultyName: selectedFaculty ? selectedFaculty.fullName : '',
      });
    },
  });

  // Filter faculty members for chosen department
  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => f.departmentCode === formik.values.departmentCode);
  }, [faculty, formik.values.departmentCode]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Course Name *</label>
          <input
            name="courseName"
            type="text"
            placeholder="e.g. Distributed Systems"
            className={`${styles.inputField} ${
              formik.touched.courseName && formik.errors.courseName ? styles.inputError : ''
            }`}
            value={formik.values.courseName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Course Code *</label>
          <input
            name="courseCode"
            type="text"
            placeholder="e.g. CS401"
            className={`${styles.inputField} ${
              formik.touched.courseCode && formik.errors.courseCode ? styles.inputError : ''
            }`}
            value={formik.values.courseCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Department *</label>
          <select
            name="departmentCode"
            className={styles.inputField}
            value={formik.values.departmentCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {departments.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Semester (1-8) *</label>
          <input
            name="semester"
            type="number"
            min={1}
            max={8}
            className={styles.inputField}
            value={formik.values.semester}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Credits (1-6) *</label>
          <input
            name="credits"
            type="number"
            min={1}
            max={6}
            className={styles.inputField}
            value={formik.values.credits}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Assigned Faculty *</label>
        <select
          name="assignedFacultyId"
          className={styles.inputField}
          value={formik.values.assignedFacultyId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Department Instructor</option>
          {filteredFaculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fullName} ({f.designation})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Course Description & Syllabus Summary *</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Key concepts, prerequisites, laboratory modules..."
          className={`${styles.inputField} ${
            formik.touched.description && formik.errors.description ? styles.inputError : ''
          }`}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
        {onCancel && (
          <button type="button" className="btn-translucent" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-dark" style={{ padding: '10px 22px' }}>
          {isEditMode ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

CourseForm.propTypes = {
  initialValues: PropTypes.object,
  departments: PropTypes.array,
  faculty: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  onCancel: PropTypes.func,
};
