import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { addMeeting } from '@/redux/slices/meetingsSlice';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/components/common/Toast';
import { ToneCardWrapper } from '@/styles/styledComponents';
import styles from '@/components/meetings/Meetings.module.css';

export const MeetingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const meetings = useAppSelector((state) => state.meetings.items);
  const departments = useAppSelector((state) => state.departments.items);
  const allFaculty = useAppSelector((state) => state.faculty.items);

  // Filters
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentCode, setDepartmentCode] = useState(departments[0]?.code || 'CSE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [venue, setVenue] = useState('Department Conference Hall');
  const [coordinatorId, setCoordinatorId] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [agenda, setAgenda] = useState('');
  const [formError, setFormError] = useState('');

  // Faculty matching chosen form department
  const formDeptFaculty = useMemo(() => {
    return allFaculty.filter((f) => f.departmentCode === departmentCode);
  }, [allFaculty, departmentCode]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = meetings.length;
    const upcoming = meetings.filter((m) => m.status === 'Upcoming').length;
    const completed = meetings.filter((m) => m.status === 'Completed').length;
    const cancelled = meetings.filter((m) => m.status === 'Cancelled').length;

    let pendingActions = 0;
    meetings.forEach((m) => {
      m.actionItems?.forEach((ai) => {
        if (ai.status !== 'Completed') pendingActions++;
      });
    });

    return { total, upcoming, completed, cancelled, pendingActions };
  }, [meetings]);

  // Filtered list
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchDept = selectedDept === 'ALL' || m.departmentCode === selectedDept;
      const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.coordinator?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDept && matchStatus && matchSearch;
    });
  }, [meetings, selectedDept, selectedStatus, searchQuery]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setTitle('');
    setDescription('');
    const defaultDept = departments[0]?.code || 'CSE';
    setDepartmentCode(defaultDept);
    const initialFac = allFaculty.filter((f) => f.departmentCode === defaultDept);
    setCoordinatorId(initialFac[0]?.id || '');
    setSelectedParticipants(initialFac.map((f) => f.id));
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('10:00');
    setEndTime('11:30');
    setVenue('Department Conference Room');
    setAgenda('');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  // Submit Meeting Form
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a meeting title.');
      return;
    }

    const coord = allFaculty.find((f) => f.id === coordinatorId);

    const newMeeting = {
      id: 'meet-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      departmentCode,
      date,
      startTime,
      endTime,
      venue: venue.trim(),
      coordinator: coord ? coord.fullName : 'HOD',
      coordinatorFacultyId: coordinatorId,
      participants: selectedParticipants,
      agenda: agenda.trim(),
      status: 'Upcoming',
      minutes: { summary: '', discussionPoints: '', decisions: '', notes: '' },
      actionItems: [],
      createdAt: new Date().toISOString(),
    };

    dispatch(addMeeting(newMeeting));
    addToast('Department meeting scheduled successfully.', 'success');
    setIsCreateModalOpen(false);
  };

  const toggleParticipant = (facId) => {
    setSelectedParticipants((prev) =>
      prev.includes(facId) ? prev.filter((id) => id !== facId) : [...prev, facId]
    );
  };

  return (
    <div className={styles.container}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className="page-title">Department Meetings</h1>
          <p className="page-subtitle">
            Schedule department assemblies, record formal minutes of meeting (MOM), and track action items.
          </p>
        </div>
        <button
          type="button"
          className="btn-dark"
          onClick={handleOpenCreateModal}
        >
          <Plus size={16} />
          Schedule Meeting
        </button>
      </div>

      {/* ── Stats Dashboard ── */}
      <div className={styles.statsGrid}>
        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Meetings</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(143, 132, 232, 0.2)' }}>
            <Calendar size={22} color="var(--chart-purple)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={1} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.upcoming}</div>
            <div className={styles.statLabel}>Upcoming Sessions</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(127, 178, 238, 0.2)' }}>
            <Clock size={22} color="var(--chart-blue)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={2} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Concluded / Minutes Filed</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(52, 199, 89, 0.2)' }}>
            <CheckCircle2 size={22} color="#2d9f4e" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.pendingActions}</div>
            <div className={styles.statLabel}>Open Action Items</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(242, 167, 195, 0.2)' }}>
            <AlertCircle size={22} color="var(--chart-pink)" />
          </div>
        </ToneCardWrapper>
      </div>

      {/* ── Filter Bar ── */}
      <div className={`glass-panel ${styles.filterBar}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={15} color="var(--ink-soft)" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search meetings by title, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-soft)' }}>
            <Filter size={13} />
            <span>Dept:</span>
          </div>
          <select
            className={styles.filterSelect}
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

          <select
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Meetings Grid ── */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          title="No department meetings found"
          subtext="Schedule your first departmental assembly or adjust filter parameters."
          action={
            <button
              type="button"
              className="btn-dark"
              onClick={handleOpenCreateModal}
            >
              <Plus size={15} />
              Schedule New Meeting
            </button>
          }
        />
      ) : (
        <div className={styles.meetingsGrid}>
          {filteredMeetings.map((meeting) => {
            const statusClass =
              meeting.status === 'Completed'
                ? styles.statusCompleted
                : meeting.status === 'Cancelled'
                ? styles.statusCancelled
                : styles.statusUpcoming;

            const pendingActionCount =
              meeting.actionItems?.filter((a) => a.status !== 'Completed').length || 0;

            return (
              <div
                key={meeting.id}
                className={styles.meetingCard}
                onClick={() => navigate(`/meetings/${meeting.id}`)}
              >
                <div className={styles.meetingCardTop}>
                  <div className={styles.meetingCardHeader}>
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
                      {meeting.departmentCode}
                    </span>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {meeting.status}
                    </span>
                  </div>

                  <h3 className={styles.meetingTitle}>{meeting.title}</h3>

                  <div className={styles.meetingMetaRow}>
                    <Calendar size={13} />
                    <span>{meeting.date} ({meeting.startTime} – {meeting.endTime})</span>
                  </div>

                  <div className={styles.meetingMetaRow}>
                    <MapPin size={13} />
                    <span>{meeting.venue || 'TBD'}</span>
                  </div>

                  <div className={styles.meetingMetaRow}>
                    <Users size={13} />
                    <span>Lead: {meeting.coordinator}</span>
                  </div>
                </div>

                <div className={styles.meetingCardBottom}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} />
                    <span>
                      {meeting.minutes?.summary
                        ? 'Minutes Recorded'
                        : 'No Minutes Yet'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    {pendingActionCount > 0 ? (
                      <span style={{ color: 'var(--chart-pink)' }}>
                        {pendingActionCount} tasks open
                      </span>
                    ) : (
                      <span style={{ color: 'var(--ink-soft)' }}>
                        {meeting.actionItems?.length || 0} tasks
                      </span>
                    )}
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Schedule Meeting Modal ── */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Department Meeting"
        maxWidth={580}
      >
        <form onSubmit={handleCreateMeeting} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {formError && (
            <div style={{ color: 'var(--danger)', fontSize: 13, background: 'rgba(179,38,30,0.1)', padding: '8px 12px', borderRadius: 8 }}>
              {formError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Meeting Title *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. End of Semester Curriculum Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Department</label>
              <select
                className={styles.formSelectInput}
                value={departmentCode}
                onChange={(e) => {
                  const newDept = e.target.value;
                  setDepartmentCode(newDept);
                  const facs = allFaculty.filter((f) => f.departmentCode === newDept);
                  setCoordinatorId(facs[0]?.id || '');
                  setSelectedParticipants(facs.map((f) => f.id));
                }}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Coordinator</label>
              <select
                className={styles.formSelectInput}
                value={coordinatorId}
                onChange={(e) => setCoordinatorId(e.target.value)}
              >
                {formDeptFaculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName} ({f.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Start Time</label>
              <input
                type="time"
                className={styles.formInput}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>End Time</label>
              <input
                type="time"
                className={styles.formInput}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Venue / Room</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Innovation Hall, Room 402"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Agenda & Topics</label>
            <textarea
              rows={2}
              className={styles.formTextarea}
              placeholder="List primary objectives and agenda points..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Invited Faculty Members</label>
            <div style={{ maxHeight: 130, overflowY: 'auto', background: 'var(--field)', padding: 10, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {formDeptFaculty.map((fac) => (
                <label key={fac.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(fac.id)}
                    onChange={() => toggleParticipant(fac.id)}
                  />
                  <span>{fac.fullName} — {fac.designation}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="btn-translucent"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-dark">
              Schedule Meeting
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
