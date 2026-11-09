import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '@/components/common/Skeleton';

// Lazy loading components for performance demonstration (Syllabus topic: Lazy loading & Suspense)
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const DepartmentsPage = lazy(() =>
  import('@/pages/Departments/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage }))
);
const DepartmentDetailPage = lazy(() =>
  import('@/pages/Departments/DepartmentDetailPage').then((m) => ({
    default: m.DepartmentDetailPage,
  }))
);
const BasicDemoPage = lazy(() =>
  import('@/pages/Departments/BasicDemoPage').then((m) => ({ default: m.BasicDemoPage }))
);
const FacultyPage = lazy(() =>
  import('@/pages/Faculty/FacultyPage').then((m) => ({ default: m.FacultyPage }))
);
const StudentsPage = lazy(() =>
  import('@/pages/Students/StudentsPage').then((m) => ({ default: m.StudentsPage }))
);
const CoursesPage = lazy(() =>
  import('@/pages/Courses/CoursesPage').then((m) => ({ default: m.CoursesPage }))
);
const ReportsPage = lazy(() =>
  import('@/pages/Reports/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
// New Department Management Modules (additive extension)
const WorkloadPage = lazy(() =>
  import('@/pages/Workload/WorkloadPage').then((m) => ({ default: m.WorkloadPage }))
);
const HierarchyPage = lazy(() =>
  import('@/pages/Hierarchy/HierarchyPage').then((m) => ({ default: m.HierarchyPage }))
);
const MeetingsPage = lazy(() =>
  import('@/pages/Meetings/MeetingsPage').then((m) => ({ default: m.MeetingsPage }))
);
const MeetingDetailPage = lazy(() =>
  import('@/pages/Meetings/MeetingDetailPage').then((m) => ({
    default: m.MeetingDetailPage,
  }))
);
const ResourcesPage = lazy(() =>
  import('@/pages/Resources/ResourcesPage').then((m) => ({ default: m.ResourcesPage }))
);
const LoginPage = lazy(() =>
  import('@/pages/Login/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoadingFallback = () => (
  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Skeleton height={42} width={260} radius={14} />
    <Skeleton height={20} width={380} radius={8} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 12 }}>
      <Skeleton height={100} radius={20} />
      <Skeleton height={100} radius={20} />
      <Skeleton height={100} radius={20} />
      <Skeleton height={100} radius={20} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginTop: 16 }}>
      <Skeleton height={320} radius={24} />
      <Skeleton height={320} radius={24} />
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Administrative Routes inside MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />

          {/* Department routes including assignment demo view and dynamic detail route */}
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/departments/basic-demo" element={<BasicDemoPage />} />

          {/* Faculty, Students, Courses */}
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />

          {/* Reports and Settings */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* New Department Management Modules */}
          <Route path="/workload" element={<WorkloadPage />} />
          <Route path="/hierarchy" element={<HierarchyPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
