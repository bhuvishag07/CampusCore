import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Briefcase,
  GitBranch,
  Calendar,
  Library,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Layout.module.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/departments', label: 'Departments', icon: Building2 },
  { path: '/faculty', label: 'Faculty', icon: GraduationCap },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/workload', label: 'Workload', icon: Briefcase },
  { path: '/hierarchy', label: 'Hierarchy', icon: GitBranch },
  { path: '/meetings', label: 'Meetings', icon: Calendar },
  { path: '/resources', label: 'Resources', icon: Library },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const IconRail = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside className={styles.iconRailContainer}>
      <div
        className={`${styles.iconRail} ${
          isExpanded ? styles.iconRailExpanded : ''
        }`}
      >
        <div
          className={styles.railLogo}
          title="CampusCore – Integrated College Department Management System"
          aria-label="CampusCore home"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="currentColor" opacity="0.1" />
            <path
              d="M12 3L2 8L12 13L22 8L12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 10.5V16C6 18.5 8.7 20.5 12 20.5C15.3 20.5 18 18.5 18 16V10.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Navigation list */}
        <nav className={styles.railNavList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={styles.railNavItem}
                title={!isExpanded ? item.label : undefined}
              >
                <div
                  className={`${styles.railNavIconWrapper} ${
                    isActive ? styles.railNavIconWrapperActive : ''
                  }`}
                >
                  <Icon size={20} />
                </div>
                {isExpanded && (
                  <span className={styles.railNavLabel}>{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Expand / Collapse toggle button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-soft)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isExpanded ? 'Collapse Rail' : 'Expand Rail'}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Sun / Moon Theme Toggle Pill */}
        <div
          className={styles.themeTogglePill}
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <div
            className={`${styles.themeIconSlot} ${
              theme === 'light' ? styles.themeIconSlotActive : ''
            }`}
          >
            <Sun size={16} />
          </div>
          <div
            className={`${styles.themeIconSlot} ${
              theme === 'dark' ? styles.themeIconSlotActive : ''
            }`}
          >
            <Moon size={16} />
          </div>
        </div>
      </div>
    </aside>
  );
};
