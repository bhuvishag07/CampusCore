import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#8f84e8', '#7fb2ee', '#f2a7c3', '#9be5b6', '#fad284', '#e2a1d2'];

export const DepartmentDistributionChart = ({ departments = [] }) => {
  const data = departments.map((d) => ({
    name: d.code,
    value: d.studentCount || 1,
    fullName: d.name,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: 12,
            padding: '8px 12px',
            fontSize: 12,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontWeight: 600 }}>{payload[0].payload.fullName}</div>
          <div style={{ color: 'var(--ink-soft)' }}>
            Students: <strong>{payload[0].value}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: 24 }}>
      <h3 className="panel-title">Student Distribution</h3>
      <p className="panel-subtitle">Proportion of student enrollment across departments</p>

      <div style={{ width: '100%', height: 220, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

DepartmentDistributionChart.propTypes = {
  departments: PropTypes.array,
};
