import React from 'react';
import { DepartmentManagerBasic } from '@/components/departments/DepartmentManagerBasic';
import { ControlledVsUncontrolledDemo } from '@/components/common/ControlledVsUncontrolledDemo';

export const BasicDemoPage = () => {
  return (
    <div>
      <DepartmentManagerBasic />
      <ControlledVsUncontrolledDemo />
    </div>
  );
};
