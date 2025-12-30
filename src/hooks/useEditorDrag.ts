import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '../entities/editor';
import {
  startDragging,
  calculateDragPreview,
  applyDrag,
  cancelDragging,
  getDragDelta,
} from '../entities/editor';

type ApplyEditorUpdate = (update: (editor: Editor) => Editor) => void;

type UseEditorDragProps = {
  editor: Editor;
  applyEditorUpdate: ApplyEditorUpdate;
  threshold?: number;
};

type UseEditorDragReturn = {
  isDragging: boolean;
  startDrag: (e: React.MouseEvent, objectIds: string[]) => void;
  getDeltaForObject: (objectId: string) => { x: number; y: number };
};

export default function useEditorDrag(options: UseEditorDragProps): UseEditorDragReturn {
  const { editor, applyEditorUpdate, threshold = 3 } = options;

  const [thresholdPassed, setThresholdPassed] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });

  const editorRef = useRef(editor);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const thresholdPassedRef = useRef(thresholdPassed);
  useEffect(() => {
    thresholdPassedRef.current = thresholdPassed;
  }, [thresholdPassed]);

  const startDrag = useCallback(
    (e: React.MouseEvent, objectIds: string[]) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      mouseRef.current = { x: e.clientX, y: e.clientY };
      setThresholdPassed(false);

      applyEditorUpdate(prev => startDragging(prev, objectIds, e.clientX, e.clientY));
    },
    [applyEditorUpdate],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentEditor = editorRef.current;

      if (!currentEditor.dragging) return;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (!thresholdPassedRef.current) {
        const delta = getDragDelta(currentEditor.dragging, e.clientX, e.clientY);

        if (Math.abs(delta.x) < threshold && Math.abs(delta.y) < threshold) {
          return;
        }

        setThresholdPassed(true);
      }

      applyEditorUpdate(prev => ({ ...prev }));
    },
    [threshold, applyEditorUpdate],
  );

  const handleMouseUp = useCallback(() => {
    const currentEditor = editorRef.current;

    if (!currentEditor.dragging) return;

    if (thresholdPassedRef.current) {
      const preview = calculateDragPreview(
        currentEditor.dragging,
        mouseRef.current.x,
        mouseRef.current.y,
      );

      applyEditorUpdate(prev => applyDrag(prev, preview.positions));
    } else {
      applyEditorUpdate(prev => cancelDragging(prev));
    }

    setThresholdPassed(false);
  }, [applyEditorUpdate]);

  useEffect(() => {
    if (editor.dragging) {
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
  }, [editor.dragging, handleMouseMove, handleMouseUp]);

  const getDeltaForObject = useCallback(
    (objectId: string): { x: number; y: number } => {
      if (!editor.dragging || !thresholdPassed) {
        return { x: 0, y: 0 };
      }

      if (!editor.dragging.objectIds.includes(objectId)) {
        return { x: 0, y: 0 };
      }

      return getDragDelta(editor.dragging, mouseRef.current.x, mouseRef.current.y);
    },
    [editor.dragging, thresholdPassed],
  );

  return {
    isDragging: editor.dragging !== null && thresholdPassed,
    startDrag,
    getDeltaForObject,
  };
}
