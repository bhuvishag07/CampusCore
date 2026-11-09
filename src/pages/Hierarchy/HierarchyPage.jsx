import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  GitBranch,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Award,
  Shield,
  Edit2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateFaculty } from '@/redux/slices/facultySlice';
import { updateDepartment } from '@/redux/slices/departmentSlice';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/components/common/Toast';
import styles from '@/components/hierarchy/Hierarchy.module.css';

// Ranking order for hierarchical structure
const HIERARCHY_LEVELS = [
  { key: 'HOD', label: 'Head of Department (HOD)', designations: ['Professor & HOD'] },
  { key: 'PROF', label: 'Professors', designations: ['Professor'] },
  { key: 'ASSOC', label: 'Associate Professors', designations: ['Associate Professor'] },
  { key: 'ASST', label: 'Assistant Professors', designations: ['Assistant Professor'] },
  { key: 'LECT', label: 'Lecturers & Tutors', designations: ['Lecturer', 'Adjunct Faculty'] },
];

const ALL_DESIGNATIONS = [
  'Professor & HOD',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
];

export const HierarchyPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const departments = useAppSelector((state) => state.departments.items);
  const allFaculty = useAppSelector((state) => state.faculty.items);

  // Selected department code (default to first department)
  const [selectedDeptCode, setSelectedDeptCode] = useState(
    departments[0]?.code || 'CSE'
  );

  // Profile modal state
  const [selectedProfileFaculty, setSelectedProfileFaculty] = useState(null);

  // Edit designation modal state
  const [editModalFaculty, setEditModalFaculty] = useState(null);
  const [newDesignation, setNewDesignation] = useState('');

  // Selected department details
  const activeDepartment = useMemo(() => {
    return departments.find((d) => d.code === selectedDeptCode) || departments[0];
  }, [departments, selectedDeptCode]);

  // Faculty filtered by selected department
  const deptFaculty = useMemo(() => {
    return allFaculty.filter((f) => f.departmentCode === selectedDeptCode);
  }, [allFaculty, selectedDeptCode]);

  // Group faculty by hierarchy tiers
  const hierarchyGroups = useMemo(() => {
    return HIERARCHY_LEVELS.map((level) => {
      const members = deptFaculty.filter((f) =>
        level.designations.includes(f.designation)
      );
      return {
        ...level,
        members,
      };
    }).filter((group) => group.members.length > 0);
  }, [deptFaculty]);

  // Handle designation update
  const handleSaveDesignation = (e) => {
    e.preventDefault();
    if (!editModalFaculty || !newDesignation) return;

    const updated = {
      ...editModalFaculty,
      designation: newDesignation,
    };

    dispatch(updateFaculty(updated));

    // If promoted to HOD, update department record HOD name
    if (newDesignation === 'Professor & HOD' && activeDepartment) {
      dispatch(
        updateDepartment({
          ...activeDepartment,
          hod: updated.fullName,
        })
      );
    }

    addToast(
      `Updated ${editModalFaculty.fullName}'s designation to ${newDesignation}.`,
      'success'
    );
    setEditModalFaculty(null);
  };

  return (
    <div className={styles.hierarchyContainer}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className="page-title">Department Hierarchy</h1>
          <p className="page-subtitle">
            Visual organisational reporting chart, faculty leadership roles, and academic structure.
          </p>
        </div>
      </div>

      {/* ── Department Selector ── */}
      <div className={styles.deptSelector}>
        <span className={styles.deptSelectorLabel}>Select Department:</span>
        {departments.map((dept) => {
          const isActive = dept.code === selectedDeptCode;
          return (
            <button
              key={dept.id}
              type="button"
              className={`${styles.deptPill} ${isActive ? styles.deptPillActive : ''}`}
              onClick={() => setSelectedDeptCode(dept.code)}
            >
              <Building2 size={13} />
              <span>{dept.code}</span>
            </button>
          );
        })}
      </div>

      {/* ── Department Quick Stats Bar ── */}
      {activeDepartment && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Department</span>
            <span className={styles.statValue}>{activeDepartment.name}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Head of Department (HOD)</span>
            <span className={styles.statValue}>
              {activeDepartment.hod || 'Unassigned'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Faculty</span>
            <span className={styles.statValue}>{deptFaculty.length} Members</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Established</span>
            <span className={styles.statValue}>
              Year {activeDepartment.establishedYear || 'N/A'}
            </span>
          </div>
        </div>
      )}

      {/* ── Management Info Bar ── */}
      <div className={styles.managementBar}>
        <div className={styles.managementBarInfo}>
          <div className={styles.managementBarDot} />
          <span>
            Showing verified reporting structure for <strong>{activeDepartment?.name}</strong>.
            Click any member card to view detailed dossier or modify administrative role.
          </span>
        </div>
      </div>

      {/* ── Tree / Org-Chart Canvas ── */}
      {deptFaculty.length === 0 ? (
        <EmptyState
          title="No faculty assigned to this department"
          subtext="Add faculty members in the Faculty module or switch to another department."
        />
      ) : (
        <div className={styles.treeContainer}>
          <div className={styles.treeContainerTitle}>
            Organisational Reporting Tree — {selectedDeptCode}
          </div>

          {hierarchyGroups.map((group, groupIdx) => {
            const isLastGroup = groupIdx === hierarchyGroups.length - 1;

            return (
              <React.Fragment key={group.key}>
                {/* Level Tier */}
                <div className={styles.treeLevel}>
                  <div className={styles.treeLevelLabel}>
                    <Shield size={12} />
                    <span>{group.label}</span>
                  </div>

                  <div className={styles.nodeRow}>
                    {group.members.map((faculty) => {
                      const isHOD = faculty.designation.includes('HOD');

                      return (
                        <div key={faculty.id} className={styles.treeNode}>
                          <div
                            className={`${styles.treeNodeCard} ${
                              isHOD ? styles.treeNodeCardHOD : ''
                            }`}
                            onClick={() => setSelectedProfileFaculty(faculty)}
                            title="Click to view full dossier"
                          >
                            <Avatar
                              name={faculty.fullName}
                              size={48}
                              className={styles.nodeAvatar}
                            />
                            <div className={styles.nodeName}>{faculty.fullName}</div>
                            <div className={styles.nodeDesignation}>
                              {faculty.designation}
                            </div>
                            <div className={styles.nodeFacultyId}>
                              {faculty.facultyId}
                            </div>
                            {faculty.specialization && (
                              <div className={styles.nodeSpecialization}>
                                <Award size={11} />
                                {faculty.specialization}
                              </div>
                            )}

                            {faculty.email && (
                              <div className={styles.nodeContact}>
                                <Mail size={11} />
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 170 }}>
                                  {faculty.email}
                                </span>
                              </div>
                            )}

                            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                className="btn-translucent"
                                style={{ padding: '3px 8px', fontSize: 11 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditModalFaculty(faculty);
                                  setNewDesignation(faculty.designation);
                                }}
                              >
                                <Edit2 size={10} style={{ marginRight: 3 }} />
                                Role
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Connector line between tiers */}
                {!isLastGroup && (
                  <div className={styles.connector} style={{ margin: '14px 0' }}>
                    <div className={styles.connectorVertical} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── Profile Dossier Modal ── */}
      <Modal
        isOpen={!!selectedProfileFaculty}
        onClose={() => setSelectedProfileFaculty(null)}
        title="Faculty Academic Dossier"
        maxWidth={520}
      >
        {selectedProfileFaculty && (
          <div className={styles.profilePanel}>
            <div className={styles.profileHeader}>
              <Avatar name={selectedProfileFaculty.fullName} size={64} />
              <div className={styles.profileHeaderInfo}>
                <div className={styles.profileName}>
                  {selectedProfileFaculty.fullName}
                </div>
                <div className={styles.profileDesignation}>
                  {selectedProfileFaculty.designation}
                </div>
                <div className={styles.profileDept}>
                  Department of {selectedProfileFaculty.departmentCode}
                </div>
              </div>
            </div>

            <div className={styles.profileGrid}>
              <div className={styles.profileField}>
                <span className={styles.profileFieldLabel}>
                  <User size={12} /> Faculty ID
                </span>
                <span className={styles.profileFieldValue}>
                  {selectedProfileFaculty.facultyId}
                </span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.profileFieldLabel}>
                  <Calendar size={12} /> Appointment Date
                </span>
                <span className={styles.profileFieldValue}>
                  {selectedProfileFaculty.joiningDate || 'N/A'}
                </span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.profileFieldLabel}>
                  <Mail size={12} /> Email
                </span>
                <span className={styles.profileFieldValue}>
                  {selectedProfileFaculty.email || 'N/A'}
                </span>
              </div>

              <div className={styles.profileField}>
                <span className={styles.profileFieldLabel}>
                  <Phone size={12} /> Contact
                </span>
                <span className={styles.profileFieldValue}>
                  {selectedProfileFaculty.phone || 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <span className={styles.profileFieldLabel} style={{ marginBottom: 6 }}>
                <Award size={12} /> Primary Academic Domain
              </span>
              <div className={styles.profileSpecChip}>
                {selectedProfileFaculty.specialization || 'General Engineering'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                type="button"
                className="btn-dark"
                onClick={() => setSelectedProfileFaculty(null)}
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Designation / Assign HOD Modal ── */}
      <Modal
        isOpen={!!editModalFaculty}
        onClose={() => setEditModalFaculty(null)}
        title="Modify Academic Hierarchy Role"
        maxWidth={460}
      >
        {editModalFaculty && (
          <form onSubmit={handleSaveDesignation} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Update organizational role and reporting tier for{' '}
              <strong>{editModalFaculty.fullName}</strong>.
            </p>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>
                Designation / Title
              </label>
              <select
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--field)',
                  border: '2px solid transparent',
                  color: 'var(--ink)',
                  outline: 'none',
                }}
              >
                {ALL_DESIGNATIONS.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>

            {newDesignation === 'Professor & HOD' && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(143, 132, 232, 0.15)',
                  color: 'var(--ink)',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
                Setting designation to <strong>Professor & HOD</strong> will automatically update the department leadership record for {selectedDeptCode}.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                className="btn-translucent"
                onClick={() => setEditModalFaculty(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Save Hierarchy Role
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
