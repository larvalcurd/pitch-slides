import React from 'react';
import type { Slide } from '../../entities/slide';
import {
  containerStyle,
  defaultBorderColor,
  emptyStateText,
  emptyStateWrapper,
  itemStyleBase,
  selectedBorderColor,
  thumbnailInnerStyle,
} from './SlideList.styles.ts';

type SlideListProps = {
  slides: Slide[];
  selectedSlideId?: string | null;
  onSelect?: (slideId: string) => void;
};

export default function SlideList({ slides, selectedSlideId, onSelect }: SlideListProps) {
  const handleClick = (id: string, index: number) => {
    console.log(id, index + 1);
    if (onSelect) onSelect(id);
  };

  return (
    <aside style={containerStyle} aria-label="Slides list">
      {slides.length === 0 ? (
        <div style={emptyStateWrapper} role="status" aria-live="polite">
          <div style={emptyStateText}>No slides</div>
        </div>
      ) : (
        slides.map((slide, index) => {
          const isSelected = slide.id === selectedSlideId;

          const itemStyle: React.CSSProperties = {
            ...itemStyleBase,
            borderWidth: isSelected ? '2px' : itemStyleBase.borderWidth,
            borderStyle: itemStyleBase.borderStyle,
            borderColor: isSelected ? selectedBorderColor : defaultBorderColor,
            background:
              slide.background?.type === 'color'
                ? slide.background.value
                : slide.background?.type === 'image'
                  ? `url(${slide.background.value}) center/cover no-repeat`
                  : itemStyleBase.background,
          };

          return (
            <div key={slide.id} style={itemStyle} onClick={() => handleClick(slide.id, index)}>
              <div style={thumbnailInnerStyle}>{slide.title ?? 'Untitled slide'}</div>
            </div>
          );
        })
      )}
    </aside>
  );
}
