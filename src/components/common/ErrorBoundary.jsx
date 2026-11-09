import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * ErrorBoundary
 * Demonstrates React Class Component Error Boundary lifecycle methods:
 * - static getDerivedStateFromError
 * - componentDidCatch
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[CampusCore ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 32,
            margin: '40px auto',
            maxWidth: 600,
            background: 'var(--panel)',
            border: '1px solid var(--glass-border)',
            borderRadius: 24,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: 'rgba(179, 38, 30, 0.12)',
              color: 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>
            Something went wrong
          </h2>

          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '8px 0 20px', lineHeight: 1.5 }}>
            A rendering error occurred in this view. CampusCore's Error Boundary caught the
            exception to preserve the application runtime.
          </p>

          {this.state.error && (
            <div
              style={{
                background: 'var(--field)',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12,
                color: 'var(--danger)',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: 20,
                fontFamily: 'monospace',
              }}
            >
              {this.state.error.toString()}
            </div>
          )}

          <button
            type="button"
            className="btn-dark"
            onClick={this.handleReset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <RotateCcw size={15} />
            <span>Reload View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
