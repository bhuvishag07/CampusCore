import React from 'react';
import styles from './Common.module.css';
import { getInitials } from '@/utils/tones';

interface AvatarProps {
  name: string;
  size?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  className?: string;
}

const pastelColors = ['#d9d4f7', '#d3e4fa', '#d5f0d2', '#f6dce8', '#f3d9c2'];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 36,
  bg,
  color = '#15131f',
  fontSize = 13,
  className = '',
}) => {
  const initials = getInitials(name);
  // Derive consistent pastel background from name if not provided
  const derivedBg =
    bg ||
    pastelColors[
      Math.abs(
        name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % pastelColors.length
    ];

  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: derivedBg,
        color,
        fontSize,
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
