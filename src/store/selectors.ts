import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { calculateDragPreview } from '../entities/editor';

export const selectDragPreview = createSelector(
  (state: RootState) => state.editor,
  (editor) => {
    if (!editor.dragging || editor.dragging.type !== 'object') return null;
    return calculateDragPreview(editor.dragging, editor.dragging.currentMouseX, editor.dragging.currentMouseY);
  }
);