import { useMemo } from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes';
import styles from './SlideCanvas.module.css';
import SlideObjectsRenderer from './SlideObjectsRenderer';

type Props = {
  slide?: Slide | null;
  selectedObjectIds?: string[];
  onSelectObject: (objectId: string, multiSelect?: boolean) => void;
  onUpdateObjectPosition: (objectId: string, x: number, y: number) => void;
  onUpdateObjectSize: (
    objectId: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
};

export default function SlideCanvas({
  slide,
  selectedObjectIds,
  onSelectObject,
  onUpdateObjectPosition,
  onUpdateObjectSize,
}: Props) {
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

  // Клик на пустое место — снять выделение
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Проверяем, что клик был именно на canvas, а не на объекте
    if (e.target === e.currentTarget) {
      // Можно вызвать onSelectObject с null или пустым id
      // Зависит от твоей реализации
    }
  };

  return (
    <div className={styles.wrapper}>
      {slide ? (
        <div className={styles.column}>
          <div className={styles.title}>{slide.title ?? 'Untitled slide'}</div>

          <div className={styles.viewport} style={backgroundStyle} onClick={handleCanvasClick}>
            <SlideObjectsRenderer
              objects={slide.objects}
              selectedObjectIds={selectedObjectIds || []}
              onSelectObject={onSelectObject}
              onUpdateObjectPosition={onUpdateObjectPosition}
              onUpdateObjectSize={onUpdateObjectSize}
            />
          </div>
        </div>
      ) : (
        <div className={styles['no-slide']}>No slide selected</div>
      )}
    </div>
  );
}
