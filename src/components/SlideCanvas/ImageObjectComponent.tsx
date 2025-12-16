import React from 'react';
import type { ImageObject } from '../../entities/object/types/ObjectTypes.ts';
import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import { baseObjectStyle } from './SlideCanvas.styles.ts';

type Props = {
  image: ImageObject;
  slide?: Slide | null;
  onObjectClick: (id: string, backgroundColor: string) => void;
};

export default function ImageObjectComponent({ image, slide, onObjectClick }: Props) {
  const imgWrapperStyle: React.CSSProperties = {
    ...baseObjectStyle(image),
    display: 'block',
    overflow: 'hidden',
  };

  const bg =
    (imgWrapperStyle.background as string) ??
    (slide?.background?.type === 'color' ? slide.background.value : 'none');

  return (
    <div
      key={image.id}
      style={imgWrapperStyle}
      data-object-id={image.id}
      onClick={() => onObjectClick(image.id, bg)}
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
