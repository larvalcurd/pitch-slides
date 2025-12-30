import type { Editor } from '../types/EditorTypes';

export const resetUIState = (editor: Editor): Editor => ({
  ...editor,
  dragging: null,
  resizing: null,
  editingTextObjectId: null,
});

export const hasActiveUIState = (editor: Editor): boolean => {
  return (
    editor.dragging !== null || editor.resizing !== null || editor.editingTextObjectId !== null
  );
};
