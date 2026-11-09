import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('admin@collegehub.edu');
  const [password, setPassword] = useState('password123');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }

    login(email, 'Administrator');
    addToast('Welcome back, Administrator!', 'success');
    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Background blobs */}
      <div className="app-background-blobs" aria-hidden="true">
        <div className="app-blob app-blob-lavender" />
        <div className="app-blob app-blob-blue" />
        <div className="app-blob app-blob-pink" />
      </div>

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 16px 40px rgba(60, 50, 100, 0.12)',
        }}
      >
        {/* Logo Tile */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: 'var(--ink)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Building2 size={26} />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--ink)', textAlign: 'center' }}>
          CampusCore
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center', marginTop: 4, marginBottom: 28 }}>
          Integrated College Department Management System
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Institutional Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@collegehub.edu"
                style={{ width: '100%', paddingLeft: 38 }}
              />
              <Mail
                size={16}
                color="var(--ink-soft)"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: 38 }}
              />
              <Lock
                size={16}
                color="var(--ink-soft)"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          <div
            style={{
              background: 'rgba(217, 212, 247, 0.4)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            <ShieldCheck size={16} color="var(--ink)" />
            <span>Pre-filled with college demo credentials</span>
          </div>

          <button
            type="submit"
            className="btn-dark"
            style={{ width: '100%', marginTop: 12, padding: '12px 20px', fontSize: 15 }}
          >
            <span>Sign In to Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
