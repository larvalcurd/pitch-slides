import type React from 'react';

export const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: 6,
  width: '100%',
  maxWidth: 640,
  boxSizing: 'border-box',
};

export const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  padding: '8px 10px',
  fontSize: 16,
  lineHeight: 1.2,
  color: '#111827',
  background: '#ffffff',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgba(15,23,42,0.08)',
  borderRadius: 8,
  outline: 'none',
  boxShadow: '0 1px 2px rgba(16,24,40,0.03)',
  transition: 'box-shadow 120ms ease, border-color 120ms ease, transform 120ms ease',
};

export const inputFocusStyle: React.CSSProperties = {
  borderColor: '#111827',
  boxShadow: '0 4px 12px rgba(17,24,39,0.12)',
};

export const inputDisabledStyle: React.CSSProperties = {
  background: '#f3f4f6',
  color: '#6b7280',
  cursor: 'not-allowed',
  opacity: 0.9,
};
