import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings as SettingsIcon,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { markAsRead, markAllAsRead } from '@/redux/slices/notificationSlice';
import { formatRelativeTime } from '@/utils/dateUtils';
import styles from './Layout.module.css';

const primaryTabs = [
  { path: '/', label: 'Dashboard' },
  { path: '/departments', label: 'Departments' },
  { path: '/faculty', label: 'Faculty' },
  { path: '/students', label: 'Students' },
  { path: '/courses', label: 'Courses' },
];

export const TopBar = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const notifications = useAppSelector((state) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    navigate(`/departments?search=${encodeURIComponent(globalSearch.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <header className={styles.topbar}>
      {/* Left: Mobile hamburger & Logo */}
      <div className={styles.topbarLeft}>
        <button
          type="button"
          className={`${styles.iconCircleBtn} ${styles.mobileHamburgerBtn}`}
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div
          className={styles.railLogo}
          onClick={() => navigate('/')}
          title="CampusCore – Integrated College Department Management System"
          aria-label="CampusCore home"
          style={{ margin: 0, width: 38, height: 38 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        <span style={{ color: 'var(--ink)', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>
          CampusCore
        </span>
      </div>

      {/* Center: Segmented Pill Tab Bar with Framer Motion layoutId sliding */}
      <nav className={styles.pillTabsContainer}>
        {primaryTabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`${styles.pillTab} ${isActive ? styles.pillTabActive : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePillTabIndicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'var(--ink)',
                    borderRadius: 999,
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              {tab.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Right Controls: Search, Bell, Avatar */}
      <div className={styles.topbarRight}>
        {/* Expandable Search Input */}
        <AnimatePresence>
          {isSearchOpen ? (
            <motion.form
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSearchSubmit}
              className={styles.searchExpandBox}
            >
              <input
                type="text"
                placeholder="Search portal..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                autoFocus
                className={styles.searchInput}
              />
              <button
                type="submit"
                className={styles.searchSubmitBtn}
                title="Search"
              >
                <Search size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ink-soft)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </motion.form>
          ) : (
            <button
              type="button"
              className={styles.iconCircleBtn}
              onClick={() => setIsSearchOpen(true)}
              title="Search CampusCore"
            >
              <Search size={18} />
            </button>
          )}
        </AnimatePresence>

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.iconCircleBtn}
            onClick={() => setIsNotifOpen((prev) => !prev)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className={styles.notificationDot} />}
          </button>

          {isNotifOpen && (
            <div className={styles.popover}>
              <div className={styles.notificationsHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600 }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: 'var(--notification-dot)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 999,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch(markAllAsRead())}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ink-soft)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center', padding: 16 }}>
                    No notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => dispatch(markAsRead(notif.id))}
                      className={`${styles.notificationItem} ${
                        !notif.read ? styles.notificationItemUnread : ''
                      }`}
                    >
                      <div className={styles.notificationTitle}>{notif.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{notif.message}</div>
                      <div className={styles.notificationTime}>{formatRelativeTime(notif.timestamp)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsProfileOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'var(--lavender)',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
            title={user ? user.name : 'Account'}
          >
            {user?.avatarInitials || 'AD'}
          </div>

          {isProfileOpen && (
            <div className={styles.popover} style={{ width: 220 }}>
              <div style={{ paddingBottom: 10, marginBottom: 8, borderBottom: '1px solid var(--field)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  {user?.name || 'Administrator'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {user?.email || 'admin@collegehub.edu'}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: 'var(--field)',
                    color: 'var(--ink)',
                  }}
                >
                  {user?.role || 'Administrator'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--ink)',
                    fontSize: 13,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <SettingsIcon size={15} />
                  Settings & Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setIsProfileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--ink)',
                    fontSize: 13,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{theme === 'light' ? '🌙' : '☀️'}</span>
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setIsProfileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    fontSize: 13,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
