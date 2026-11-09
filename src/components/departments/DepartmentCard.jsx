import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, Edit2, Trash2 } from 'lucide-react';
import { ToneCardWrapper } from '@/styles/styledComponents';
import { IconTile } from '@/components/common/IconTile';
import { AvatarStack } from '@/components/common/AvatarStack';
import { StatusPill } from '@/components/common/StatusPill';
import { TypedDepartmentBadge } from '@/components/common/TypedDepartmentBadge';

const DepartmentCardComponent = ({
  id,
  name,
  code,
  hod,
  description,
  establishedYear,
  status = 'Active',
  facultyCount = 0,
  studentCount = 0,
  courseCount = 0,
  tone = 0,
  onView,
  onEdit,
  onDelete,
  facultyAvatars = [],
  showActions = true,
  compact = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onView) {
      onView(id);
    } else {
      navigate(`/departments/${id}`);
    }
  };

  return (
    <ToneCardWrapper
      $tone={tone}
      style={{
        minHeight: compact ? 170 : 190,
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
    >
      {/* Top Header: Code pill & Status indicator */}
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
            {code}
          </span>
          <StatusPill status={status} />
        </div>

        {/* Small syllabus demo badge */}
        <TypedDepartmentBadge code={code} size="sm" />
      </div>

      {/* Card Body: Title & HOD Info */}
      <div style={{ marginBottom: 12 }}>
        <h3
          style={{
            fontSize: compact ? 17 : 19,
            fontWeight: 500,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {name}
        </h3>

        <div style={{ marginTop: 4 }}>
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--ink-soft)',
              display: 'block',
            }}
          >
            Head of department
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
            {hod}
          </span>
        </div>

        {description && !compact && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--ink-soft)',
              marginTop: 6,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Meta Chips: Faculty, Students, Courses */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 10px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 12,
          marginBottom: 12,
          fontSize: 12,
          color: 'var(--ink)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <span>
          <strong>{studentCount}</strong> Students
        </span>
        <span>•</span>
        <span>
          <strong>{facultyCount}</strong> Faculty
        </span>
        <span>•</span>
        <span>
          <strong>{courseCount}</strong> Courses
        </span>
      </div>

      {/* Footer Row matching screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTile icon={Building2} size={34} iconSize={16} />
          {establishedYear && (
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Est. {establishedYear}
            </span>
          )}
          {facultyAvatars.length > 0 && (
            <AvatarStack names={facultyAvatars} max={2} size={24} />
          )}
        </div>

        {/* Action Pills */}
        {showActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {onEdit && (
              <button
                type="button"
                className="btn-translucent"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                title="Edit department"
                style={{ padding: '4px 10px' }}
              >
                <Edit2 size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn-translucent btn-danger-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id, name);
                }}
                title="Delete department"
                style={{ padding: '4px 10px' }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </ToneCardWrapper>
  );
};

DepartmentCardComponent.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  hod: PropTypes.string.isRequired,
  description: PropTypes.string,
  establishedYear: PropTypes.number,
  status: PropTypes.oneOf(['Active', 'Inactive']),
  facultyCount: PropTypes.number,
  studentCount: PropTypes.number,
  courseCount: PropTypes.number,
  tone: PropTypes.oneOf([0, 1, 2]),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  facultyAvatars: PropTypes.arrayOf(PropTypes.string),
  showActions: PropTypes.bool,
  compact: PropTypes.bool,
};

// Optimizing re-renders via React.memo (Syllabus topic: Performance Optimization)
export const DepartmentCard = React.memo(DepartmentCardComponent);
