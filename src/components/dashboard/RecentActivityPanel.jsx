import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Pin,
} from 'lucide-react';
import { IconTile } from '@/components/common/IconTile';
import { PillDropdown } from '@/components/common/PillDropdown';
import { formatRelativeTime } from '@/utils/dateUtils';
import { useActivitiesReducer } from '@/hooks/useActivitiesReducer';
import styles from './Dashboard.module.css';

const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Departments', value: 'Departments' },
  { label: 'Faculty', value: 'Faculty' },
  { label: 'Students', value: 'Students' },
  { label: 'Courses', value: 'Courses' },
];

const iconMap = {
  building: Building2,
  faculty: GraduationCap,
  student: Users,
  book: BookOpen,
  check: CheckCircle2,
  edit: CheckCircle2,
  trash: CheckCircle2,
};

export const RecentActivityPanel = ({ activities = [] }) => {
  // Demonstrating useReducer hook for complex state management (filtering, pinning)
  const {
    items,
    category,
    pinnedIds,
    filterCategory,
    togglePin,
  } = useActivitiesReducer(activities);

  return (
    <div className={`glass-panel`} style={{ padding: 24 }}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className="panel-title">Recent Activity</h3>
          <p className="panel-subtitle">Latest changes across the portal</p>
        </div>

        <PillDropdown
          value={category}
          options={filterOptions}
          onChange={(val) => filterCategory(val)}
        />
      </div>

      <div className={styles.activityList}>
        <AnimatePresence>
          {items.slice(0, 5).map((act) => {
            const Icon = iconMap[act.iconType] || Building2;
            const isPinned = pinnedIds.includes(act.id);

            return (
              <motion.div
                key={act.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className={styles.activityRow}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IconTile icon={Icon} size={36} iconSize={17} />
                  <div>
                    <h4
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {act.title}
                      {isPinned && <Pin size={11} color="var(--chart-purple)" />}
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-soft)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatRelativeTime(act.timestamp)}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePin(act.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isPinned ? 'var(--chart-purple)' : 'var(--ink-soft)',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                    title={isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--ink-soft)',
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            No activity found for {category}
          </p>
        )}
      </div>
    </div>
  );
};

RecentActivityPanel.propTypes = {
  activities: PropTypes.array,
};
