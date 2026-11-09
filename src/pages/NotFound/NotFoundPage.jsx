import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          backgroundColor: 'var(--lavender)',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <HelpCircle size={32} />
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 500 }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8, marginBottom: 24, maxWidth: 420 }}>
        The requested page does not exist or has been relocated in the academic portal.
      </p>
      <Link to="/" className="btn-dark">
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
