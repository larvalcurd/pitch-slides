import type { Editor } from '../types/EditorTypes.ts';

export function selectSlide(editor: Editor, slideId: string): Editor {
  return {
    ...editor,
    selection: { slideId, objectIds: [] },
  };
}

export function selectObject(editor: Editor, objectId: string | null, multiSelect = false): Editor {
  if (!editor.selection || !editor.selection.slideId) return editor;

  if (objectId === null) {
    return {
      ...editor,
      selection: null,
    };
  }

  const currentIds = editor.selection.objectIds || [];
  const newIds = multiSelect ? [...currentIds, objectId] : [objectId];
  return {
    ...editor,
    selection: {
      slideId: editor.selection.slideId,
      objectIds: newIds,
    },
  };
}

export function clearSelection(editor: Editor): Editor {
  return {
    ...editor,
    selection: null,
  };
}
