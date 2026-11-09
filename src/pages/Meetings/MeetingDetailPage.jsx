import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Save,
  FileText,
  ListTodo,
  Check,
  XCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  updateMeeting,
  deleteMeeting,
  updateMinutes,
  addActionItem,
  updateActionItem,
  deleteActionItem,
} from '@/redux/slices/meetingsSlice';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/components/common/Toast';
import styles from '@/components/meetings/Meetings.module.css';

export const MeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const meetings = useAppSelector((state) => state.meetings.items);
  const allFaculty = useAppSelector((state) => state.faculty.items);
  const departments = useAppSelector((state) => state.departments.items);

  const meeting = useMemo(() => {
    return meetings.find((m) => m.id === id);
  }, [meetings, id]);

  const [activeTab, setActiveTab] = useState('minutes'); // 'minutes' | 'actions'

  // Minutes Form State
  const [summary, setSummary] = useState(meeting?.minutes?.summary || '');
  const [discussionPoints, setDiscussionPoints] = useState(
    meeting?.minutes?.discussionPoints || ''
  );
  const [decisions, setDecisions] = useState(meeting?.minutes?.decisions || '');
  const [notes, setNotes] = useState(meeting?.minutes?.notes || '');

  // Add Action Item Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionAssignee, setActionAssignee] = useState('');
  const [actionDeadline, setActionDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [actionPriority, setActionPriority] = useState('Medium'); // High, Medium, Low

  // Delete Meeting Dialog
  const [isDeleteMeetingOpen, setIsDeleteMeetingOpen] = useState(false);

  // Sync state if meeting loads
  React.useEffect(() => {
    if (meeting) {
      setSummary(meeting.minutes?.summary || '');
      setDiscussionPoints(meeting.minutes?.discussionPoints || '');
      setDecisions(meeting.minutes?.decisions || '');
      setNotes(meeting.minutes?.notes || '');
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Meeting not found</h2>
        <button
          type="button"
          className="btn-dark"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/meetings')}
        >
          <ArrowLeft size={16} /> Back to Meetings
        </button>
      </div>
    );
  }

  // Participants list with full names
  const participantsList = allFaculty.filter((f) =>
    meeting.participants?.includes(f.id)
  );

  // Department faculty for assigning action items
  const deptFaculty = allFaculty.filter(
    (f) => f.departmentCode === meeting.departmentCode
  );

  // Save Minutes
  const handleSaveMinutes = (e) => {
    e.preventDefault();
    dispatch(
      updateMinutes({
        meetingId: meeting.id,
        minutes: {
          summary,
          discussionPoints,
          decisions,
          notes,
        },
      })
    );
    // If not completed yet, prompt or set as completed
    if (meeting.status === 'Upcoming') {
      dispatch(updateMeeting({ id: meeting.id, status: 'Completed' }));
    }
    addToast('Meeting minutes saved and recorded.', 'success');
  };

  // Add Action Item
  const handleAddActionItem = (e) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    const newItem = {
      id: 'ai-' + Date.now(),
      title: actionTitle.trim(),
      description: actionDesc.trim(),
      assignedFacultyId: actionAssignee || deptFaculty[0]?.id || '',
      deadline: actionDeadline,
      priority: actionPriority,
      status: 'Pending',
    };

    dispatch(
      addActionItem({
        meetingId: meeting.id,
        actionItem: newItem,
      })
    );

    addToast('Action item assigned.', 'success');
    setIsActionModalOpen(false);
    setActionTitle('');
    setActionDesc('');
  };

  // Cycle Action Item Status
  const handleCycleActionStatus = (actionItem) => {
    const nextStatus =
      actionItem.status === 'Pending'
        ? 'In Progress'
        : actionItem.status === 'In Progress'
        ? 'Completed'
        : 'Pending';

    dispatch(
      updateActionItem({
        meetingId: meeting.id,
        actionItemId: actionItem.id,
        updates: { status: nextStatus },
      })
    );
  };

  // Delete Action Item
  const handleDeleteActionItem = (actionItemId) => {
    dispatch(deleteActionItem({ meetingId: meeting.id, actionItemId }));
    addToast('Action item removed.', 'info');
  };

  // Delete Entire Meeting
  const handleDeleteMeeting = () => {
    dispatch(deleteMeeting(meeting.id));
    addToast('Meeting deleted permanently.', 'info');
    navigate('/meetings');
  };

  // Toggle Status
  const handleToggleStatus = (newStatus) => {
    dispatch(updateMeeting({ id: meeting.id, status: newStatus }));
    addToast(`Meeting status marked as ${newStatus}.`, 'success');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Back button ── */}
      <div>
        <button
          type="button"
          className="btn-translucent"
          onClick={() => navigate('/meetings')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={14} /> Back to Meetings
        </button>
      </div>

      {/* ── Meeting Header Panel ── */}
      <div className={`glass-panel ${styles.detailHeader}`}>
        <div className={styles.detailTitleRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: 'var(--field)',
                  color: 'var(--ink)',
                }}
              >
                Department of {meeting.departmentCode}
              </span>
              <span
                className={`${styles.statusBadge} ${
                  meeting.status === 'Completed'
                    ? styles.statusCompleted
                    : meeting.status === 'Cancelled'
                    ? styles.statusCancelled
                    : styles.statusUpcoming
                }`}
              >
                {meeting.status}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>
              {meeting.title}
            </h1>
            {meeting.description && (
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>
                {meeting.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {meeting.status === 'Upcoming' && (
              <button
                type="button"
                className="btn-dark"
                onClick={() => handleToggleStatus('Completed')}
              >
                <CheckCircle2 size={15} /> Mark Completed
              </button>
            )}

            {meeting.status !== 'Cancelled' && (
              <button
                type="button"
                className="btn-translucent"
                onClick={() => handleToggleStatus('Cancelled')}
              >
                <XCircle size={15} /> Cancel Session
              </button>
            )}

            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => setIsDeleteMeetingOpen(true)}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        {/* ── Metadata Grid ── */}
        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <Calendar size={18} color="var(--chart-purple)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Date</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{meeting.date}</div>
            </div>
          </div>

          <div className={styles.metaCard}>
            <Clock size={18} color="var(--chart-blue)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Schedule</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {meeting.startTime} – {meeting.endTime}
              </div>
            </div>
          </div>

          <div className={styles.metaCard}>
            <MapPin size={18} color="#2d9f4e" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Venue</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{meeting.venue || 'TBD'}</div>
            </div>
          </div>

          <div className={styles.metaCard}>
            <Users size={18} color="var(--chart-pink)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Meeting Coordinator</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{meeting.coordinator}</div>
            </div>
          </div>
        </div>

        {/* ── Attendees list ── */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8 }}>
            Attending Faculty Members ({participantsList.length}):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {participantsList.map((fac) => (
              <div
                key={fac.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  backgroundColor: 'var(--field)',
                  fontSize: 12,
                }}
              >
                <Avatar name={fac.fullName} size={22} />
                <span>{fac.fullName}</span>
              </div>
            ))}
          </div>
        </div>

        {meeting.agenda && (
          <div style={{ marginTop: 12, padding: 12, background: 'var(--field)', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Agenda Outline:
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', whiteSpace: 'pre-line' }}>
              {meeting.agenda}
            </p>
          </div>
        )}
      </div>

      {/* ── Tabs Navigation ── */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'minutes' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('minutes')}
        >
          <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
          Minutes of Meeting (MOM)
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'actions' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <ListTodo size={14} style={{ display: 'inline', marginRight: 6 }} />
          Action Items & Tasks ({meeting.actionItems?.length || 0})
        </button>
      </div>

      {/* ── Tab 1: Minutes Form ── */}
      {activeTab === 'minutes' && (
        <form onSubmit={handleSaveMinutes} className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 className="panel-title">Official Meeting Minutes</h3>
              <p className="panel-subtitle">Record deliberations, decisions taken, and key points</p>
            </div>
            <button type="submit" className="btn-dark">
              <Save size={15} /> Save Minutes
            </button>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Executive Summary</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="High-level overview of meeting conclusions..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Key Discussion Points</label>
            <textarea
              rows={4}
              className={styles.formTextarea}
              placeholder="1. Curriculum modernization...&#10;2. Lab infrastructure update..."
              value={discussionPoints}
              onChange={(e) => setDiscussionPoints(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Formal Decisions Taken</label>
            <textarea
              rows={3}
              className={styles.formTextarea}
              placeholder="List specific policies or actions approved..."
              value={decisions}
              onChange={(e) => setDecisions(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Important Notes & Adjourn Remarks</label>
            <textarea
              rows={2}
              className={styles.formTextarea}
              placeholder="Next meeting date, follow-up timelines..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="submit" className="btn-dark">
              <Save size={15} /> Record Minutes
            </button>
          </div>
        </form>
      )}

      {/* ── Tab 2: Action Items ── */}
      {activeTab === 'actions' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 className="panel-title">Action Items & Deliverables</h3>
              <p className="panel-subtitle">Assigned responsibilities and follow-up deadlines</p>
            </div>
            <button
              type="button"
              className="btn-dark"
              onClick={() => {
                setActionAssignee(deptFaculty[0]?.id || '');
                setIsActionModalOpen(true);
              }}
            >
              <Plus size={15} /> Add Action Item
            </button>
          </div>

          {meeting.actionItems?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
              No action items assigned for this meeting yet. Click "Add Action Item" to delegate tasks.
            </div>
          ) : (
            <div>
              {meeting.actionItems.map((item) => {
                const isOverdue =
                  item.deadline < todayStr && item.status !== 'Completed';
                const assignee = allFaculty.find(
                  (f) => f.id === item.assignedFacultyId
                );

                const priorityClass =
                  item.priority === 'High'
                    ? styles.priorityHigh
                    : item.priority === 'Low'
                    ? styles.priorityLow
                    : styles.priorityMedium;

                return (
                  <div key={item.id} className={styles.actionItemCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <button
                        type="button"
                        onClick={() => handleCycleActionStatus(item)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: '2px solid var(--glass-border)',
                          backgroundColor:
                            item.status === 'Completed'
                              ? '#34c759'
                              : item.status === 'In Progress'
                              ? 'var(--chart-blue)'
                              : 'transparent',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        title={`Click to cycle status: currently ${item.status}`}
                      >
                        {item.status === 'Completed' && <Check size={16} />}
                        {item.status === 'In Progress' && <Clock3 size={14} />}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              textDecoration:
                                item.status === 'Completed' ? 'line-through' : 'none',
                              color:
                                item.status === 'Completed'
                                  ? 'var(--ink-soft)'
                                  : 'var(--ink)',
                            }}
                          >
                            {item.title}
                          </span>
                          <span className={`${styles.statusBadge} ${priorityClass}`}>
                            {item.priority}
                          </span>
                          {isOverdue && (
                            <span className={styles.overdueBadge}>
                              <AlertTriangle size={11} style={{ display: 'inline', marginRight: 3 }} />
                              Overdue
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                            {item.description}
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, fontSize: 11, color: 'var(--ink-soft)' }}>
                          <span>Assigned to: <strong>{assignee ? assignee.fullName : 'Faculty'}</strong></span>
                          <span>Deadline: <strong>{item.deadline}</strong></span>
                          <span>Status: <strong>{item.status}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteActionItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ink-soft)',
                        cursor: 'pointer',
                        padding: 6,
                      }}
                      title="Delete action item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Add Action Item Modal ── */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Create Action Item / Task"
        maxWidth={500}
      >
        <form onSubmit={handleAddActionItem} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Task Title *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Prepare revised syllabus for CS401"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              rows={2}
              className={styles.formTextarea}
              placeholder="Specific deliverables or requirements..."
              value={actionDesc}
              onChange={(e) => setActionDesc(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Assigned Faculty</label>
              <select
                className={styles.formSelectInput}
                value={actionAssignee}
                onChange={(e) => setActionAssignee(e.target.value)}
              >
                {deptFaculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Priority</label>
              <select
                className={styles.formSelectInput}
                value={actionPriority}
                onChange={(e) => setActionPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Deadline</label>
            <input
              type="date"
              className={styles.formInput}
              value={actionDeadline}
              onChange={(e) => setActionDeadline(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn-translucent"
              onClick={() => setIsActionModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-dark">
              Assign Task
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Confirm Delete Meeting Dialog ── */}
      <ConfirmDialog
        isOpen={isDeleteMeetingOpen}
        title="Delete Department Meeting"
        message={`Are you sure you want to delete "${meeting.title}"? This will permanently remove its recorded minutes and all associated action items.`}
        confirmLabel="Delete Meeting"
        onConfirm={handleDeleteMeeting}
        onCancel={() => setIsDeleteMeetingOpen(false)}
      />
    </div>
  );
};
