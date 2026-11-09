import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Search,
  Maximize2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppSelector } from '@/redux/hooks';
import { useDepartments } from '@/hooks/useDepartments';
import { getTimeAwareGreeting, formatCurrentDate } from '@/utils/dateUtils';
import { getTone } from '@/utils/tones';
import { StatCard } from '@/components/dashboard/StatCard';
import { EnrollmentChart } from '@/components/dashboard/EnrollmentChart';
import { RecentActivityPanel } from '@/components/dashboard/RecentActivityPanel';
import { TopDepartmentsPanel } from '@/components/dashboard/TopDepartmentsPanel';
import { DepartmentDistributionChart } from '@/components/dashboard/DepartmentDistributionChart';
import { DepartmentCard } from '@/components/departments/DepartmentCard';
import { Modal } from '@/components/common/Modal';
import styles from '@/components/dashboard/Dashboard.module.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { departments } = useDepartments();
  const faculty = useAppSelector((state) => state.faculty.items);
  const students = useAppSelector((state) => state.students.items);
  const courses = useAppSelector((state) => state.courses.items);
  const activities = useAppSelector((state) => state.activity.items);

  const [leftSearch, setLeftSearch] = useState('');
  const [isLeftExpanded, setIsLeftExpanded] = useState(false);

  const greeting = getTimeAwareGreeting();
  const formattedDate = formatCurrentDate(true);

  // Filter left column cards by local search
  const filteredLeftDepts = useMemo(() => {
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(leftSearch.toLowerCase()) ||
        d.code.toLowerCase().includes(leftSearch.toLowerCase()) ||
        d.hod.toLowerCase().includes(leftSearch.toLowerCase())
    );
  }, [departments, leftSearch]);

  return (
    <div className={styles.dashboardGrid}>
      {/* Welcome & Dynamic Date */}
      <div className={styles.welcomeSection}>
        <h1 className="page-title">
          {greeting}, {user?.name?.split(' ')[0] || 'Admin'}
        </h1>
        <p className={styles.dateSubtitle}>
          {formattedDate} • Welcome to your CampusCore academic administration overview
        </p>
      </div>

      {/* 4 Statistics Cards */}
      <section className={styles.statsRow}>
        <StatCard
          title="Total Departments"
          count={departments.length}
          icon={Building2}
          tone={0}
          subtext="Active academic divisions"
        />
        <StatCard
          title="Total Faculty"
          count={faculty.length}
          icon={GraduationCap}
          tone={1}
          subtext="Professors & lecturers"
        />
        <StatCard
          title="Total Students"
          count={students.length}
          icon={Users}
          tone={2}
          subtext="Enrolled undergraduates"
        />
        <StatCard
          title="Total Courses"
          count={courses.length}
          icon={BookOpen}
          tone={0}
          subtext="Accredited degree courses"
        />
      </section>

      {/* Main Grid: Left Column (320px) + Right Area */}
      <div className={styles.mainLayoutGrid}>
        {/* Left Column: Departments Panel (replaces 'Select a course' in screenshot) */}
        <div className={`glass-panel ${styles.departmentsPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className="panel-title">Departments</h3>
              <p className="panel-subtitle">Browse academic disciplines</p>
            </div>
            <button
              type="button"
              className={styles.circularExpandBtn}
              onClick={() => setIsLeftExpanded(true)}
              title="Expand departments"
            >
              <Maximize2 size={15} />
            </button>
          </div>

          {/* Search box with dark round submit button */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Filter departments..."
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
            />
            <button
              type="button"
              className={styles.searchSubmitBtn}
              title="Search"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Stack of 3 pastel DepartmentCards */}
          <div className={styles.cardStack}>
            {filteredLeftDepts.slice(0, 3).map((dept, idx) => {
              const deptFaculty = faculty
                .filter((f) => f.departmentCode === dept.code)
                .map((f) => f.fullName);

              return (
                <DepartmentCard
                  key={dept.id}
                  id={dept.id}
                  name={dept.name}
                  code={dept.code}
                  hod={dept.hod}
                  description={dept.description}
                  establishedYear={dept.establishedYear}
                  status={dept.status}
                  studentCount={dept.studentCount}
                  facultyCount={dept.facultyCount}
                  courseCount={dept.courseCount}
                  tone={getTone(idx)}
                  facultyAvatars={deptFaculty}
                  compact={true}
                  showActions={false}
                />
              );
            })}
          </div>

          {/* View All Pill */}
          <button
            type="button"
            className="btn-dark"
            onClick={() => navigate('/departments')}
            style={{ width: '100%', marginTop: 8 }}
          >
            <span>View All Departments</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Right Area: Enrollment Overview + Bottom Split */}
        <div className={styles.rightArea}>
          {/* Top-Right: Enrollment Overview Recharts ComposedChart */}
          <EnrollmentChart
            students={students}
            faculty={faculty}
            courses={courses}
            departments={departments}
          />

          {/* Bottom Split: Recent Activity + Top Departments */}
          <div className={styles.bottomPanelsGrid}>
            <RecentActivityPanel activities={activities} />
            <TopDepartmentsPanel departments={departments} />
          </div>
        </div>
      </div>

      {/* Additional Distribution Section */}
      <section style={{ marginTop: 8 }}>
        <DepartmentDistributionChart departments={departments} />
      </section>

      {/* Expand Left Panel Modal */}
      <Modal
        isOpen={isLeftExpanded}
        onClose={() => setIsLeftExpanded(false)}
        title="All Academic Departments"
        maxWidth={720}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
            padding: '12px 0 20px',
          }}
        >
          {filteredLeftDepts.map((dept, idx) => (
            <DepartmentCard
              key={dept.id}
              {...dept}
              tone={getTone(idx)}
              showActions={false}
              compact={true}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};
