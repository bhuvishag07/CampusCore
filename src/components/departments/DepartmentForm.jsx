import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, ChevronUp, PlusCircle, Check } from 'lucide-react';
import styles from './Departments.module.css';

const departmentValidationSchema = (existingCodes = [], currentCode = '') =>
  Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Department name must be at least 3 characters')
      .required('Department name is required'),
    code: Yup.string()
      .trim()
      .min(2, 'Code must be at least 2 characters')
      .max(8, 'Code must be at most 8 characters')
      .matches(/^[A-Za-z0-9]+$/, 'Code must be alphanumeric')
      .test('unique-code', 'Department code already exists', function (val) {
        if (!val) return true;
        const normalized = val.toUpperCase().trim();
        if (currentCode && normalized === currentCode.toUpperCase().trim()) {
          return true;
        }
        return !existingCodes.includes(normalized);
      })
      .required('Department code is required'),
    hod: Yup.string()
      .trim()
      .min(3, 'HOD name must be at least 3 characters')
      .required('HOD name is required'),
    description: Yup.string().trim(),
    establishedYear: Yup.number()
      .min(1900, 'Year must be after 1900')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .nullable(),
    email: Yup.string().email('Invalid email address').nullable(),
    contactNumber: Yup.string().nullable(),
    status: Yup.string().oneOf(['Active', 'Inactive']),
  });

export const DepartmentForm = ({
  initialValues = {
    name: '',
    code: '',
    hod: '',
    description: '',
    establishedYear: new Date().getFullYear(),
    email: '',
    contactNumber: '',
    status: 'Active',
  },
  existingCodes = [],
  onSubmit,
  isEditMode = false,
  onCancel,
}) => {
  const [showMore, setShowMore] = useState(isEditMode);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: departmentValidationSchema(
      existingCodes,
      isEditMode ? initialValues.code : ''
    ),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
        code: values.code.toUpperCase().trim(),
        establishedYear: Number(values.establishedYear) || 2024,
      };
      onSubmit(payload);
      if (!isEditMode) {
        resetForm();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.formPanel}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {isEditMode ? 'Edit Department' : 'Add Department'}
        </h3>
        <p className={styles.formSubtitle}>
          {isEditMode
            ? 'Update academic division records'
            : 'Register a new department in CampusCore'}
        </p>
      </div>

      {/* 1. Department Name (Required) */}
      <div className={styles.formGroup}>
        <label htmlFor="dept-name" className={styles.label}>
          Department Name *
        </label>
        <input
          id="dept-name"
          name="name"
          type="text"
          placeholder="e.g. Computer Science & Engineering"
          className={`${styles.inputField} ${
            formik.touched.name && formik.errors.name ? styles.inputError : ''
          }`}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <span className={styles.errorMessage}>{formik.errors.name}</span>
        )}
      </div>

      {/* 2. Department Code (Required) */}
      <div className={styles.formGroup}>
        <label htmlFor="dept-code" className={styles.label}>
          Department Code *
        </label>
        <input
          id="dept-code"
          name="code"
          type="text"
          placeholder="e.g. CSE"
          className={`${styles.inputField} ${
            formik.touched.code && formik.errors.code ? styles.inputError : ''
          }`}
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.code && formik.errors.code && (
          <span className={styles.errorMessage}>{formik.errors.code}</span>
        )}
      </div>

      {/* 3. HOD Name (Required) */}
      <div className={styles.formGroup}>
        <label htmlFor="dept-hod" className={styles.label}>
          Head of Department (HOD) *
        </label>
        <input
          id="dept-hod"
          name="hod"
          type="text"
          placeholder="e.g. Dr. Arvind Ramanathan"
          className={`${styles.inputField} ${
            formik.touched.hod && formik.errors.hod ? styles.inputError : ''
          }`}
          value={formik.values.hod}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.hod && formik.errors.hod && (
          <span className={styles.errorMessage}>{formik.errors.hod}</span>
        )}
      </div>

      {/* Collapsible More Details Toggle */}
      <button
        type="button"
        className={styles.collapsibleToggle}
        onClick={() => setShowMore((prev) => !prev)}
      >
        <span>{showMore ? 'Fewer details' : 'More details (optional)'}</span>
        {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Additional Collapsible Fields */}
      {showMore && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.formGroup}>
            <label htmlFor="dept-desc" className={styles.label}>
              Description
            </label>
            <textarea
              id="dept-desc"
              name="description"
              rows={3}
              placeholder="Brief overview of curriculum and specializations..."
              className={styles.inputField}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className={styles.formGroup}>
              <label htmlFor="dept-year" className={styles.label}>
                Established Year
              </label>
              <input
                id="dept-year"
                name="establishedYear"
                type="number"
                className={styles.inputField}
                value={formik.values.establishedYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dept-status" className={styles.label}>
                Status
              </label>
              <select
                id="dept-status"
                name="status"
                className={styles.inputField}
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dept-email" className={styles.label}>
              Official Email
            </label>
            <input
              id="dept-email"
              name="email"
              type="email"
              placeholder="hod.dept@collegehub.edu"
              className={styles.inputField}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className={styles.errorMessage}>{formik.errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dept-phone" className={styles.label}>
              Contact Number
            </label>
            <input
              id="dept-phone"
              name="contactNumber"
              type="text"
              placeholder="+1 (555) 019-0000"
              className={styles.inputField}
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        {isEditMode && onCancel && (
          <button
            type="button"
            className="btn-translucent"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-dark"
          style={{ flex: 1, padding: '12px 20px' }}
        >
          {isEditMode ? <Check size={16} /> : <PlusCircle size={16} />}
          <span>{isEditMode ? 'Update Department' : 'Add Department'}</span>
        </button>
      </div>
    </form>
  );
};

DepartmentForm.propTypes = {
  initialValues: PropTypes.object,
  existingCodes: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  onCancel: PropTypes.func,
};
