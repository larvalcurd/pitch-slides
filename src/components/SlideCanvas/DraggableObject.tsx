import type { ResizeHandle, SlideObject } from '../../entities/object';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useResizable } from '../../hooks/useResizable';
import styles from './DraggableObject.module.css';

type Props = {
  object: SlideObject;
  isSelected: boolean;
  onSelect: (objectId: string, multiSelect?: boolean) => void;
  onUpdatePosition: (objectId: string, x: number, y: number) => void;
  onUpdateSize: (objectId: string, x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
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

export function DraggableObject({
  object,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  children,
  minWidth = 20,
  minHeight = 20,
}: Props) {
  const {
    isDragging,
    delta: dragDelta,
    handleMouseDown: handleDragMouseDown,
  } = useDragAndDrop({
    onDragEnd: (deltaX, deltaY) => {
      onUpdatePosition(object.id, object.x + deltaX, object.y + deltaY);
    },
  });

  const { isResizing, currentState, startResize } = useResizable({
    initialX: object.x,
    initialY: object.y,
    initialWidth: object.width,
    initialHeight: object.height,
    minWidth,
    minHeight,
    onResizeEnd: (x, y, width, height) => {
      onUpdateSize(object.id, x, y, width, height);
    },
  });

  const { x: resizeX, y: resizeY, width: resizeWidth, height: resizeHeight } = currentState;

  const currentX = isResizing ? resizeX : object.x + (isDragging ? dragDelta.x : 0);
  const currentY = isResizing ? resizeY : object.y + (isDragging ? dragDelta.y : 0);
  const currentWidth = isResizing ? resizeWidth : object.width;
  const currentHeight = isResizing ? resizeHeight : object.height;

  const handleMouseDown = (e: React.MouseEvent) => {
    onSelect(object.id, e.shiftKey);
    handleDragMouseDown(e);
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
    >
      <div className={styles.content}>{children}</div>

      {isSelected && !isDragging && (
        <div className={styles.resizeHandles}>
          {RESIZE_HANDLES.map(({ handle, className }) => (
            <div
              key={handle}
              className={`${styles.resizeHandle} ${className}`}
              onMouseDown={e => startResize(e, handle)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
