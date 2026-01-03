import type { Slide } from '../../entities/slide';
import styles from './SlideList.module.css';

type SlideListProps = {
  slides: Slide[];
  selectedSlideIds: string[];
  onSelect: (slideId: string, multi: boolean) => void;
  startDrag: (
    context: {
      type: 'slides';
      slideIds: string[];
    },
    e: React.MouseEvent,
  ) => void;
};

export default function SlideList({
  slides,
  selectedSlideIds,
  onSelect,
  startDrag,
}: SlideListProps) {
  const handleMouseDown = (e: React.MouseEvent, slideId: string) => {
    const multi = e.ctrlKey || e.metaKey;

    let slideIds: string[];
    if (multi) {
      if (selectedSlideIds.includes(slideId)) {
        slideIds = selectedSlideIds.filter(id => id !== slideId);
      } else {
        slideIds = [...selectedSlideIds, slideId];
      }
    } else {
      slideIds = [slideId];
    }

    onSelect(slideId, multi);

    startDrag(
      {
        type: 'slides',
        slideIds,
      },
      e,
    );
  };

  return (
    <aside className={styles.container} aria-label="Slides list">
      {slides.length === 0 ? (
        <div className={styles.emptyStateWrapper} role="status" aria-live="polite">
          <div className={styles.emptyStateText}>No slides</div>
        </div>
      ) : (
        slides.map(slide => {
          const isSelected = selectedSlideIds.includes(slide.id);

          return (
            <div
              key={slide.id}
              data-slide-id={slide.id}
              className={`${styles.item} ${isSelected ? styles.selected : ''}`}
              style={{
                background:
                  slide.background?.type === 'color'
                    ? slide.background.value
                    : slide.background?.type === 'image'
                      ? `url(${slide.background.value}) center/cover no-repeat`
                      : undefined,
              }}
              onMouseDown={e => handleMouseDown(e, slide.id)}
            >
              <div className={styles.thumbnailInner}>{slide.title ?? 'Untitled slide'}</div>
            </div>
          );
        })
      )}
    </aside>
  );
}
