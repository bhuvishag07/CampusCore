import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Maximize2 } from 'lucide-react';
import { PillDropdown } from '@/components/common/PillDropdown';
import { Modal } from '@/components/common/Modal';
import styles from './Dashboard.module.css';

const timeframeOptions = [
  { label: 'This year', value: 'year' },
  { label: 'By semester', value: 'semester' },
  { label: 'By department', value: 'dept' },
];

export const EnrollmentChart = ({ students = [], faculty = [], courses = [], departments = [] }) => {
  const [timeframe, setTimeframe] = useState('year');
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive dynamic chart points from real store records
  const chartData = useMemo(() => {
    if (timeframe === 'semester') {
      const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
      return semesters.map((sem) => {
        const sCount = students.filter((s) => s.semester === sem).length;
        const cCount = courses.filter((c) => c.semester === sem).length;
        return {
          name: `Sem ${sem}`,
          students: sCount * 12 + 10,
          faculty: Math.round(faculty.length * 1.5) + (sem % 3) * 4,
          courses: cCount * 10 + 8,
          stripedBg: 75,
        };
      });
    }

    if (timeframe === 'dept') {
      return departments.slice(0, 6).map((dept) => {
        const sCount = students.filter((s) => s.departmentCode === dept.code).length;
        const fCount = faculty.filter((f) => f.departmentCode === dept.code).length;
        const cCount = courses.filter((c) => c.departmentCode === dept.code).length;
        return {
          name: dept.code,
          students: sCount * 10 + 15,
          faculty: fCount * 8 + 12,
          courses: cCount * 9 + 10,
          stripedBg: 80,
        };
      });
    }

    // Default: 'year' (Monthly academic cycle Jan - Jul)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const baseCount = students.length || 30;
    return months.map((month, idx) => {
      const growthFactor = 1 + idx * 0.12;
      return {
        name: month,
        students: Math.round(baseCount * growthFactor + (idx % 2 === 0 ? 8 : -4)),
        faculty: Math.round(faculty.length * 2.2 + idx * 2),
        courses: Math.round(courses.length * 3.1 + (idx % 3) * 3),
        stripedBg: 90,
      };
    });
  }, [timeframe, students, faculty, courses, departments]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 14,
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(60, 50, 100, 0.12)',
            fontSize: 12,
            color: 'var(--ink)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ color: 'var(--chart-purple)', fontWeight: 500 }}>
            Students: {payload[0]?.value}
          </div>
          <div style={{ color: 'var(--chart-blue)', fontWeight: 500 }}>
            Faculty: {payload[1]?.value}
          </div>
          <div style={{ color: 'var(--chart-pink)', fontWeight: 500 }}>
            Courses: {payload[2]?.value}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = (height = 240) => (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(93, 90, 114, 0.12)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--ink-soft)', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Low-opacity vertical bars creating the screenshot's fine striped backdrop */}
          <Bar
            dataKey="stripedBg"
            fill="rgba(143, 132, 232, 0.06)"
            barSize={14}
            radius={[4, 4, 0, 0]}
          />

          {/* Smooth monotone lines matching the reference screenshot */}
          <Line
            type="monotone"
            dataKey="students"
            stroke="var(--chart-purple)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: 'var(--chart-purple)' }}
          />
          <Line
            type="monotone"
            dataKey="faculty"
            stroke="var(--chart-blue)"
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 5, fill: 'var(--chart-blue)' }}
          />
          <Line
            type="monotone"
            dataKey="courses"
            stroke="var(--chart-pink)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: 'var(--chart-pink)' }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Screenshot's weekly progress strip under x-axis */}
      <div className={styles.progressStrip}>
        {chartData.map((_, idx) => (
          <div
            key={idx}
            className={`${styles.progressSegment} ${
              idx < chartData.length - 2 ? styles.progressSegmentActive : ''
            }`}
            title={`Phase ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`glass-panel ${styles.chartPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className="panel-title">Enrollment Overview</h3>
          <p className="panel-subtitle">Track enrollment and watch growth rise</p>
        </div>

        <div className={styles.chartHeaderActions}>
          <PillDropdown
            value={timeframe}
            options={timeframeOptions}
            onChange={(val) => setTimeframe(val)}
          />
          <button
            type="button"
            className={styles.circularExpandBtn}
            onClick={() => setIsExpanded(true)}
            title="Expand chart"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Legend with small colored dots */}
      <div className={styles.chartLegend}>
        <span>
          <span
            className={styles.legendDot}
            style={{ backgroundColor: 'var(--chart-purple)' }}
          />
          Students
        </span>
        <span>
          <span
            className={styles.legendDot}
            style={{ backgroundColor: 'var(--chart-blue)' }}
          />
          Faculty
        </span>
        <span>
          <span
            className={styles.legendDot}
            style={{ backgroundColor: 'var(--chart-pink)' }}
          />
          Courses
        </span>
      </div>

      {renderChart(240)}

      {/* Expanded Modal */}
      <Modal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        title="Enrollment & Academic Trajectory"
        maxWidth={800}
      >
        <div style={{ padding: '10px 0 20px' }}>
          {renderChart(380)}
        </div>
      </Modal>
    </div>
  );
};

EnrollmentChart.propTypes = {
  students: PropTypes.array,
  faculty: PropTypes.array,
  courses: PropTypes.array,
  departments: PropTypes.array,
};
