import React, { type ReactNode } from 'react';
import type { SlideObject, ResizeHandle } from '../../entities/object';
import type { ResizePreview } from '../../entities/editor';
import styles from './DraggableObject.module.css';

type Props = {
  object: SlideObject;
  isSelected: boolean;
  onSelectObject: (objectId: string, multi: boolean) => void;

  isDragging: boolean;
  dragDelta: { x: number; y: number };
  onStartDrag: (e: React.MouseEvent) => void;

  isResizing: boolean;
  resizePreview: ResizePreview | null;
  onStartResize: (e: React.MouseEvent, handle: ResizeHandle) => void;

  children: ReactNode;
  onDoubleClick?: () => void;
};

const RESIZE_HANDLES: { handle: ResizeHandle; className: string }[] = [
  { handle: 'top-left', className: styles.topLeft },
  { handle: 'top', className: styles.top },
  { handle: 'top-right', className: styles.topRight },
  { handle: 'right', className: styles.right },
  { handle: 'bottom-right', className: styles.bottomRight },
  { handle: 'bottom', className: styles.bottom },
  { handle: 'bottom-left', className: styles.bottomLeft },
  { handle: 'left', className: styles.left },
];

export default function DraggableObject({
  object,
  isSelected,
  onSelectObject,
  isDragging,
  dragDelta,
  onStartDrag,
  isResizing,
  resizePreview,
  onStartResize,
  children,
  onDoubleClick,
}: Props) {
  const currentX = isResizing && resizePreview ? resizePreview.x : object.x + dragDelta.x;
  const currentY = isResizing && resizePreview ? resizePreview.y : object.y + dragDelta.y;
  const currentWidth = isResizing && resizePreview ? resizePreview.width : object.width;
  const currentHeight = isResizing && resizePreview ? resizePreview.height : object.height;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const multi = e.ctrlKey || e.metaKey;
    onSelectObject(object.id, multi);
    onStartDrag(e);
  };

  const getCursor = () => {
    if (isDragging) return 'grabbing';
    if (isResizing) return 'default';
    return 'grab';
  };

  const classNames = [
    styles.draggableObject,
    isSelected && styles.selected,
    isDragging && styles.dragging,
    isResizing && styles.resizing,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={{
        left: currentX,
        top: currentY,
        width: currentWidth,
        height: currentHeight,
        zIndex: isDragging || isResizing ? 1000 : object.zIndex,
        cursor: getCursor(),
      }}
      data-object-id={object.id}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className={styles.content}>{children}</div>

      {isSelected && !isDragging && (
        <div className={styles.resizeHandles}>
          {RESIZE_HANDLES.map(({ handle, className }) => (
            <div
              key={handle}
              className={`${styles.resizeHandle} ${className}`}
              onMouseDown={e => {
                e.stopPropagation();
                onStartResize(e, handle);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
