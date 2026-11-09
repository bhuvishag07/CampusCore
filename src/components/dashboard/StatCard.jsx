import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToneCardWrapper } from '@/styles/styledComponents';
import { IconTile } from '@/components/common/IconTile';
import styles from './Dashboard.module.css';

const StatCardComponent = ({
  title,
  count = 0,
  icon,
  tone = 0,
  subtext = 'Registered records',
}) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(count, 10) || 0;
    if (end === 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 800; // ms
    const increment = end / (duration / 25);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <ToneCardWrapper
      $tone={tone}
      className={styles.statCard}
      style={{ minHeight: 'auto', padding: '18px 20px' }}
    >
      <div>
        <span className={styles.statLabel}>{title}</span>
        <div className={styles.statValue}>{displayCount}</div>
        <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{subtext}</span>
      </div>
      <IconTile icon={icon} size={44} iconSize={22} />
    </ToneCardWrapper>
  );
};

StatCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  tone: PropTypes.oneOf([0, 1, 2]),
  subtext: PropTypes.string,
};

export const StatCard = React.memo(StatCardComponent);
