import React from 'react';
import PropTypes from 'prop-types';
import { Mail, Phone, Calendar, BookOpen, Trash2, Edit2 } from 'lucide-react';
import { ToneCardWrapper } from '@/styles/styledComponents';
import { Avatar } from '@/components/common/Avatar';

export const FacultyCard = ({
  id,
  facultyId,
  fullName,
  email,
  phone,
  designation,
  departmentCode,
  specialization,
  joiningDate,
  tone = 1,
  onEdit,
  onDelete,
}) => {
  return (
    <ToneCardWrapper $tone={tone} style={{ minHeight: 210 }}>
      {/* Top Header: Dept code pill & ID */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span
          style={{
            backgroundColor: '#ffffff',
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ink)',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          {departmentCode}
        </span>
        <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 500 }}>
          {facultyId}
        </span>
      </div>

      {/* Profile info: Avatar, Name & Designation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Avatar name={fullName} size={46} fontSize={15} />
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>
            {fullName}
          </h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{designation}</span>
        </div>
      </div>

      {/* Specialization chip */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 10,
          padding: '6px 10px',
          fontSize: 12,
          color: 'var(--ink)',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <BookOpen size={13} color="var(--ink-soft)" />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {specialization}
        </span>
      </div>

      {/* Footer Meta & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          fontSize: 11,
          color: 'var(--ink-soft)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={12} />
          <span>Joined {joiningDate}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onEdit && (
            <button
              type="button"
              className="btn-translucent"
              onClick={() => onEdit(id)}
              style={{ padding: '3px 8px' }}
              title="Edit Faculty"
            >
              <Edit2 size={12} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => onDelete(id, fullName)}
              style={{ padding: '3px 8px' }}
              title="Delete Faculty"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </ToneCardWrapper>
  );
};

FacultyCard.propTypes = {
  id: PropTypes.string.isRequired,
  facultyId: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  departmentCode: PropTypes.string.isRequired,
  specialization: PropTypes.string.isRequired,
  joiningDate: PropTypes.string.isRequired,
  tone: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
