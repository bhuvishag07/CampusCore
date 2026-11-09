import React from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Calendar, Edit2, Trash2 } from 'lucide-react';
import { ToneCardWrapper } from '@/styles/styledComponents';
import { IconTile } from '@/components/common/IconTile';
import { Avatar } from '@/components/common/Avatar';

export const CourseCard = ({
  id,
  courseCode,
  courseName,
  departmentCode,
  credits,
  semester,
  description,
  assignedFacultyName,
  tone = 0,
  onEdit,
  onDelete,
}) => {
  return (
    <ToneCardWrapper $tone={tone} style={{ minHeight: 210 }}>
      {/* Top Header: Code pill & credits */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            {courseCode}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
              color: 'var(--ink)',
            }}
          >
            {departmentCode}
          </span>
        </div>

        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>
          {credits} Credits
        </span>
      </div>

      {/* Course Title and Description */}
      <div style={{ marginBottom: 12 }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {courseName}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: 'var(--ink-soft)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      </div>

      {/* Footer Row matching screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTile icon={BookOpen} size={34} iconSize={16} />
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            Semester {semester}
          </span>
          {assignedFacultyName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
              <Avatar name={assignedFacultyName} size={24} fontSize={9} />
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--ink)',
                  fontWeight: 500,
                  maxWidth: 90,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={assignedFacultyName}
              >
                {assignedFacultyName.split(' ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Action pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onEdit && (
            <button
              type="button"
              className="btn-translucent"
              onClick={() => onEdit(id)}
              style={{ padding: '3px 8px' }}
              title="Edit Course"
            >
              <Edit2 size={12} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => onDelete(id, courseName)}
              style={{ padding: '3px 8px' }}
              title="Delete Course"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </ToneCardWrapper>
  );
};

CourseCard.propTypes = {
  id: PropTypes.string.isRequired,
  courseCode: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  departmentCode: PropTypes.string.isRequired,
  credits: PropTypes.number.isRequired,
  semester: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  assignedFacultyName: PropTypes.string,
  tone: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
