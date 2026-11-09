import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth={440}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', margin: '8px 0 24px' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: isDestructive ? 'rgba(179, 38, 30, 0.12)' : 'var(--field)',
            color: isDestructive ? 'var(--danger)' : 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 4 }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button
          type="button"
          className="btn-translucent"
          onClick={onCancel}
          style={{ padding: '9px 18px' }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-dark"
          style={{
            backgroundColor: isDestructive ? 'var(--danger)' : 'var(--ink)',
            padding: '9px 20px',
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDestructive: PropTypes.bool,
};
