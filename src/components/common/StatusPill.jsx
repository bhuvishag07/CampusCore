import React from 'react';
import PropTypes from 'prop-types';
import { StatusIndicatorPill } from '@/styles/styledComponents';

export const StatusPill = ({ status = 'Active', className = '' }) => {
  return (
    <StatusIndicatorPill $status={status} className={className}>
      {status}
    </StatusIndicatorPill>
  );
};

StatusPill.propTypes = {
  status: PropTypes.oneOf(['Active', 'Inactive', 'Enrolled', 'On leave', 'Graduated']),
  className: PropTypes.string,
};
