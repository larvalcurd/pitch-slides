import type { Editor, SerializableEditor } from '../types/EditorTypes';

export const serializeEditor = (editor: Editor): SerializableEditor => ({
  presentation: editor.presentation,
  selection: editor.selection,
});

export const deserializeEditor = (data: SerializableEditor): Editor => ({
  presentation: data.presentation,
  selection: data.selection,

  dragging: null,
  resizing: null,
  editingTextObjectId: null,
});
