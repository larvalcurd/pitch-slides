import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import styles from './SlideCanvas.module.css';
import SlideObjectsRenderer from './SlideObjectsRenderer.tsx';

type Props = {
  slide?: Slide | null;
  onSelectObject?: (objectId: string, multiSelect?: boolean) => void;
  selectedObjectIds?: string[];
};

export default function SlideCanvas({ slide, onSelectObject, selectedObjectIds }: Props) {
  return (
    <div className={styles.wrapper}>
      {slide ? (
        <div className={styles.column}>
          <div className={styles.title} aria-hidden={false}>
            {slide.title ?? 'Untitled slide'}
          </div>

          <div
            className={styles.viewport}
            style={{
              backgroundColor:
                slide?.background?.type === 'color' ? slide.background.value : undefined,
              backgroundImage:
                slide?.background?.type === 'image' ? `url(${slide.background.value})` : undefined,
              backgroundSize: slide?.background?.type === 'image' ? 'cover' : undefined,
              backgroundPosition: slide?.background?.type === 'image' ? 'center' : undefined,
            }}
            role="region"
            aria-label="Slide viewport"
          >
            <SlideObjectsRenderer
              objects={slide.objects}
              selectedObjectIds={selectedObjectIds || []}
              onSelectObject={onSelectObject}
              slide={slide}
            />
          </div>
        </div>
      ) : (
        <div className={styles['no-slide']}>No slide selected</div>
      )}
    </div>
  );
}
