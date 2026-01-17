import type { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import type { Editor } from '../../../entities/editor/types/EditorTypes';

type EditorReducer<P = void> = CaseReducer<Editor, PayloadAction<P>>;

export const startEditingText: EditorReducer<string> = (state, action) => {
  state.editingTextObjectId = action.payload;
};

export const stopEditingText: EditorReducer = (state) => {
  state.editingTextObjectId = null;
};

export const clearUIState: EditorReducer = (state) => {
  state.editingTextObjectId = null;
  state.dragging = null;
  state.resizing = null;
};