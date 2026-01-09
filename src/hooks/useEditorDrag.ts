import React, { useCallback, useEffect, useRef, useState } from 'react';
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

type DragContext =
  | {
      type: 'object';
      slideId: string;
      objectIds: string[];
    }
  | {
      type: 'slides';
      slideIds: string[];
    };

type UseEditorDragReturn = {
  isDragging: boolean;
  startDrag: (context: DragContext, e: React.MouseEvent) => void;
  getDeltaForObject: (objectId: string) => { x: number; y: number };
  getPreviewForObject: (objectId: string) => { x: number; y: number };
};

export default function useEditorDrag({
  editor,
  applyEditorUpdate,
  threshold = 3,
}: UseEditorDragProps): UseEditorDragReturn {
  const [thresholdPassed, setThresholdPassed] = useState(false);

  const editorRef = useRef(editor);
  const mouseStartRef = useRef({ x: 0, y: 0 });
  const previewRef = useRef<ReturnType<typeof calculateDragPreview> | null>(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const startDrag = useCallback(
    (context: DragContext, e: React.MouseEvent) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      mouseStartRef.current = { x: e.clientX, y: e.clientY };
      setThresholdPassed(false);
      previewRef.current = null;

      applyEditorUpdate(editor => startDragging(editor, context, e.clientX, e.clientY));
    },
    [applyEditorUpdate],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const current = editorRef.current;
      if (!current.dragging) return;

      const dx = e.clientX - mouseStartRef.current.x;
      const dy = e.clientY - mouseStartRef.current.y;

      if (!thresholdPassed && Math.sqrt(dx * dx + dy * dy) >= threshold) {
        setThresholdPassed(true);
      }

      if (!thresholdPassed) return;

      applyEditorUpdate(editor => {
        if (!editor.dragging) return editor;

        if (editor.dragging.type === 'object') {
          return {
            ...editor,
            dragging: {
              ...editor.dragging,
              currentMouseX: e.clientX,
              currentMouseY: e.clientY,
            },
          };
        }

        if (editor.dragging.type === 'slides') {
          return {
            ...editor,
            dragging: {
              ...editor.dragging,
              currentMouseY: e.clientY,
            },
          };
        }

        return editor;
      });

      if (current.dragging.type === 'object') {
        previewRef.current = calculateDragPreview(current.dragging, e.clientX, e.clientY);
      }

      if (current.dragging.type === 'slides') {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const slideEl = el?.closest('[data-slide-id]');
        if (!slideEl) return;

        const slideId = slideEl.getAttribute('data-slide-id');
        if (!slideId) return;

        const index = current.presentation.slides.findIndex(s => s.id === slideId);

        if (index !== -1) {
          const rect = slideEl.getBoundingClientRect();
          const isLowerHalf = e.clientY > rect.top + rect.height / 2;
          const targetIndex = isLowerHalf ? index + 1 : index;

          applyEditorUpdate(editor => {
            if (!editor.dragging) return editor;
            return {
              ...editor,
              dragging: {
                ...editor.dragging,
                targetIndex,
              },
            };
          });
        }
      }
    },
    [applyEditorUpdate, threshold, thresholdPassed],
  );

  const handleMouseUp = useCallback(() => {
    const current = editorRef.current;
    if (!current.dragging) return;

    if (thresholdPassed) {
      applyEditorUpdate(applyDrag);
    } else {
      applyEditorUpdate(cancelDragging);
    }

    setThresholdPassed(false);
    previewRef.current = null;
  }, [applyEditorUpdate, thresholdPassed]);

  useEffect(() => {
    if (!editor.dragging) return;

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
  }, [editor.dragging, handleMouseMove, handleMouseUp]);

  const getDeltaForObject = useCallback(
    (objectId: string) => {
      if (!editor.dragging || editor.dragging.type !== 'object' || !thresholdPassed) {
        return { x: 0, y: 0 };
      }

      if (!editor.dragging.objectIds.includes(objectId)) {
        return { x: 0, y: 0 };
      }

      return getDragDelta(
        editor.dragging,
        editor.dragging.currentMouseX,
        editor.dragging.currentMouseY,
      );
    },
    [editor.dragging, thresholdPassed],
  );

  const getPreviewForObject = useCallback((objectId: string) => {
    const preview = previewRef.current;
    if (!preview) return { x: 0, y: 0 };

    return preview.positions[objectId] ?? { x: 0, y: 0 };
  }, []);

  return {
    isDragging: editor.dragging !== null,
    startDrag,
    getDeltaForObject,
    getPreviewForObject,
  };
}
