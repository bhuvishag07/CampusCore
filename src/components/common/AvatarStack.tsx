import React from 'react';
import { Avatar } from './Avatar';
import styles from './Common.module.css';

interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({ names, max = 2, size = 26 }) => {
  const visible = names.slice(0, max);
  const remaining = names.length - max;

  return (
    <div className={styles.avatarStack}>
      {visible.map((name, idx) => (
        <div key={idx} className={styles.avatarStackItem}>
          <Avatar name={name} size={size} fontSize={10} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={styles.avatarStackItem}>
          <div
            className={styles.avatar}
            style={{
              width: size,
              height: size,
              backgroundColor: '#15131f',
              color: '#ffffff',
              fontSize: 9,
            }}
            title={`${remaining} more`}
          >
            +{remaining}
          </div>
        </div>
      )}
    </div>
  );
};
