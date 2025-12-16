import React from 'react';
import type { TextObject } from '../../entities/object';
import type { Slide } from '../../entities/slide';
import { baseObjectStyle } from './SlideCanvas.styles.ts';

type Props = {
  text: TextObject;
  slide?: Slide | null;
  onObjectClick: (id: string, backgroundColor: string) => void;
  onSelectObject?: (id: string) => void;
  isSelected?: boolean;
};

export default function TextObjectComponent({
  text,
  slide,
  onObjectClick,
  onSelectObject,
  isSelected,
}: Props) {
  const baseStyle = baseObjectStyle(text);
  const textStyle: React.CSSProperties = {
    ...baseStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '4px 8px',
    background: 'rgba(255,255,255,0.8)',
    borderRadius: 4,
    fontSize: text.fontSize ?? 16,
    color: text.color ?? '#111',
    border: isSelected ? '2px solid #007bff' : 'none',
  };

  const bg =
    (textStyle.background as string) ??
    (slide?.background?.type === 'color' ? slide.background.value : 'transparent');

  return (
    <div
      key={text.id}
      style={textStyle}
      data-object-id={text.id}
      onClick={() => {
        onObjectClick(text.id, bg);
        onSelectObject?.(text.id);
      }}
    >
      {text.content}
    </div>
  );
}
