import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

import * as slideReducers from './reducers/slideReducers';
import * as selectionReducers from './reducers/selectionReducers';
import * as objectReducers from './reducers/objectReducers';
import * as uiReducers from './reducers/uiReducers';
import * as dragReducers from './reducers/dragReducers';

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Slide reducers
    resetEditor: slideReducers.resetEditor,
    addSlide: slideReducers.addSlide,
    deleteSlide: slideReducers.deleteSlide,
    moveSlides: slideReducers.moveSlides,
    changePresentationTitle: slideReducers.changePresentationTitle,
    changeSlideBackground: slideReducers.changeSlideBackground,

    // Selection reducers
    selectSlide: selectionReducers.selectSlide,
    toggleSlideSelection: selectionReducers.toggleSlideSelection,
    selectObject: selectionReducers.selectObject,
    toggleObjectSelection: selectionReducers.toggleObjectSelection,
    clearSelection: selectionReducers.clearSelection,
    clearObjectSelection: selectionReducers.clearObjectSelection,

    // Object reducers
    addTextObject: objectReducers.addTextObject,
    addImageObject: objectReducers.addImageObject,
    deleteObject: objectReducers.deleteObject,
    updateTextObject: objectReducers.updateTextObject,
    updateObjectPosition: objectReducers.updateObjectPosition,
    updateObjectSize: objectReducers.updateObjectSize,

    // UI reducers
    startEditingText: uiReducers.startEditingText,
    stopEditingText: uiReducers.stopEditingText,
    clearUIState: uiReducers.clearUIState,

    // Drag reducers
    startDrag: dragReducers.startDrag,
    updateDragPosition: dragReducers.updateDragPosition,
    finishDrag: dragReducers.finishDrag,
    cancelDrag: dragReducers.cancelDrag,
  },
});

export const {
  // Slides
  resetEditor,
  addSlide,
  deleteSlide,
  moveSlides,
  changePresentationTitle,
  changeSlideBackground,
  // Selection
  selectSlide,
  toggleSlideSelection,
  selectObject,
  toggleObjectSelection,
  clearSelection,
  clearObjectSelection,
  // Objects
  addTextObject,
  addImageObject,
  deleteObject,
  updateTextObject,
  updateObjectPosition,
  updateObjectSize,
  // UI
  startEditingText,
  stopEditingText,
  clearUIState,
  // Drag
  startDrag,
  updateDragPosition,
  finishDrag,
  cancelDrag,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;

export type { Editor } from '../../entities/editor/types/EditorTypes';