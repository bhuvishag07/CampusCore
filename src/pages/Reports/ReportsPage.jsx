import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Download, BarChart3, Users, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { exportToCsv } from '@/services/exportCsv';
import styles from '@/components/dashboard/Dashboard.module.css';

const CHART_COLORS = ['#8f84e8', '#7fb2ee', '#f2a7c3', '#9be5b6', '#fad284', '#e2a1d2'];

export const ReportsPage = () => {
  const departments = useAppSelector((state) => state.departments.items);
  const faculty = useAppSelector((state) => state.faculty.items);
  const students = useAppSelector((state) => state.students.items);
  const courses = useAppSelector((state) => state.courses.items);

  // Compute live department metrics
  const departmentMetrics = departments.map((d) => {
    const fCount = faculty.filter((f) => f.departmentCode === d.code).length;
    const sCount = students.filter((s) => s.departmentCode === d.code).length;
    const cCount = courses.filter((c) => c.departmentCode === d.code).length;
    return {
      id: d.id,
      code: d.code,
      name: d.name,
      hod: d.hod,
      students: sCount,
      faculty: fCount,
      courses: cCount,
      ratio: fCount > 0 ? (sCount / fCount).toFixed(1) : 'N/A',
      establishedYear: d.establishedYear,
      status: d.status,
    };
  });

  // Semester student count
  const semesterDistribution = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => ({
    semester: `Sem ${sem}`,
    students: students.filter((s) => s.semester === sem).length,
  }));

  // Enrollment status counts
  const enrollmentStatusData = [
    { name: 'Enrolled', value: students.filter((s) => s.enrollmentStatus === 'Enrolled').length },
    { name: 'On leave', value: students.filter((s) => s.enrollmentStatus === 'On leave').length },
    { name: 'Graduated', value: students.filter((s) => s.enrollmentStatus === 'Graduated').length },
  ];

  const handleExportDepartmentsCsv = () => {
    exportToCsv('CampusCore_Department_Summary', departmentMetrics);
  };

  const handleExportStudentsCsv = () => {
    exportToCsv('CampusCore_Students_Directory', students);
  };

  const handleExportFacultyCsv = () => {
    exportToCsv('CampusCore_Faculty_Roster', faculty);
  };

  const handleExportCoursesCsv = () => {
    exportToCsv('CampusCore_Courses_Curriculum', courses);
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">
            Exportable institutional statistics, faculty-student ratios, and curriculum distribution
          </p>
        </div>

        <button
          type="button"
          className="btn-dark"
          onClick={handleExportDepartmentsCsv}
          style={{ padding: '10px 20px' }}
        >
          <Download size={16} />
          <span>Export All Data (CSV)</span>
        </button>
      </div>

      {/* Grid: 2 Charts */}
      <div className={styles.bottomPanelsGrid}>
        {/* Department Comparison Chart */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="panel-title">Students & Faculty by Department</h3>
              <p className="panel-subtitle">Live counts per academic unit</p>
            </div>
            <button
              type="button"
              className="btn-translucent"
              onClick={handleExportDepartmentsCsv}
              style={{ fontSize: 12, padding: '5px 12px' }}
            >
              <Download size={13} style={{ marginRight: 4 }} />
              CSV
            </button>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(93, 90, 114, 0.12)" />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="students" fill="var(--chart-purple)" name="Students" radius={[6, 6, 0, 0]} />
                <Bar dataKey="faculty" fill="var(--chart-blue)" name="Faculty" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester Progression Chart */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="panel-title">Enrollment by Semester</h3>
              <p className="panel-subtitle">Current batch distribution</p>
            </div>
            <button
              type="button"
              className="btn-translucent"
              onClick={handleExportStudentsCsv}
              style={{ fontSize: 12, padding: '5px 12px' }}
            >
              <Download size={13} style={{ marginRight: 4 }} />
              CSV
            </button>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(93, 90, 114, 0.12)" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="students" fill="var(--chart-pink)" name="Enrolled" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Summary Table */}
      <div className="glass-panel" style={{ padding: 24, overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 className="panel-title">Department Audit Table</h3>
            <p className="panel-subtitle">Comprehensive institutional audit metrics</p>
          </div>
          <button
            type="button"
            className="btn-dark"
            onClick={handleExportDepartmentsCsv}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            <Download size={14} />
            <span>Download Audit CSV</span>
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--field)', color: 'var(--ink-soft)' }}>
              <th style={{ padding: '10px 12px' }}>Code</th>
              <th style={{ padding: '10px 12px' }}>Department Name</th>
              <th style={{ padding: '10px 12px' }}>Head of Department</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Students</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Faculty</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Courses</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>S:F Ratio</th>
              <th style={{ padding: '10px 12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {departmentMetrics.map((dept) => (
              <tr
                key={dept.id}
                style={{
                  borderBottom: '1px solid var(--field)',
                  transition: 'background 150ms ease',
                }}
              >
                <td style={{ padding: '12px', fontWeight: 600 }}>{dept.code}</td>
                <td style={{ padding: '12px' }}>{dept.name}</td>
                <td style={{ padding: '12px', color: 'var(--ink-soft)' }}>{dept.hod}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 500 }}>
                  {dept.students}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 500 }}>
                  {dept.faculty}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 500 }}>
                  {dept.courses}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: 'var(--ink-soft)' }}>
                  {dept.ratio}:1
                </td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: dept.status === 'Active' ? 'rgba(52, 199, 89, 0.15)' : 'var(--field)',
                      color: dept.status === 'Active' ? '#248a3d' : 'var(--ink-soft)',
                    }}
                  >
                    {dept.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
