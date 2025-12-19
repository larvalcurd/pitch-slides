import type React from 'react';

export const containerStyle: React.CSSProperties = {
  width: '220px',
  minWidth: '220px',
  height: '100vh',
  overflowY: 'auto',
  background: '#f3f4f6',
  padding: '8px',
  boxSizing: 'border-box',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: 'rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

export const itemStyleBase: React.CSSProperties = {
  height: '120px',
  marginBottom: '8px',
  borderRadius: '6px',
  boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'stretch',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgba(0,0,0,0.06)',
  background: '#ffffff',
  flexShrink: 0,
};

export const thumbnailInnerStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'flex-end',
  padding: '6px',
  color: '#111827',
  fontSize: '12px',
  backgroundColor: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(2px)',
};

export const selectedBorderColor = '#2563eb';
export const defaultBorderColor = 'rgba(0,0,0,0.06)';

export const emptyStateWrapper: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  color: '#6b7280',
  fontSize: 14,
  textAlign: 'center',
};

export const emptyStateText: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  background: 'rgba(255,255,255,0.6)',
  boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
};
