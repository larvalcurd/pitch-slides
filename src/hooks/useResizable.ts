import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResizeHandle } from '../entities/object';

type ResizeState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type OriginalState = ResizeState & {
  mouseX: number;
  mouseY: number;
  handle: ResizeHandle;
};

type UseResizableProps = {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  minWidth?: number;
  minHeight?: number;
  onResizeEnd?: (x: number, y: number, width: number, height: number) => void;
};

type UseResizableReturn = {
  isResizing: boolean;
  currentHandle: ResizeHandle | null;
  currentState: ResizeState;
  startResize: (e: React.MouseEvent, handle: ResizeHandle) => void;
};

const calculateResize = (
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
  original: ResizeState,
  minWidth: number,
  minHeight: number,
): ResizeState => {
  let { x, y, width, height } = original;

  switch (handle) {
    case 'top-left':
      x += deltaX;
      y += deltaY;
      width -= deltaX;
      height -= deltaY;
      break;

    case 'top':
      y += deltaY;
      height -= deltaY;
      break;

    case 'top-right':
      y += deltaY;
      width += deltaX;
      height -= deltaY;
      break;

    case 'right':
      width += deltaX;
      break;

    case 'bottom-right':
      width += deltaX;
      height += deltaY;
      break;

    case 'bottom':
      height += deltaY;
      break;

    case 'bottom-left':
      x += deltaX;
      width -= deltaX;
      height += deltaY;
      break;

    case 'left':
      x += deltaX;
      width -= deltaX;
      break;
  }

  if (width < minWidth) {
    const diff = minWidth - width;
    width = minWidth;

    if (handle === 'top-left' || handle === 'bottom-left' || handle === 'left') {
      x -= diff;
    }
  }

  if (height < minHeight) {
    const diff = minHeight - height;
    height = minHeight;

    if (handle === 'top-left' || handle === 'top' || handle === 'top-right') {
      y -= diff;
    }
  }

  return { x, y, width, height };
};

export function useResizable(props: UseResizableProps): UseResizableReturn {
  const {
    initialX,
    initialY,
    initialWidth,
    initialHeight,
    minWidth = 20,
    minHeight = 20,
    onResizeEnd,
  } = props;

  const [isResizing, setIsResizing] = useState(false);
  const [currentHandle, setCurrentHandle] = useState<ResizeHandle | null>(null);
  const [currentState, setCurrentState] = useState<ResizeState>({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });

  const originalRef = useRef<OriginalState | null>(null);

  useEffect(() => {
    if (!isResizing) {
      setCurrentState({
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      });
    }
  }, [initialX, initialY, initialWidth, initialHeight, isResizing]);

  const startResize = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      originalRef.current = {
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
        mouseX: e.clientX,
        mouseY: e.clientY,
        handle,
      };

      setIsResizing(true);
      setCurrentHandle(handle);
    },
    [initialX, initialY, initialWidth, initialHeight],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!originalRef.current) return;

      const { mouseX, mouseY, handle, x, y, width, height } = originalRef.current;

      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      const newState = calculateResize(
        handle,
        deltaX,
        deltaY,
        { x, y, width, height },
        minWidth,
        minHeight,
      );

      setCurrentState(newState);
    },
    [minWidth, minHeight],
  );

  const handleMouseUp = useCallback(() => {
    if (!originalRef.current) return;

    onResizeEnd?.(currentState.x, currentState.y, currentState.width, currentState.height);

    setIsResizing(false);
    setCurrentHandle(null);
    originalRef.current = null;
  }, [currentState, onResizeEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    isResizing,
    currentHandle,
    currentState,
    startResize,
  };
}
