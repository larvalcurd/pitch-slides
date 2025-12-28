import { useState, useCallback, useEffect, useRef } from 'react';

type useDragAndDropProps = {
  onDragEnd?: (deltaX: number, deltaY: number) => void;
  onDragMove?: (deltaX: number, deltaY: number) => void;
  onDragStart?: () => void;
  threshold?: number;
};

export default function useDragAndDrop(props: useDragAndDropProps = {}) {
  const { onDragEnd, onDragMove, onDragStart, threshold = 3 } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartedRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartedRef.current = false;
    setDelta({ x: 0, y: 0 });
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (!dragStartedRef.current) {
        if (Math.abs(deltaX) < threshold || Math.abs(deltaY) < threshold) {
          return;
        }
        dragStartedRef.current = true;
        onDragStart?.();
      }

      setDelta({ x: deltaX, y: deltaY });
      onDragMove?.(deltaX, deltaY);
    },
    [onDragMove, onDragStart, threshold],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (dragStartedRef.current) {
        onDragEnd?.(deltaX, deltaY);
      }

      setIsDragging(false);
      setDelta({ x: 0, y: 0 });
      dragStartRef.current = null;
      dragStartedRef.current = false;
    },
    [onDragEnd],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging: isDragging && dragStartedRef.current,
    delta,
    handleMouseDown,
  };
}
