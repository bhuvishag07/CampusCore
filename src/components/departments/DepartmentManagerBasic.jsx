import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { DepartmentCard } from './DepartmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getTone } from '@/utils/tones';
import styles from './Departments.module.css';

/**
 * DepartmentManagerBasic
 * Directly implements Assignment Requirement 3:
 * "Use useState to store and manage department records.
 *  Provide Add Department and Delete Department functionality.
 *  Display all department records dynamically and show a message
 *  when no department records are available."
 */
export const DepartmentManagerBasic = () => {
  // Pure React useState to store department records
  const [departments, setDepartments] = useState([]);

  // Form input states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hod, setHod] = useState('');
  const [formError, setFormError] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !code.trim() || !hod.trim()) {
      setFormError('Please fill in all three required fields (Name, Code, and HOD).');
      return;
    }

    const normalizedCode = code.toUpperCase().trim();
    if (departments.some((d) => d.code === normalizedCode)) {
      setFormError(`Department code "${normalizedCode}" already exists.`);
      return;
    }

    const newDept = {
      id: 'basic-dept-' + Date.now(),
      name: name.trim(),
      code: normalizedCode,
      hod: hod.trim(),
      status: 'Active',
      establishedYear: new Date().getFullYear(),
      studentCount: 0,
      facultyCount: 0,
      courseCount: 0,
    };

    // Updating state with pure useState
    setDepartments((prev) => [newDept, ...prev]);

    // Reset inputs
    setName('');
    setCode('');
    setHod('');
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleSeedDemoRecords = () => {
    setDepartments([
      {
        id: 'seed-1',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        hod: 'Dr. Arvind Ramanathan',
        status: 'Active',
        establishedYear: 2004,
        studentCount: 120,
        facultyCount: 14,
        courseCount: 8,
      },
      {
        id: 'seed-2',
        name: 'Artificial Intelligence & Data Science',
        code: 'AIDS',
        hod: 'Dr. Priya Sundaram',
        status: 'Active',
        establishedYear: 2020,
        studentCount: 95,
        facultyCount: 10,
        courseCount: 6,
      },
    ]);
  };

  return (
    <div className={styles.deptContainer}>
      {/* Top Breadcrumb & Assignment Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link
            to="/departments"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--ink-soft)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            <ArrowLeft size={14} /> Back to Main Departments Module
          </Link>
          <h1 className="page-title">Assignment View (useState Demo)</h1>
          <p className="page-subtitle">
            Pure <code>useState</code> department management complying with college assignment requirements
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {departments.length === 0 ? (
            <button
              type="button"
              className="btn-translucent"
              onClick={handleSeedDemoRecords}
            >
              Load Demo Records
            </button>
          ) : (
            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => setDepartments([])}
            >
              Clear to View Empty State
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Form on Left, List on Right */}
      <div className={styles.twoColumnLayout}>
        {/* Left: Department Form with Name, Code, HOD */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Add Department</h3>
            <p className={styles.formSubtitle}>Enter academic division details</p>
          </div>

          <form onSubmit={handleAddDepartment}>
            {formError && (
              <div
                style={{
                  background: 'rgba(179, 38, 30, 0.1)',
                  color: 'var(--danger)',
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="basic-dept-name" className={styles.label}>
                Department Name *
              </label>
              <input
                id="basic-dept-name"
                type="text"
                placeholder="e.g. Mechanical Engineering"
                className={styles.inputField}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="basic-dept-code" className={styles.label}>
                Department Code *
              </label>
              <input
                id="basic-dept-code"
                type="text"
                placeholder="e.g. ME"
                className={styles.inputField}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="basic-dept-hod" className={styles.label}>
                HOD Name *
              </label>
              <input
                id="basic-dept-hod"
                type="text"
                placeholder="e.g. Dr. Vikram Malhotra"
                className={styles.inputField}
                value={hod}
                onChange={(e) => setHod(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-dark"
              style={{ width: '100%', marginTop: 8, padding: '12px 20px' }}
            >
              <PlusCircle size={16} />
              <span>Add Department</span>
            </button>
          </form>
        </div>

        {/* Right: Dynamic List and Word-for-Word Empty State */}
        <div className={styles.rightGridArea}>
          <div className={styles.filterBar}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
              Live Records (useState):
            </span>
            <span className={styles.countPill}>
              {departments.length} {departments.length === 1 ? 'department' : 'departments'}
            </span>
          </div>

          {departments.length === 0 ? (
            /* Word for word preserved empty state requirement */
            <EmptyState
              title="No department records available"
              subtext="Add your first department using the form."
              action={
                <button
                  type="button"
                  className="btn-dark"
                  onClick={handleSeedDemoRecords}
                  style={{ fontSize: 13 }}
                >
                  Load 2 Demo Records
                </button>
              }
            />
          ) : (
            <div className={styles.cardGrid}>
              {departments.map((dept, index) => (
                <DepartmentCard
                  key={dept.id}
                  id={dept.id}
                  name={dept.name}
                  code={dept.code}
                  hod={dept.hod}
                  status={dept.status}
                  establishedYear={dept.establishedYear}
                  studentCount={dept.studentCount}
                  facultyCount={dept.facultyCount}
                  courseCount={dept.courseCount}
                  tone={getTone(index)}
                  onDelete={(id, dName) => setDeleteTarget({ id, name: dName })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
