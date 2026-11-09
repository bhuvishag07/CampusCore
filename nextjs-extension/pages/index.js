import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

export default function Home({ departments, serverRenderedAt }) {
  const tones = ['tone-0', 'tone-1', 'tone-2'];

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: 36, marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: 'var(--ink)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 500 }}>
              CampusCore — Next.js SSR Extension
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
              Syllabus Demonstration: Server-Side Rendering (SSR) & Next.js File-Based Routing
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 12,
            backgroundColor: 'var(--field)',
            fontSize: 12,
            color: 'var(--ink)',
            display: 'inline-block',
          }}
        >
          ⚡ Page rendered on server at: <strong>{serverRenderedAt}</strong> via{' '}
          <code>getServerSideProps</code>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>
        Server-Rendered Academic Departments
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {departments.map((dept, index) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.id}`}
            className={`dept-card ${tones[index % 3]}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  backgroundColor: '#fff',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {dept.code}
              </span>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Est. {dept.establishedYear}
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
                {dept.name}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                HOD: <strong>{dept.hod}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>
              <span>View SSR Detail Page</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Next.js Server-Side Rendering (SSR)
export async function getServerSideProps() {
  const departments = [
    {
      id: 'dept-1',
      code: 'CSE',
      name: 'Computer Science & Engineering',
      hod: 'Dr. Arvind Ramanathan',
      establishedYear: 2004,
      studentCount: 120,
      description: 'Premier department specializing in algorithms, software systems and AI.',
    },
    {
      id: 'dept-2',
      code: 'AIDS',
      name: 'Artificial Intelligence & Data Science',
      hod: 'Dr. Priya Sundaram',
      establishedYear: 2020,
      studentCount: 95,
      description: 'Advanced machine learning, deep neural architectures, and vision analytics.',
    },
    {
      id: 'dept-3',
      code: 'IT',
      name: 'Information Technology',
      hod: 'Dr. Rajesh Kumar',
      establishedYear: 2008,
      studentCount: 88,
      description: 'Enterprise networking, cloud security, and distributed computing.',
    },
  ];

  return {
    props: {
      departments,
      serverRenderedAt: new Date().toUTCString(),
    },
  };
}
