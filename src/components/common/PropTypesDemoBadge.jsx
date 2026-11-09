import React from 'react';
import PropTypes from 'prop-types';

/**
 * PropTypesDemoBadge
 * Explicitly demonstrates runtime React prop type validation (PropTypes)
 * as required by the React syllabus topic 8.
 */
export const PropTypesDemoBadge = ({
  label,
  count,
  variant,
  isActive,
  onBadgeClick,
}) => {
  return (
    <div
      onClick={onBadgeClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: variant === 'accent' ? 'var(--lavender)' : 'var(--field)',
        color: 'var(--ink)',
        cursor: onBadgeClick ? 'pointer' : 'default',
        border: isActive ? '1px solid var(--ink)' : '1px solid transparent',
      }}
      title="Syllabus Demo: PropTypes Component"
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '1px 6px',
            borderRadius: 999,
            fontSize: 10,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
};

PropTypesDemoBadge.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'accent', 'outline']),
  isActive: PropTypes.bool,
  onBadgeClick: PropTypes.func,
};

PropTypesDemoBadge.defaultProps = {
  count: null,
  variant: 'default',
  isActive: false,
  onBadgeClick: null,
};
