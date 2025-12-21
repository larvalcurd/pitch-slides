  import { useMemo } from 'react';
  import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
  import styles from './SlideCanvas.module.css';
  import SlideObjectsRenderer from './SlideObjectsRenderer.tsx';

  type Props = {
    slide?: Slide | null;
    onSelectObject?: (objectId: string, multiSelect?: boolean) => void;
    selectedObjectIds?: string[];
  };

  export default function SlideCanvas({ slide, onSelectObject, selectedObjectIds }: Props) {
    const backgroundStyle = useMemo(() => {
      if (!slide?.background) return undefined;

      if (slide.background.type === 'color') {
        return { backgroundColor: slide.background.value };
      }

      if (slide.background.type === 'image') {
        return {
          backgroundImage: `url(${slide.background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
    }, [slide?.background]);

    return (
      <div className={styles.wrapper}>
        {slide ? (
          <div className={styles.column}>
            <div className={styles.title} aria-hidden={false}>
              {slide.title ?? 'Untitled slide'}
            </div>

            <div
              className={styles.viewport}
              style={backgroundStyle}
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
