import type React from 'react';
export const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: 8,
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  background: '#f8fafc',
  borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
  boxSizing: 'border-box',
};
export const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  fontSize: 13,
  lineHeight: 1,
  color: '#111827',
  background: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.06)',
  borderRadius: 6,
  cursor: 'pointer',
  userSelect: 'none',
  boxShadow: '0 1px 2px rgba(16,24,40,0.03)',
  transition: 'background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',
};
export const buttonActiveStyle: React.CSSProperties = {
  background: '#eef2ff',
  borderColor: '#c7d2fe',
  boxShadow: '0 2px 6px rgba(99,102,241,0.12)',
  transform: 'translateY(0)',
};
export const buttonDisabledStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};
