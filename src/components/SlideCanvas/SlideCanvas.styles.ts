import type React from 'react';
import type { BaseObject } from '../../entities/object';
import type { Slide } from '../../entities/slide';

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

export const viewportStyle = (slide?: Slide | null): React.CSSProperties => ({
  width: SLIDE_WIDTH,
  height: SLIDE_HEIGHT,
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 6,
  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: slide?.background?.type === 'color' ? slide.background.value : undefined,
  backgroundImage:
    slide?.background?.type === 'image' ? `url(${slide.background.value})` : undefined,
  backgroundSize: slide?.background?.type === 'image' ? 'cover' : undefined,
  backgroundPosition: slide?.background?.type === 'image' ? 'center' : undefined,
});

export const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
};

export const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  boxSizing: 'border-box',
};

export const titleStyle: React.CSSProperties = {
  alignSelf: 'center',
  padding: '6px 12px',
  fontSize: 18,
  fontWeight: 600,
  color: '#111827',
};

export const baseObjectStyle = (obj: BaseObject): React.CSSProperties => ({
  position: 'absolute',
  left: obj.x,
  top: obj.y,
  width: obj.width,
  height: obj.height,
  zIndex: obj.zIndex,
  boxSizing: 'border-box',
  cursor: 'pointer',
});
