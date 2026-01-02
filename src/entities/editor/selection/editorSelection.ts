import { isObjectSelection, isSlideSelection, type Editor } from '../types/EditorTypes.ts';

export function selectSlide(editor: Editor, slideId: string): Editor {
  return {
    ...editor,
    selection: { type: 'slides', slideIds: [slideId] },
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
}

export function selectSlides(editor: Editor, slideIds: string[]): Editor {
  return {
    ...editor,
    selection: { type: 'slides', slideIds },
  };
}

export function toggleSlideSelection(editor: Editor, slideId: string): Editor {
  if (!isSlideSelection(editor.selection)) {
    return selectSlide(editor, slideId);
  }

  const currentIds = editor.selection.slideIds;
  const isSelected = currentIds.includes(slideId);

  if (isSelected && currentIds.length === 1) {
    return editor;
  }

  const newIds = isSelected ? currentIds.filter(id => id !== slideId) : [...currentIds, slideId];

  return {
    ...editor,
    selection: { type: 'slides', slideIds: newIds },
  };
}

export function selectObject(editor: Editor, slideId: string, objectId: string): Editor {
  return {
    ...editor,
    selection: {
      type: 'objects',
      slideId,
      objectIds: [objectId],
    },
  };
}

export function selectObjects(editor: Editor, slideId: string, objectIds: string[]): Editor {
  return {
    ...editor,
    selection: {
      type: 'objects',
      slideId,
      objectIds,
    },
  };
}

export function toggleObjectSelection(editor: Editor, slideId: string, objectId: string): Editor {
  if (!isObjectSelection(editor.selection) || editor.selection.slideId !== slideId) {
    return selectObject(editor, slideId, objectId);
  }

  const currentIds = editor.selection.objectIds;
  const isSelected = currentIds.includes(objectId);

  const newIds = isSelected ? currentIds.filter(id => id !== objectId) : [...currentIds, objectId];

  if (newIds.length === 0) {
    return {
      ...editor,
      selection: { type: 'slides', slideIds: [slideId] },
    };
  }

  return {
    ...editor,
    selection: {
      type: 'objects',
      slideId,
      objectIds: newIds,
    },
  };
}

export function clearSelection(editor: Editor): Editor {
  return {
    ...editor,
    selection: null,
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
}

export function clearObjectSelection(editor: Editor): Editor {
  if (isObjectSelection(editor.selection)) {
    return {
      ...editor,
      selection: { type: 'slides', slideIds: [editor.selection.slideId] },
      editingTextObjectId: null,
    };
  }

  return editor;
}

export function getSelectedSlideId(editor: Editor): string | null {
  if (isSlideSelection(editor.selection)) {
    return editor.selection.slideIds[0] ?? null;
  }
  if (isObjectSelection(editor.selection)) {
    return editor.selection.slideId;
  }
  return null;
}

export function getSelectedSlideIds(editor: Editor): string[] {
  if (isSlideSelection(editor.selection)) {
    return editor.selection.slideIds;
  }
  if (isObjectSelection(editor.selection)) {
    return [editor.selection.slideId];
  }
  return [];
}

export function getSelectedObjectIds(editor: Editor): string[] {
  if (isObjectSelection(editor.selection)) {
    return editor.selection.objectIds;
  }
  return [];
}
