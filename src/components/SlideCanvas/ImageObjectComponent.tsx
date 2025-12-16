import React from 'react';
import type { ImageObject } from '../../entities/object';
import type { Slide } from '../../entities/slide';
import { baseObjectStyle } from './SlideCanvas.styles.ts';

type Props = {
  image: ImageObject;
  slide?: Slide | null;
  onObjectClick: (id: string, backgroundColor: string) => void;
  onSelectObject?: (id: string) => void;
  isSelected?: boolean;
};

export default function ImageObjectComponent({
  image,
  slide,
  onObjectClick,
  onSelectObject,
  isSelected,
}: Props) {
  const imgWrapperStyle: React.CSSProperties = {
    ...baseObjectStyle(image),
    display: 'block',
    overflow: 'hidden',
    border: isSelected ? '2px solid #007bff' : 'none',
  };

  const bg =
    (imgWrapperStyle.background as string) ??
    (slide?.background?.type === 'color' ? slide.background.value : 'none');

  return (
    <div
      key={image.id}
      style={imgWrapperStyle}
      data-object-id={image.id}
      onClick={() => {
        onObjectClick(image.id, bg);
        onSelectObject?.(image.id);
      }}
    >
      <img
        src={image.src}
        alt={image.src ? 'Slide image' : ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          border: 'none',
        }}
      />
    </div>
  );
}
