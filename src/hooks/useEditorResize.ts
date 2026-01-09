import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyResize,
  calculateResizePreview,
  cancelResizing,
  startResizing,
  type Editor,
  type ResizePreview,
} from '../entities/editor';
import type { ResizeHandle } from '../entities/object';

type ApplyEditorUpdate = (update: (editor: Editor) => Editor) => void;

type useEditorResizeProps = {
  editor: Editor;
  applyEditorUpdate: ApplyEditorUpdate;
  minWidth?: number;
  minHeight?: number;
};

type UseEditorResizeReturn = {
  isResizing: boolean;
  resizingObjectId: string | null;
  resizePreview: ResizePreview | null;
  startResize: (e: React.MouseEvent, objectId: string, handle: ResizeHandle) => void;
};

export default function useEditorResize(props: useEditorResizeProps): UseEditorResizeReturn {
  const { editor, applyEditorUpdate, minWidth = 20, minHeight = 20 } = props;

  const mouseRef = useRef({ x: 0, y: 0 });

  const [currentPreview, setCurrentPreview] = useState<ResizePreview | null>(null);

  const editorRef = useRef(editor);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const startResize = useCallback(
    (e: React.MouseEvent, objectId: string, handle: ResizeHandle) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      mouseRef.current = { x: e.clientX, y: e.clientY };

      applyEditorUpdate(prev => startResizing(prev, objectId, handle, e.clientX, e.clientY));
    },
    [applyEditorUpdate],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentEditor = editorRef.current;

      if (!currentEditor.resizing) return;

      mouseRef.current = { x: e.clientX, y: e.clientY };

      const preview = calculateResizePreview(
        currentEditor.resizing,
        e.clientX,
        e.clientY,
        minWidth,
        minHeight,
      );

      setCurrentPreview(preview);
    },
    [minWidth, minHeight],
  );

  const handleMouseUp = useCallback(() => {
    const currentEditor = editorRef.current;

    if (!currentEditor.resizing) return;

    const finalBounds = calculateResizePreview(
      currentEditor.resizing,
      mouseRef.current.x,
      mouseRef.current.y,
      minWidth,
      minHeight,
    );

    applyEditorUpdate(prev => applyResize(prev, finalBounds));

    setCurrentPreview(null);
  }, [applyEditorUpdate, minHeight, minWidth]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editorRef.current.resizing) {
        applyEditorUpdate(prev => cancelResizing(prev));
        setCurrentPreview(null);
      }
    },
    [applyEditorUpdate],
  );

  useEffect(() => {
    if (editor.resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('keydown', handleKeyDown);

      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.userSelect = '';
      };
    }
  }, [editor.resizing, handleMouseMove, handleMouseUp, handleKeyDown]);

  return {
    isResizing: editor.resizing !== null,
    resizingObjectId: editor.resizing?.objectId ?? null,
    resizePreview: currentPreview,
    startResize,
  };
}
