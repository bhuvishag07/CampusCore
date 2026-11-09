import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '@/components/departments/Departments.module.css';

const studentValidationSchema = Yup.object({
  fullName: Yup.string().trim().min(3, 'At least 3 characters').required('Full name is required'),
  studentId: Yup.string().trim().required('Student ID is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  departmentCode: Yup.string().required('Department is required'),
  academicYear: Yup.string().required('Academic year is required'),
  semester: Yup.number().min(1).max(8).required('Semester is required'),
  admissionDate: Yup.string().required('Admission date is required'),
  enrollmentStatus: Yup.string().oneOf(['Enrolled', 'On leave', 'Graduated']),
  gpa: Yup.number().min(0).max(4.0).nullable(),
});

export const StudentForm = ({
  initialValues,
  departments = [],
  onSubmit,
  isEditMode = false,
  onCancel,
}) => {
  const defaultInitialValues = useMemo(
    () => ({
      fullName: '',
      studentId: 'STU-2024-' + Math.floor(100 + Math.random() * 900),
      email: '',
      phone: '',
      departmentCode: '',
      academicYear: '2024-2025',
      semester: 2,
      admissionDate: new Date().toISOString().split('T')[0],
      enrollmentStatus: 'Enrolled',
      gpa: 3.8,
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
    validationSchema: studentValidationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        semester: Number(values.semester),
        gpa: values.gpa ? Number(values.gpa) : 3.5,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name *</label>
          <input
            name="fullName"
            type="text"
            placeholder="e.g. Anna Morgan"
            className={`${styles.inputField} ${
              formik.touched.fullName && formik.errors.fullName ? styles.inputError : ''
            }`}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Student ID *</label>
          <input
            name="studentId"
            type="text"
            className={`${styles.inputField} ${
              formik.touched.studentId && formik.errors.studentId ? styles.inputError : ''
            }`}
            value={formik.values.studentId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
          <label className={styles.label}>Enrollment Status *</label>
          <select
            name="enrollmentStatus"
            className={styles.inputField}
            value={formik.values.enrollmentStatus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Enrolled">Enrolled</option>
            <option value="On leave">On leave</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Academic Year *</label>
          <input
            name="academicYear"
            type="text"
            placeholder="2024-2025"
            className={styles.inputField}
            value={formik.values.academicYear}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
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
          <label className={styles.label}>GPA (0.0 - 4.0)</label>
          <input
            name="gpa"
            type="number"
            step="0.01"
            min={0}
            max={4.0}
            className={styles.inputField}
            value={formik.values.gpa}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address *</label>
          <input
            name="email"
            type="email"
            placeholder="student@collegehub.edu"
            className={styles.inputField}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number *</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 (555) 000-0000"
            className={styles.inputField}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Admission Date *</label>
        <input
          name="admissionDate"
          type="date"
          className={styles.inputField}
          value={formik.values.admissionDate}
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
          {isEditMode ? 'Update Student' : 'Enroll Student'}
        </button>
      </div>
    </form>
  );
};

StudentForm.propTypes = {
  initialValues: PropTypes.object,
  departments: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  onCancel: PropTypes.func,
};
