import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Calendar, Users, BookOpen } from 'lucide-react';

export default function DepartmentDetail({ department, serverRenderedAt }) {
  if (!department) {
    return (
      <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center' }}>
        <h2>Department not found</h2>
        <Link href="/" className="btn-dark" style={{ marginTop: 20 }}>
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, margin: '40px auto', padding: '0 20px' }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--ink-soft)',
          textDecoration: 'none',
          marginBottom: 20,
          fontSize: 14,
        }}
      >
        <ArrowLeft size={16} /> Back to Departments
      </Link>

      <div className="glass-panel" style={{ padding: 36, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span
            style={{
              backgroundColor: '#fff',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {department.code}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            SSR Dynamic Route: <code>/departments/[id].js</code>
          </span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 8 }}>
          {department.name}
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, maxWidth: 640 }}>
          {department.description}
        </p>

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            gap: 24,
            fontSize: 13,
          }}
        >
          <div>
            <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: 11 }}>
              HEAD OF DEPARTMENT
            </span>
            <strong>{department.hod}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: 11 }}>
              ESTABLISHED
            </span>
            <strong>{department.establishedYear}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: 11 }}>
              STUDENTS
            </span>
            <strong>{department.studentCount}</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '12px 18px',
          borderRadius: 14,
          backgroundColor: 'rgba(217, 212, 247, 0.4)',
          fontSize: 12,
          color: 'var(--ink)',
        }}
      >
        ⚡ Next.js Server-Side Rendered at: <strong>{serverRenderedAt}</strong> (id: {department.id})
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  const departments = {
    'dept-1': {
      id: 'dept-1',
      code: 'CSE',
      name: 'Computer Science & Engineering',
      hod: 'Dr. Arvind Ramanathan',
      establishedYear: 2004,
      studentCount: 120,
      description: 'Premier department specializing in algorithms, software systems and AI.',
    },
    'dept-2': {
      id: 'dept-2',
      code: 'AIDS',
      name: 'Artificial Intelligence & Data Science',
      hod: 'Dr. Priya Sundaram',
      establishedYear: 2020,
      studentCount: 95,
      description: 'Advanced machine learning, deep neural architectures, and vision analytics.',
    },
    'dept-3': {
      id: 'dept-3',
      code: 'IT',
      name: 'Information Technology',
      hod: 'Dr. Rajesh Kumar',
      establishedYear: 2008,
      studentCount: 88,
      description: 'Enterprise networking, cloud security, and distributed computing.',
    },
  };

  const department = departments[id] || null;

  return {
    props: {
      department,
      serverRenderedAt: new Date().toUTCString(),
    },
  };
}
