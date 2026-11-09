import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { deleteDepartment } from '@/redux/slices/departmentSlice';
import { useToast } from '@/components/common/Toast';
import { ToneCardWrapper } from '@/styles/styledComponents';
import { StatusPill } from '@/components/common/StatusPill';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Avatar } from '@/components/common/Avatar';
import styles from '@/components/departments/Departments.module.css';

export const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('faculty');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const department = useAppSelector((state) =>
    state.departments.items.find((d) => d.id === id)
  );

  const faculty = useAppSelector((state) =>
    state.faculty.items.filter((f) => f.departmentCode === department?.code)
  );

  const students = useAppSelector((state) =>
    state.students.items.filter((s) => s.departmentCode === department?.code)
  );

  const courses = useAppSelector((state) =>
    state.courses.items.filter((c) => c.departmentCode === department?.code)
  );

  if (!department) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Department Not Found</h2>
        <p style={{ color: 'var(--ink-soft)', margin: '10px 0 20px' }}>
          The requested department could not be located in academic records.
        </p>
        <Link to="/departments" className="btn-dark">
          Return to Departments
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch(deleteDepartment(department.id));
    addToast(`Department "${department.name}" deleted.`, 'info');
    navigate('/departments');
  };

  return (
    <div className={styles.deptContainer}>
      {/* Top Navigation Link */}
      <div>
        <Link
          to="/departments"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} /> Back to all departments
        </Link>
      </div>

      {/* Hero Panel Tinted with Lavender/Blue Tone */}
      <ToneCardWrapper
        $tone={0}
        className={styles.detailHero}
        style={{ minHeight: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  backgroundColor: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--ink)',
                }}
              >
                {department.code}
              </span>
              <StatusPill status={department.status} />
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 500, color: 'var(--ink)' }}>
              {department.name}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8, maxWidth: 680, lineHeight: 1.5 }}>
              {department.description || 'Premier academic division maintaining excellence in research, curriculum instruction, and student mentorship.'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn-translucent btn-danger-pill"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* HOD and Meta Contact Details */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        >
          <div>
            <span style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'block', textTransform: 'uppercase' }}>
              Head of Department
            </span>
            <strong>{department.hod}</strong>
          </div>

          {department.email && (
            <div>
              <span style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'block', textTransform: 'uppercase' }}>
                Email
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Mail size={13} color="var(--ink-soft)" />
                {department.email}
              </span>
            </div>
          )}

          {department.contactNumber && (
            <div>
              <span style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'block', textTransform: 'uppercase' }}>
                Contact
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={13} color="var(--ink-soft)" />
                {department.contactNumber}
              </span>
            </div>
          )}

          <div>
            <span style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'block', textTransform: 'uppercase' }}>
              Established
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} color="var(--ink-soft)" />
              {department.establishedYear}
            </span>
          </div>
        </div>
      </ToneCardWrapper>

      {/* 4 Small Rounded Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Registered Faculty</span>
          <div style={{ fontSize: 26, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>
            {faculty.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Enrolled Students</span>
          <div style={{ fontSize: 26, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>
            {students.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Degree Courses</span>
          <div style={{ fontSize: 26, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>
            {courses.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Establishment</span>
          <div style={{ fontSize: 26, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>
            {department.establishedYear}
          </div>
        </div>
      </div>

      {/* Segmented Pill Tabs for Faculty, Students, Courses */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: 999,
            padding: 4,
            border: '1px solid rgba(255, 255, 255, 0.7)',
            marginBottom: 16,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: activeTab === 'faculty' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'faculty' ? '#ffffff' : 'var(--ink-soft)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Faculty ({faculty.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: activeTab === 'students' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'students' ? '#ffffff' : 'var(--ink-soft)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Students ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: activeTab === 'courses' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'courses' ? '#ffffff' : 'var(--ink-soft)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Courses ({courses.length})
          </button>
        </div>

        {/* Tab Content: Faculty */}
        {activeTab === 'faculty' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {faculty.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>No faculty assigned yet.</p>
            ) : (
              faculty.map((f) => (
                <div key={f.id} className="glass-panel" style={{ padding: 18, borderRadius: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={f.fullName} size={40} />
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 500 }}>{f.fullName}</h4>
                      <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{f.designation}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 10 }}>
                    Specialization: <strong>{f.specialization}</strong>
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Students */}
        {activeTab === 'students' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {students.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>No students enrolled yet.</p>
            ) : (
              students.map((s) => (
                <div key={s.id} className="glass-panel" style={{ padding: 18, borderRadius: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.fullName} size={36} />
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 500 }}>{s.fullName}</h4>
                        <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{s.studentId}</span>
                      </div>
                    </div>
                    <StatusPill status={s.enrollmentStatus} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 12, color: 'var(--ink-soft)' }}>
                    <span>Sem {s.semester}</span>
                    <span>GPA: {s.gpa}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Courses */}
        {activeTab === 'courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {courses.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>No courses offered yet.</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="glass-panel" style={{ padding: 18, borderRadius: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        backgroundColor: 'var(--field)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {c.courseCode}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{c.credits} Credits</span>
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 500, margin: '8px 0 4px' }}>{c.courseName}</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                    {c.description}
                  </p>
                  {c.assignedFacultyName && (
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-soft)' }}>
                      Faculty: <strong>{c.assignedFacultyName}</strong>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete ${department.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
