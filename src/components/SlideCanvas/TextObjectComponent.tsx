import React from 'react';
import type { TextObject } from '../../entities/object/types/ObjectTypes.ts';
import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import { baseObjectStyle } from './SlideCanvas.styles.ts';

type Props = {
  text: TextObject;
  slide?: Slide | null;
  onObjectClick: (id: string, backgroundColor: string) => void;
};

export default function TextObjectComponent({ text, slide, onObjectClick }: Props) {
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
  };

  const bg =
    (textStyle.background as string) ??
    (slide?.background?.type === 'color' ? slide.background.value : 'transparent');

  return (
    <div
      key={text.id}
      style={textStyle}
      data-object-id={text.id}
      onClick={() => onObjectClick(text.id, bg)}
    >
      {text.content}
    </div>
  );
}
