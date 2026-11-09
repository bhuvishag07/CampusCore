import React from 'react';

// TypeScript Interface definition
export interface DepartmentBadgeProps {
  code: string;
  category?: 'core' | 'allied' | 'emerging';
  verified?: boolean;
}

// TypeScript Type Alias
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * TypedDepartmentBadge
 * Minimal, clean TypeScript component demonstrating interfaces, types,
 * and typed props for the syllabus requirement.
 */
export const TypedDepartmentBadge: React.FC<
  DepartmentBadgeProps & { size?: BadgeSize }
> = ({ code, category = 'core', verified = true, size = 'sm' }) => {
  const padding = size === 'lg' ? '4px 12px' : size === 'md' ? '3px 10px' : '2px 8px';
  const fontSize = size === 'lg' ? 13 : size === 'md' ? 12 : 11;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        borderRadius: 999,
        fontSize,
        fontWeight: 600,
        backgroundColor: '#ffffff',
        color: '#15131f',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      title={`TS Typed: ${category.toUpperCase()}`}
    >
      <span>{code}</span>
      {verified && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: '#34c759',
          }}
        />
      )}
    </span>
  );
};
