import React from 'react';
import PropTypes from 'prop-types';
import styles from './Common.module.css';

export const Skeleton = ({ width = '100%', height = 20, radius = 12, className = '', style = {} }) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
