import React from 'react';
import PropTypes from 'prop-types';
import { DarkIconTile } from '@/styles/styledComponents';

export const IconTile = ({ icon: Icon, size = 36, iconSize = 18, className = '' }) => {
  return (
    <DarkIconTile
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    >
      <Icon size={iconSize} />
    </DarkIconTile>
  );
};

IconTile.propTypes = {
  icon: PropTypes.elementType.isRequired,
  size: PropTypes.number,
  iconSize: PropTypes.number,
  className: PropTypes.string,
};
