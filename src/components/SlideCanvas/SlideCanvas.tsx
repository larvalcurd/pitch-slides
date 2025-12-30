import { useMemo } from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes';
import styles from './SlideCanvas.module.css';
import SlideObjectsRenderer from './SlideObjectsRenderer';
import type { ResizeHandle } from '../../entities/object';
import type { ResizePreview } from '../../entities/editor';

type Props = {
  slide?: Slide | null;
  selectedObjectIds?: string[];
  onSelectObject: (objectId: string | null, multiSelect?: boolean) => void;
  onDeselectAll: () => void;

  isDragging: boolean;
  startDrag: (e: React.MouseEvent, objectIds: string[]) => void;
  getDeltaForObject: (objectId: string) => { x: number; y: number };

  isResizing: boolean;
  resizingObjectId: string | null;
  resizePreview: ResizePreview | null;
  startResize: (e: React.MouseEvent, objectId: string, handle: ResizeHandle) => void;

  editingTextObjectId?: string | null;
  onStartEditingText: (objectId: string) => void;
  onStopEditingText: () => void;
  onUpdateTextContent: (objectId: string, content: string) => void;
};

export default function SlideCanvas({
  slide,
  selectedObjectIds = [],
  onSelectObject,
  onDeselectAll,
  isDragging,
  startDrag,
  getDeltaForObject,
  isResizing,
  resizingObjectId,
  resizePreview,
  startResize,
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
      onDeselectAll();
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
              selectedObjectIds={selectedObjectIds}
              onSelectObject={onSelectObject}
              isDragging={isDragging}
              startDrag={startDrag}
              getDeltaForObject={getDeltaForObject}
              isResizing={isResizing}
              resizingObjectId={resizingObjectId}
              resizePreview={resizePreview}
              startResize={startResize}
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
