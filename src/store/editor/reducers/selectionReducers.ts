import type { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import type { Editor } from '../../../entities/editor/types/EditorTypes';
import { isSlideSelection, isObjectSelection } from '../../../entities/editor/types/EditorTypes';
import type { ObjectSelectionPayload } from '../types';

type EditorReducer<P = void> = CaseReducer<Editor, PayloadAction<P>>;

export const selectSlide: EditorReducer<string> = (state, action) => {
  state.selection = { type: 'slides', slideIds: [action.payload] };
  state.dragging = null;
  state.resizing = null;
  state.editingTextObjectId = null;
};

export const toggleSlideSelection: EditorReducer<string> = (state, action) => {
  if (!isSlideSelection(state.selection)) {
    state.selection = { type: 'slides', slideIds: [action.payload] };
    state.dragging = null;
    state.resizing = null;
    state.editingTextObjectId = null;
    return;
  }

  const currentIds = state.selection.slideIds;
  const isSelected = currentIds.includes(action.payload);

  if (isSelected && currentIds.length === 1) {
    return; 
  }

  const newIds = isSelected
    ? currentIds.filter(id => id !== action.payload)
    : [...currentIds, action.payload];

  state.selection = { type: 'slides', slideIds: newIds };
};

export const selectObject: EditorReducer<ObjectSelectionPayload> = (state, action) => {
  state.selection = {
    type: 'objects',
    slideId: action.payload.slideId,
    objectIds: [action.payload.objectId],
  };
};

export const toggleObjectSelection: EditorReducer<ObjectSelectionPayload> = (state, action) => {
  const { slideId, objectId } = action.payload;

  if (!isObjectSelection(state.selection) || state.selection.slideId !== slideId) {
    state.selection = {
      type: 'objects',
      slideId,
      objectIds: [objectId],
    };
    return;
  }

  const currentIds = state.selection.objectIds;
  const isSelected = currentIds.includes(objectId);

  const newIds = isSelected
    ? currentIds.filter(id => id !== objectId)
    : [...currentIds, objectId];

  if (newIds.length === 0) {
    state.selection = { type: 'slides', slideIds: [slideId] };
  } else {
    state.selection = {
      type: 'objects',
      slideId,
      objectIds: newIds,
    };
  }
};

export const clearSelection: EditorReducer = (state) => {
  state.selection = null;
  state.dragging = null;
  state.resizing = null;
  state.editingTextObjectId = null;
};

export const clearObjectSelection: EditorReducer = (state) => {
  if (isObjectSelection(state.selection)) {
    state.selection = { type: 'slides', slideIds: [state.selection.slideId] };
    state.editingTextObjectId = null;
  }
};