import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Bell,
  Database,
  Info,
  RotateCcw,
  CheckCircle2,
  Shield,
  Save,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch } from '@/redux/hooks';
import { resetSampleDepartments } from '@/redux/slices/departmentSlice';
import { resetSampleFaculty } from '@/redux/slices/facultySlice';
import { resetSampleStudents } from '@/redux/slices/studentSlice';
import { resetSampleCourses } from '@/redux/slices/courseSlice';
import { resetSampleActivities } from '@/redux/slices/activitySlice';
import { useToast } from '@/components/common/Toast';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import styles from '@/components/dashboard/Dashboard.module.css';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@collegehub.edu');
  const [role, setRole] = useState(user?.role || 'Administrator');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditAlerts, setAuditAlerts] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, role });
    addToast('Admin profile updated successfully!', 'success');
  };

  const handleResetData = () => {
    dispatch(resetSampleDepartments());
    dispatch(resetSampleFaculty());
    dispatch(resetSampleStudents());
    dispatch(resetSampleCourses());
    dispatch(resetSampleActivities());
    addToast('Application database restored to sample records.', 'info');
    setShowResetConfirm(false);
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* Header */}
      <div>
        <h1 className="page-title">Settings & Preferences</h1>
        <p className="page-subtitle">
          Configure administrator profile, appearance theme, notifications, and data management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--ink)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} />
            </div>
            <div>
              <h3 className="panel-title">Admin Profile</h3>
              <p className="panel-subtitle">Manage administrative credentials</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              >
                <option value="Administrator">Administrator</option>
                <option value="Staff">Staff</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-dark"
              style={{ marginTop: 8, padding: '10px 18px', alignSelf: 'flex-start' }}
            >
              <Save size={15} />
              <span>Save Profile</span>
            </button>
          </form>
        </div>

        {/* Theme Preferences */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--ink)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <div>
              <h3 className="panel-title">Theme Preferences</h3>
              <p className="panel-subtitle">Select visual interface appearance</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 16 }}>
            Default theme is <strong>Soft Lavender</strong> with frosted panels. Dark mode switches
            to deep violet-ink surfaces while preserving pastel highlights and Outfit typography.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              style={{
                flex: 1,
                padding: '16px 14px',
                borderRadius: 18,
                border: theme === 'light' ? '2px solid var(--ink)' : '1px solid var(--glass-border)',
                backgroundColor: '#ffffff',
                color: '#15131f',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Sun size={20} color="#ff9500" />
                {theme === 'light' && <CheckCircle2 size={16} color="var(--ink)" />}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Light Theme</h4>
              <p style={{ fontSize: 12, color: '#5d5a72', marginTop: 2 }}>
                Original lavender & pastels
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              style={{
                flex: 1,
                padding: '16px 14px',
                borderRadius: 18,
                border: theme === 'dark' ? '2px solid #f1effb' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#25223d',
                color: '#f1effb',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Moon size={20} color="#9d8df1" />
                {theme === 'dark' && <CheckCircle2 size={16} color="#f1effb" />}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Dark Theme</h4>
              <p style={{ fontSize: 12, color: '#a9a5c6', marginTop: 2 }}>
                Muted violet-ink surfaces
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications and Data Management */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Notification settings */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--ink)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 className="panel-title">Notification Channels</h3>
              <p className="panel-subtitle">Portal alert preferences</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--field)',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 13, color: 'var(--ink)' }}>Email Alerts</strong>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  Receive department audit reports via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--ink)' }}
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--field)',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ fontSize: 13, color: 'var(--ink)' }}>System Audit Tracking</strong>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  Generate in-app notification badges for modifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={auditAlerts}
                onChange={(e) => setAuditAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--ink)' }}
              />
            </label>
          </div>
        </div>

        {/* Data Management & System info */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--ink)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <h3 className="panel-title">Data Management</h3>
              <p className="panel-subtitle">Persistence and sample seed control</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 16 }}>
            State is persisted across browser refreshes via <code>Redux Persist</code> and{' '}
            <code>localStorage</code>. Resetting restores the initial 6 departments, 12 faculty,
            and 30 students.
          </p>

          <button
            type="button"
            className="btn-translucent btn-danger-pill"
            onClick={() => setShowResetConfirm(true)}
            style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <RotateCcw size={15} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Data"
        message="Are you sure you want to reset all departments, faculty, students, and courses back to the original sample dataset? Any unsaved edits will be replaced."
        confirmLabel="Reset Everything"
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
