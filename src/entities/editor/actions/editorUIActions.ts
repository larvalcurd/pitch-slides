import type { Editor } from '../types/EditorTypes';

export function startEditingText(editor: Editor, objectId: string): Editor {
  return {
    ...editor,
    editingTextObjectId: objectId,
  };
}

export function stopEditingText(editor: Editor): Editor {
  return {
    ...editor,
    editingTextObjectId: null,
  };
}

export function clearUIState(editor: Editor): Editor {
  return {
    ...editor,
    editingTextObjectId: null,
    dragging: null,
    resizing: null,
  };
}

export function clearObjectSelection(editor: Editor): Editor {
  if (!editor.selection) return editor;

  return {
    ...editor,
    selection: {
      ...editor.selection,
      objectIds: [],
    },
  };
}
