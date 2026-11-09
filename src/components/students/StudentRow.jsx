import React from 'react';
import PropTypes from 'prop-types';
import { Mail, Phone, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { StatusPill } from '@/components/common/StatusPill';
import styles from '@/components/dashboard/Dashboard.module.css';

export const StudentRow = ({
  id,
  studentId,
  fullName,
  email,
  phone,
  departmentCode,
  semester,
  admissionDate,
  enrollmentStatus,
  gpa,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={styles.leaderboardRow}
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 16,
        padding: '14px 18px',
        margin: '6px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar name={fullName} size={42} fontSize={14} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
              {fullName}
            </h4>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 999,
                backgroundColor: '#ffffff',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {departmentCode}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 12,
              color: 'var(--ink-soft)',
              marginTop: 4,
            }}
          >
            <span>ID: {studentId}</span>
            <span>•</span>
            <span>Sem {semester}</span>
            <span>•</span>
            <span>Admitted {admissionDate}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* GPA display */}
        {gpa && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
              {gpa.toFixed(2)}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--ink-soft)',
                textTransform: 'uppercase',
              }}
            >
              GPA
            </span>
          </div>
        )}

        {/* Status Pill */}
        <StatusPill status={enrollmentStatus} />

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onEdit && (
            <button
              type="button"
              className="btn-translucent"
              onClick={() => onEdit(id)}
              style={{ padding: '6px 10px' }}
              title="Edit Student"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => onDelete(id, fullName)}
              style={{ padding: '6px 10px' }}
              title="Delete Student"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

StudentRow.propTypes = {
  id: PropTypes.string.isRequired,
  studentId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  departmentCode: PropTypes.string.isRequired,
  semester: PropTypes.number.isRequired,
  admissionDate: PropTypes.string.isRequired,
  enrollmentStatus: PropTypes.string.isRequired,
  gpa: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
