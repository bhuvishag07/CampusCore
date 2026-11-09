import React from 'react';
import PropTypes from 'prop-types';
import { Inbox } from 'lucide-react';
import styles from './Common.module.css';

export const EmptyState = ({
  title = 'No department records available',
  subtext = 'Add your first department using the form.',
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: 'rgba(217, 212, 247, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-soft)',
        }}
      >
        <Icon size={24} />
      </div>
      <h3 className={styles.emptyStateTitle}>{title}</h3>
      <p className={styles.emptyStateSubtext}>{subtext}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  icon: PropTypes.elementType,
  action: PropTypes.node,
};
