import { useMemo } from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes';
import styles from './SlideCanvas.module.css';
import SlideObjectsRenderer from './SlideObjectsRenderer';

type Props = {
  slide?: Slide | null;
  selectedObjectIds?: string[];
  onSelectObject: (objectId: string | null, multiSelect?: boolean) => void;
  onUpdateObjectPosition: (objectId: string, x: number, y: number) => void;
  onUpdateObjectSize: (
    objectId: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
  editingTextObjectId?: string | null;
  onStartEditingText: (objectId: string) => void;
  onStopEditingText: () => void;
  onUpdateTextContent: (objectId: string, content: string) => void;
};

export default function SlideCanvas({
  slide,
  selectedObjectIds,
  onSelectObject,
  onUpdateObjectPosition,
  onUpdateObjectSize,
  editingTextObjectId,
  onStartEditingText,
  onStopEditingText,
  onUpdateTextContent,
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectObject(null);
      onStopEditingText();
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
              editingTextObjectId={editingTextObjectId}
              onStartEditingText={onStartEditingText}
              onStopEditingText={onStopEditingText}
              onUpdateTextContent={onUpdateTextContent}
            />
          </div>
        </div>
      ) : (
        <div className={styles['no-slide']}>No slide selected</div>
      )}
    </div>
  );
}
