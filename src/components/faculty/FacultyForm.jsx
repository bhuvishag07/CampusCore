import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '@/components/departments/Departments.module.css';

const designations = [
  'Professor & HOD',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
];

const facultyValidationSchema = Yup.object({
  fullName: Yup.string().trim().min(3, 'At least 3 characters').required('Full name is required'),
  facultyId: Yup.string().trim().required('Faculty ID is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  designation: Yup.string().required('Designation is required'),
  departmentCode: Yup.string().required('Department is required'),
  specialization: Yup.string().required('Specialization is required'),
  joiningDate: Yup.string().required('Joining date is required'),
});

export const FacultyForm = ({
  initialValues,
  departments = [],
  onSubmit,
  isEditMode = false,
  onCancel,
}) => {
  const defaultInitialValues = useMemo(
    () => ({
      fullName: '',
      facultyId: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
      email: '',
      phone: '',
      designation: 'Assistant Professor',
      departmentCode: '',
      specialization: '',
      joiningDate: new Date().toISOString().split('T')[0],
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
    validationSchema: facultyValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
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
            placeholder="e.g. Dr. Ananya Sen"
            className={`${styles.inputField} ${
              formik.touched.fullName && formik.errors.fullName ? styles.inputError : ''
            }`}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <span className={styles.errorMessage}>{formik.errors.fullName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Faculty ID *</label>
          <input
            name="facultyId"
            type="text"
            className={`${styles.inputField} ${
              formik.touched.facultyId && formik.errors.facultyId ? styles.inputError : ''
            }`}
            value={formik.values.facultyId}
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
          <label className={styles.label}>Designation *</label>
          <select
            name="designation"
            className={styles.inputField}
            value={formik.values.designation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {designations.map((des) => (
              <option key={des} value={des}>
                {des}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Specialization *</label>
        <input
          name="specialization"
          type="text"
          placeholder="e.g. Distributed Systems & Cloud Infrastructure"
          className={`${styles.inputField} ${
            formik.touched.specialization && formik.errors.specialization ? styles.inputError : ''
          }`}
          value={formik.values.specialization}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.specialization && formik.errors.specialization && (
          <span className={styles.errorMessage}>{formik.errors.specialization}</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Official Email *</label>
          <input
            name="email"
            type="email"
            placeholder="faculty@collegehub.edu"
            className={`${styles.inputField} ${
              formik.touched.email && formik.errors.email ? styles.inputError : ''
            }`}
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
            className={`${styles.inputField} ${
              formik.touched.phone && formik.errors.phone ? styles.inputError : ''
            }`}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Joining Date *</label>
        <input
          name="joiningDate"
          type="date"
          className={styles.inputField}
          value={formik.values.joiningDate}
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
          {isEditMode ? 'Update Faculty' : 'Register Faculty'}
        </button>
      </div>
    </form>
  );
};

FacultyForm.propTypes = {
  initialValues: PropTypes.object,
  departments: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  onCancel: PropTypes.func,
};
