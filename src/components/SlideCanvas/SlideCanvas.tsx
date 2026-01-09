import React, { useMemo } from 'react';
import type { Slide } from '../../entities/slide';
import styles from './SlideCanvas.module.css';
import SlideObjectsRenderer from './SlideObjectsRenderer';
import type { ResizeHandle } from '../../entities/object';
import type { ResizePreview } from '../../entities/editor';

type Props = {
  currentSlide: Slide | null;
  selectedObjectIds: string[];
  onSelectObject: (objectId: string, multi: boolean) => void;
  onDeselectAll: () => void;

  isDragging: boolean;
  startDrag: (
    context: {
      type: 'object';
      slideId: string;
      objectIds: string[];
    },
    e: React.MouseEvent,
  ) => void;
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
  currentSlide,
  selectedObjectIds,
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
    if (!currentSlide?.background) return undefined;

    if (currentSlide.background.type === 'color') {
      return { backgroundColor: currentSlide.background.value };
    }

    if (currentSlide.background.type === 'image') {
      return {
        backgroundImage: `url(${currentSlide.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  }, [currentSlide]); // TODO

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDeselectAll();
      onStopEditingText();
    }
  };

  return (
    <div className={styles.wrapper}>
      {currentSlide ? (
        <div className={styles.column}>
          <div className={styles.title}>{currentSlide.title ?? 'Untitled slide'}</div>

          <div className={styles.viewport} style={backgroundStyle} onClick={handleCanvasClick}>
            <SlideObjectsRenderer
              slideId={currentSlide.id}
              objects={currentSlide.objects}
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
