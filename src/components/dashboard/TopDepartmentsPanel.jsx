import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import styles from './Dashboard.module.css';

export const TopDepartmentsPanel = ({ departments = [] }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const navigate = useNavigate();

  // Sort descending by student count
  const sortedDepartments = [...departments].sort(
    (a, b) => (b.studentCount || 0) - (a.studentCount || 0)
  );

  const topRows = sortedDepartments.slice(0, 4);

  const renderLeaderboardRows = (list) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {list.map((dept, index) => (
        <div
          key={dept.id}
          className={styles.leaderboardRow}
          onClick={() => navigate(`/departments/${dept.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={dept.code} size={40} fontSize={13} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                {dept.name}
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 11,
                  color: 'var(--ink-soft)',
                  marginTop: 3,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <GraduationCap size={12} />
                  {dept.facultyCount || 0} Faculty
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <BookOpen size={12} />
                  {dept.courseCount || 0} Courses
                </span>
              </div>
            </div>
          </div>

          {/* Large right-aligned student count */}
          <div style={{ textAlign: 'right' }}>
            <span className={styles.leaderboardScore}>
              {dept.studentCount || 0}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--ink-soft)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Students
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`glass-panel`} style={{ padding: 24 }}>
      <div className={styles.panelHeader} style={{ marginBottom: 12 }}>
        <div>
          <h3 className="panel-title">Top Departments</h3>
          <p className="panel-subtitle">See how departments rank by students</p>
        </div>

        <button
          type="button"
          className="btn-translucent"
          onClick={() => setShowAllModal(true)}
          style={{ fontSize: 12, padding: '5px 14px' }}
        >
          All
        </button>
      </div>

      {renderLeaderboardRows(topRows)}

      {/* Modal showing all departments leaderboard */}
      <Modal
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        title="Complete Department Leaderboard"
        maxWidth={580}
      >
        <div style={{ padding: '8px 0 16px' }}>
          {renderLeaderboardRows(sortedDepartments)}
        </div>
      </Modal>
    </div>
  );
};

TopDepartmentsPanel.propTypes = {
  departments: PropTypes.array,
};
