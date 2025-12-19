import type { Slide } from '../../entities/slide';
import styles from './SlideList.module.css';

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
    <aside className={styles.container} aria-label="Slides list">
      {slides.length === 0 ? (
        <div className={styles.emptyStateWrapper} role="status" aria-live="polite">
          <div className={styles.emptyStateText}>No slides</div>
        </div>
      ) : (
        slides.map((slide, index) => {
          const isSelected = slide.id === selectedSlideId;

          return (
            <div
              key={slide.id}
              className={`${styles.item} ${isSelected ? styles.selected : ''}`}
              style={{
                background:
                  slide.background?.type === 'color'
                    ? slide.background.value
                    : slide.background?.type === 'image'
                      ? `url(${slide.background.value}) center/cover no-repeat`
                      : undefined,
              }}
              onClick={() => handleClick(slide.id, index)}
            >
              <div className={styles.thumbnailInner}>{slide.title ?? 'Untitled slide'}</div>
            </div>
          );
        })
      )}
    </aside>
  );
}
