import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Users,
  BookOpen,
  Clock,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addWorkload,
  updateWorkload,
  deleteWorkload,
} from '@/redux/slices/workloadSlice';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/components/common/Toast';
import { ToneCardWrapper } from '@/styles/styledComponents';
import styles from '@/components/workload/Workload.module.css';

const COMMON_RESPONSIBILITIES = [
  'HOD',
  'Associate HOD',
  'Academic Mentor',
  'Curriculum Coordinator',
  'Lab In-charge',
  'Research Coordinator',
  'PhD Guide',
  'Placement Coordinator',
  'NAAC Coordinator',
  'Timetable Coordinator',
  'Sports Coordinator',
  'Industry Liaison',
];

export const WorkloadPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const facultyList = useAppSelector((state) => state.faculty.items);
  const departments = useAppSelector((state) => state.departments.items);
  const courses = useAppSelector((state) => state.courses.items);
  const workloads = useAppSelector((state) => state.workload.items);

  // Filters & Search
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedDesignation, setSelectedDesignation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, facultyName: '' });

  // Form State
  const [formFacultyId, setFormFacultyId] = useState('');
  const [formCourseIds, setFormCourseIds] = useState([]);
  const [formWeeklyHours, setFormWeeklyHours] = useState(12);
  const [formResponsibilities, setFormResponsibilities] = useState([]);
  const [customResp, setCustomResp] = useState('');
  const [formError, setFormError] = useState('');

  // Combined faculty workload records
  const workloadRecords = useMemo(() => {
    return facultyList.map((faculty) => {
      const wl = workloads.find((w) => w.facultyId === faculty.id);
      const assignedCourses = wl
        ? courses.filter((c) => wl.courseIds.includes(c.id))
        : [];
      const weeklyHours = wl ? wl.weeklyHours : 0;
      const additionalResponsibilities = wl ? wl.additionalResponsibilities || [] : [];
      let status = wl ? wl.status : 'Underutilized';

      // Auto compute if not explicitly set
      if (!wl) {
        status = weeklyHours > 18 ? 'Overloaded' : weeklyHours < 8 ? 'Underutilized' : 'Normal';
      }

      return {
        workloadId: wl ? wl.id : null,
        faculty,
        facultyId: faculty.id,
        fullName: faculty.fullName,
        facCode: faculty.facultyId,
        departmentCode: faculty.departmentCode,
        designation: faculty.designation,
        assignedCourses,
        courseIds: wl ? wl.courseIds : [],
        weeklyHours,
        additionalResponsibilities,
        status,
      };
    });
  }, [facultyList, workloads, courses]);

  // Key KPI stats
  const stats = useMemo(() => {
    const totalFaculty = facultyList.length;
    const allAssignedCourseIds = new Set();
    let totalWeeklyHours = 0;
    let overloadedCount = 0;
    let underutilizedCount = 0;

    workloads.forEach((w) => {
      w.courseIds?.forEach((cId) => allAssignedCourseIds.add(cId));
      totalWeeklyHours += Number(w.weeklyHours) || 0;
      if (w.status === 'Overloaded' || (w.weeklyHours > 18)) overloadedCount++;
      if (w.status === 'Underutilized' || (w.weeklyHours < 8)) underutilizedCount++;
    });

    const avgHours = totalFaculty > 0 ? (totalWeeklyHours / totalFaculty).toFixed(1) : '0';

    // Sort to find highest and lowest
    const sorted = [...workloadRecords].sort((a, b) => b.weeklyHours - a.weeklyHours);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    return {
      totalFaculty,
      totalAssignedCourses: allAssignedCourseIds.size,
      totalWeeklyHours,
      avgHours,
      overloadedCount,
      underutilizedCount,
      highestFaculty: highest?.weeklyHours > 0 ? highest : null,
      lowestFaculty: lowest || null,
    };
  }, [facultyList, workloads, workloadRecords]);

  // Chart data: department-wise teaching hours
  const departmentChartData = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      map[d.code] = { name: d.code, department: d.name, hours: 0, facultyCount: 0 };
    });

    workloadRecords.forEach((r) => {
      if (map[r.departmentCode]) {
        map[r.departmentCode].hours += r.weeklyHours;
        map[r.departmentCode].facultyCount += 1;
      }
    });

    return Object.values(map);
  }, [departments, workloadRecords]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return workloadRecords.filter((r) => {
      const matchDept = selectedDept === 'ALL' || r.departmentCode === selectedDept;
      const matchDesig = selectedDesignation === 'ALL' || r.designation === selectedDesignation;
      const matchStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.facCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.departmentCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDept && matchDesig && matchStatus && matchSearch;
    });
  }, [workloadRecords, selectedDept, selectedDesignation, selectedStatus, searchQuery]);

  // Available courses for the selected faculty member in form (matching department)
  const availableCoursesForFaculty = useMemo(() => {
    if (!formFacultyId) return [];
    const faculty = facultyList.find((f) => f.id === formFacultyId);
    if (!faculty) return [];
    return courses.filter((c) => c.departmentCode === faculty.departmentCode);
  }, [formFacultyId, facultyList, courses]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    const firstFac = facultyList[0]?.id || '';
    setFormFacultyId(firstFac);
    setFormCourseIds([]);
    setFormWeeklyHours(12);
    setFormResponsibilities([]);
    setCustomResp('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (record) => {
    setEditingItem(record);
    setFormFacultyId(record.facultyId);
    setFormCourseIds(record.courseIds);
    setFormWeeklyHours(record.weeklyHours);
    setFormResponsibilities(record.additionalResponsibilities || []);
    setCustomResp('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formFacultyId) {
      setFormError('Please select a faculty member.');
      return;
    }

    const hours = Number(formWeeklyHours);
    if (isNaN(hours) || hours < 0 || hours > 40) {
      setFormError('Teaching hours must be between 0 and 40.');
      return;
    }

    // Determine status
    let status = 'Normal';
    if (hours > 18) status = 'Overloaded';
    else if (hours < 8) status = 'Underutilized';

    if (editingItem && editingItem.workloadId) {
      // Update existing
      dispatch(
        updateWorkload({
          id: editingItem.workloadId,
          facultyId: formFacultyId,
          courseIds: formCourseIds,
          weeklyHours: hours,
          additionalResponsibilities: formResponsibilities,
          status,
        })
      );
      addToast('Faculty workload updated successfully.', 'success');
    } else {
      // Add new
      const newId = 'wl-' + Date.now();
      dispatch(
        addWorkload({
          id: newId,
          facultyId: formFacultyId,
          courseIds: formCourseIds,
          weeklyHours: hours,
          additionalResponsibilities: formResponsibilities,
          status,
        })
      );
      addToast('Faculty workload assigned successfully.', 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (deleteConfirm.id) {
      dispatch(deleteWorkload(deleteConfirm.id));
      addToast(`Workload record for ${deleteConfirm.facultyName} removed.`, 'info');
      setDeleteConfirm({ isOpen: false, id: null, facultyName: '' });
    }
  };

  // Toggle course selection in form
  const toggleCourseSelection = (courseId) => {
    setFormCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Toggle responsibility
  const toggleResponsibility = (resp) => {
    setFormResponsibilities((prev) =>
      prev.includes(resp) ? prev.filter((r) => r !== resp) : [...prev, resp]
    );
  };

  const handleAddCustomResp = () => {
    if (customResp.trim() && !formResponsibilities.includes(customResp.trim())) {
      setFormResponsibilities((prev) => [...prev, customResp.trim()]);
      setCustomResp('');
    }
  };

  // Designations list for filter
  const designations = useMemo(() => {
    const set = new Set(facultyList.map((f) => f.designation));
    return Array.from(set);
  }, [facultyList]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className="page-title">Faculty Workload</h1>
          <p className="page-subtitle">
            Manage teaching loads, course allocations, and academic responsibilities across departments.
          </p>
        </div>
        <button
          type="button"
          className="btn-dark"
          onClick={handleOpenCreateModal}
        >
          <Plus size={16} />
          Assign Workload
        </button>
      </div>

      {/* ── Stats Dashboard (4 Primary KPIs) ── */}
      <div className={styles.statsGrid}>
        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalFaculty}</span>
            <span className={styles.statLabel}>Total Faculty Members</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(143, 132, 232, 0.2)' }}>
            <Users size={22} color="var(--chart-purple)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={1} className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalAssignedCourses}</span>
            <span className={styles.statLabel}>Assigned Courses</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(127, 178, 238, 0.2)' }}>
            <BookOpen size={22} color="var(--chart-blue)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={2} className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalWeeklyHours} hrs</span>
            <span className={styles.statLabel}>Total Weekly Hours</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(52, 199, 89, 0.2)' }}>
            <Clock size={22} color="#2d9f4e" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.avgHours} hrs</span>
            <span className={styles.statLabel}>Avg Workload / Faculty</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(242, 167, 195, 0.2)' }}>
            <BarChart3 size={22} color="var(--chart-pink)" />
          </div>
        </ToneCardWrapper>
      </div>

      {/* ── Workload Status Overview Highlights ── */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(179, 38, 30, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
                {stats.overloadedCount}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Overloaded (&gt;18 hrs)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255, 179, 64, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b8860b',
              }}
            >
              <TrendingDown size={18} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
                {stats.underutilizedCount}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Underutilized (&lt;8 hrs)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(143, 132, 232, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--chart-purple)',
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                {stats.highestFaculty ? stats.highestFaculty.fullName : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                Highest: {stats.highestFaculty?.weeklyHours || 0} hrs/wk
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(52, 199, 89, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d9f4e',
              }}
            >
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                {stats.lowestFaculty ? stats.lowestFaculty.fullName : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                Lowest: {stats.lowestFaculty?.weeklyHours || 0} hrs/wk
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Department Workload Analysis Chart ── */}
      <div className={`glass-panel ${styles.chartContainer}`}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className="panel-title">Department Workload Distribution</h3>
            <p className="panel-subtitle">Total weekly teaching hours allocated across academic departments</p>
          </div>
          <div className={styles.chartLegend}>
            <span>
              <span className={styles.legendDot} style={{ background: '#8f84e8' }} />
              Weekly Teaching Hours
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--ink-soft)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--ink-soft)', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 12,
                          padding: '8px 12px',
                          fontSize: 12,
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                          color: '#15131f',
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{data.department} ({data.name})</div>
                        <div style={{ color: 'var(--ink-soft)', marginTop: 2 }}>
                          Total Hours: <strong>{data.hours} hrs/week</strong>
                        </div>
                        <div style={{ color: 'var(--ink-soft)' }}>
                          Faculty: <strong>{data.facultyCount} members</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="hours" fill="#8f84e8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Workload Records Table ── */}
      <div className={`glass-panel ${styles.tableContainer}`}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className="panel-title">Faculty Workload Records</h3>
            <p className="panel-subtitle">
              Detailed teaching assignments, weekly hours, and administrative roles
            </p>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div className={styles.filterBar}>
          <div className={styles.filterLabel}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search faculty name, code, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '6px 8px',
                fontSize: 13,
                outline: 'none',
                color: 'var(--ink)',
                minWidth: 220,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className={styles.filterLabel}>
              <Filter size={14} />
              <span>Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterLabel}>
              <span>Designation:</span>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
              >
                <option value="ALL">All Designations</option>
                {designations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterLabel}>
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Normal">Normal (8–18 hrs)</option>
                <option value="Overloaded">Overloaded (&gt;18 hrs)</option>
                <option value="Underutilized">Underutilized (&lt;8 hrs)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No workload records match filters"
            subtext="Try adjusting your department, designation, or search criteria."
          />
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Faculty Member</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Assigned Courses</th>
                <th>Weekly Hours</th>
                <th>Additional Responsibilities</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const statusClass =
                  r.status === 'Overloaded'
                    ? styles.statusOverloaded
                    : r.status === 'Underutilized'
                    ? styles.statusUnderutilized
                    : styles.statusNormal;

                return (
                  <tr key={r.facultyId} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={r.fullName} size={34} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.fullName}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
                            {r.facCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className={styles.tableCell}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor: 'var(--field)',
                          color: 'var(--ink)',
                        }}
                      >
                        {r.departmentCode}
                      </span>
                    </td>

                    <td className={styles.tableCell}>
                      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{r.designation}</span>
                    </td>

                    <td className={styles.tableCellWrap}>
                      {r.assignedCourses.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {r.assignedCourses.map((c) => (
                            <span
                              key={c.id}
                              style={{
                                padding: '2px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                backgroundColor: 'rgba(127, 178, 238, 0.15)',
                                color: 'var(--ink)',
                                border: '1px solid rgba(127, 178, 238, 0.3)',
                              }}
                              title={c.courseName}
                            >
                              {c.courseCode}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                          No courses assigned
                        </span>
                      )}
                    </td>

                    <td className={styles.tableCell}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.weeklyHours} hrs/wk</span>
                    </td>

                    <td className={styles.tableCellWrap}>
                      {r.additionalResponsibilities.length > 0 ? (
                        <div className={styles.responsibilityChipWrapper}>
                          {r.additionalResponsibilities.map((resp, idx) => (
                            <span key={idx} className={styles.responsibilityChip}>
                              {resp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                          None
                        </span>
                      )}
                    </td>

                    <td className={styles.tableCell}>
                      <span className={`${styles.statusPill} ${statusClass}`}>
                        {r.status}
                      </span>
                    </td>

                    <td className={styles.tableCell} style={{ textAlign: 'right' }}>
                      <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleOpenEditModal(r)}
                          title="Edit workload"
                        >
                          <Edit3 size={15} />
                        </button>
                        {r.workloadId && (
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                id: r.workloadId,
                                facultyName: r.fullName,
                              })
                            }
                            title="Remove workload record"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Assign / Edit Workload Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Workload: ${editingItem.fullName}` : 'Assign Faculty Workload'}
        maxWidth={580}
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formError && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: 'rgba(179, 38, 30, 0.1)',
                color: 'var(--danger)',
                fontSize: 13,
              }}
            >
              {formError}
            </div>
          )}

          {/* Select Faculty */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Faculty Member</label>
            <select
              className={styles.formSelect}
              value={formFacultyId}
              disabled={!!editingItem}
              onChange={(e) => {
                setFormFacultyId(e.target.value);
                setFormCourseIds([]); // reset course selection for new faculty department
              }}
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.fullName} ({f.facultyId}) — {f.departmentCode} — {f.designation}
                </option>
              ))}
            </select>
          </div>

          {/* Select Department Courses (Multi-checkbox) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Assign Courses (Department Relevant)
            </label>
            <span className={styles.formHint}>
              Select courses offered by the faculty member's department
            </span>
            <div className={styles.courseCheckboxGrid}>
              {availableCoursesForFaculty.length === 0 ? (
                <div style={{ padding: 12, fontSize: 13, color: 'var(--ink-soft)' }}>
                  No courses listed for this department.
                </div>
              ) : (
                availableCoursesForFaculty.map((c) => (
                  <label key={c.id} className={styles.courseCheckboxItem}>
                    <input
                      type="checkbox"
                      checked={formCourseIds.includes(c.id)}
                      onChange={() => toggleCourseSelection(c.id)}
                    />
                    <span>
                      <strong>{c.courseCode}</strong> — {c.courseName} ({c.credits} credits)
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Weekly Teaching Hours */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Weekly Teaching Hours (0–40)</label>
              <input
                type="number"
                min="0"
                max="40"
                className={styles.formInput}
                value={formWeeklyHours}
                onChange={(e) => setFormWeeklyHours(e.target.value)}
                required
              />
              <div className={styles.statusPreview}>
                <span>Calculated status:</span>
                <span
                  className={`${styles.statusPill} ${
                    Number(formWeeklyHours) > 18
                      ? styles.statusOverloaded
                      : Number(formWeeklyHours) < 8
                      ? styles.statusUnderutilized
                      : styles.statusNormal
                  }`}
                >
                  {Number(formWeeklyHours) > 18
                    ? 'Overloaded (>18 hrs)'
                    : Number(formWeeklyHours) < 8
                    ? 'Underutilized (<8 hrs)'
                    : 'Normal (8–18 hrs)'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Responsibilities */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Additional Academic Responsibilities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {COMMON_RESPONSIBILITIES.map((r) => {
                const isSelected = formResponsibilities.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleResponsibility(r)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--ink)' : 'var(--field)',
                      color: isSelected ? '#ffffff' : 'var(--ink)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Or add custom role (e.g. NAAC Lead)..."
                value={customResp}
                onChange={(e) => setCustomResp(e.target.value)}
                className={styles.formInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomResp();
                  }
                }}
              />
              <button
                type="button"
                className="btn-translucent"
                onClick={handleAddCustomResp}
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              className="btn-translucent"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-dark">
              {editingItem ? 'Save Changes' : 'Assign Workload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Remove Workload Record"
        message={`Are you sure you want to remove the workload record for ${deleteConfirm.facultyName}? This will reset their weekly hours and unassign allocated courses.`}
        confirmLabel="Remove"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, facultyName: '' })}
      />
    </div>
  );
};
