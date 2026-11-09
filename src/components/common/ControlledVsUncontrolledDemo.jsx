import React, { useState, useRef } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

/**
 * ControlledVsUncontrolledDemo
 * Demonstrates the architectural difference between:
 * 1. Controlled Component (state-driven via useState)
 * 2. Uncontrolled Component (DOM-driven via useRef)
 */
export const ControlledVsUncontrolledDemo = () => {
  // 1. Controlled state
  const [controlledText, setControlledText] = useState('Controlled React State');

  // 2. Uncontrolled ref
  const uncontrolledInputRef = useRef(null);
  const [uncontrolledOutput, setUncontrolledOutput] = useState('');

  const handleReadUncontrolled = () => {
    if (uncontrolledInputRef.current) {
      setUncontrolledOutput(uncontrolledInputRef.current.value);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        background: 'var(--panel)',
        borderRadius: 18,
        border: '1px solid var(--glass-border)',
        marginTop: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Sliders size={18} color="var(--chart-purple)" />
        <h4 style={{ fontSize: 15, fontWeight: 600 }}>
          Syllabus Demo: Controlled vs. Uncontrolled Components
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Controlled Section */}
        <div style={{ background: 'var(--field)', padding: 14, borderRadius: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
            1. Controlled Component (useState)
          </span>
          <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '4px 0 8px' }}>
            React controls input value directly via <code>value</code> and <code>onChange</code>.
          </p>
          <input
            type="text"
            value={controlledText}
            onChange={(e) => setControlledText(e.target.value)}
            style={{ width: '100%', fontSize: 13 }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink)' }}>
            Live state: <strong>{controlledText}</strong>
          </div>
        </div>

        {/* Uncontrolled Section */}
        <div style={{ background: 'var(--field)', padding: 14, borderRadius: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
            2. Uncontrolled Component (useRef)
          </span>
          <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '4px 0 8px' }}>
            The DOM maintains its own state; value is pulled on demand via <code>ref</code>.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              ref={uncontrolledInputRef}
              defaultValue="Initial DOM Value"
              style={{ flex: 1, fontSize: 13 }}
            />
            <button
              type="button"
              className="btn-dark"
              onClick={handleReadUncontrolled}
              style={{ fontSize: 12, padding: '8px 14px' }}
            >
              Read Ref
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink)' }}>
            Read from DOM ref: <strong>{uncontrolledOutput || '(Click Read Ref)'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
