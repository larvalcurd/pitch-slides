import type { SlideObject } from '../entities/object';
import { useCallback, useEffect, useRef, useState } from 'react';

type useMultiDragProps = {
  objects: SlideObject[];
  selectedIds: string[];
  onDragEnd: (updates: Array<{ id: string; x: number; y: number }>) => void;
  threshold?: number;
};

type useMultiDragReturn = {
  isDragging: boolean;
  draggedId: string | null;
  startDrag: (e: MouseEvent, objectId: string) => void;
  getDeltaForObject: (objectId: string) => { x: number; y: number };
};

export default function useMultiDrag(props: useMultiDragProps): useMultiDragReturn {
  const { objects, selectedIds, onDragEnd, threshold = 3 } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartedRef = useRef(false);

  const selectedIdsRef = useRef(selectedIds);
  const objectsRef = useRef(objects);

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  const startDrag = useCallback((e: MouseEvent, objectId: string) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartedRef.current = false;
    setDelta({ x: 0, y: 0 });
    setDraggedId(objectId);
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
      }

      setDelta({ x: deltaX, y: deltaY });
    },
    [threshold],
  );

  const handleMouseUp = useCallback(() => {
    if (!dragStartRef.current) {
      setIsDragging(false);
      setDraggedId(null);
      return;
    }

    if (dragStartedRef.current) {
      const currentSelectedIds = selectedIdsRef.current;
      const currentObjects = objectsRef.current;

      const updates = currentSelectedIds
        .map(id => {
          const obj = currentObjects.find(o => o.id === id);
          if (!obj) return null;
          return {
            id,
            x: obj.x + delta.x,
            y: obj.y + delta.y,
          };
        })
        .filter((u): u is { id: string; x: number; y: number } => u !== null);

      if (updates.length > 0) {
        onDragEnd(updates);
      }
    }

    setIsDragging(false);
    setDraggedId(null);
    setDelta({ x: 0, y: 0 });
    dragStartRef.current = null;
    dragStartedRef.current = false;
  }, [delta, onDragEnd]);

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

  const getDeltaForObject = useCallback(
    (objectId: string): { x: number; y: number } => {
      if (isDragging && dragStartedRef.current && selectedIds.includes(objectId)) {
        return delta;
      }
      return { x: 0, y: 0 };
    },
    [isDragging, selectedIds, delta],
  );

  return {
    isDragging: isDragging && dragStartedRef.current,
    draggedId,
    startDrag,
    getDeltaForObject,
  };
}
