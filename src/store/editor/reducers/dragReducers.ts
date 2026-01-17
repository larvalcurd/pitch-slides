import type { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import type { Editor } from '../../../entities/editor/types/EditorTypes';
import { isSlideSelection, isObjectSelection } from '../../../entities/editor/types/EditorTypes';
import {
  startDragging,
  updateDragging,
  applyDrag,
  cancelDragging,
} from '../../../entities/editor';
import type { DragStartPayload, DragUpdatePayload } from '../types';

type EditorReducer<P = void> = CaseReducer<Editor, PayloadAction<P>>;

export const startDrag: EditorReducer<DragStartPayload> = (state, action) => {
  if (!state.selection) return;

  let context:
    | { type: 'object'; slideId: string; objectIds: string[] }
    | { type: 'slides'; slideIds: string[] }
    | null = null;

  if (isSlideSelection(state.selection)) {
    context = { type: 'slides', slideIds: state.selection.slideIds };
  } else if (isObjectSelection(state.selection)) {
    const selection = state.selection as { slideId: string; objectIds: string[] };
    context = { type: 'object', slideId: selection.slideId, objectIds: selection.objectIds };
  }

  if (!context) return;

  return startDragging(state, context, action.payload.mouseX, action.payload.mouseY);
};

export const updateDragPosition: EditorReducer<DragUpdatePayload> = (state, action) => {
  return updateDragging(
    state,
    action.payload.mouseX,
    action.payload.mouseY,
    action.payload.targetIndex,
  );
};

export const finishDrag: EditorReducer = (state) => {
  if (!state.dragging) return state;

  if (!state.dragging.thresholdPassed) {
    return cancelDragging(state);
  }

  return applyDrag(state);
};

export const cancelDrag: EditorReducer = (state) => {
  return cancelDragging(state);
};