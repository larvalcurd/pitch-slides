import type { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import type { Editor, EditorSelection } from '../../../entities/editor/types/EditorTypes';
import { isSlideSelection } from '../../../entities/editor/types/EditorTypes';
import type { Slide } from '../../../entities/slide';
import { createSlide, updateSlideBackground } from '../../../entities/slide';
import {
  addSlideToPresentation,
  deleteSlideFromPresentation,
  moveSlides as moveSlidesInPresentation,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../../../entities/presentation';
import { getSelectedSlideId } from '../../../entities/editor/selection/editorSelection';
import { findSlideById } from '../helpers';
import { createInitialState } from '../initialState';

type EditorReducer<P = void> = CaseReducer<Editor, PayloadAction<P>>;

export const resetEditor: EditorReducer = () => createInitialState();

export const addSlide: EditorReducer = (state) => {
  const newSlide = createSlide();
  const newPresentation = addSlideToPresentation(state.presentation, newSlide);

  state.presentation = newPresentation;
  state.selection = { type: 'slides', slideIds: [newSlide.id] };
  state.dragging = null;
  state.resizing = null;
  state.editingTextObjectId = null;
};

export const deleteSlide: EditorReducer = (state) => {
  if (!isSlideSelection(state.selection) || state.selection.slideIds.length === 0) {
    return;
  }

  let newPresentation = state.presentation;
  const slideSelection = state.selection;
  
  for (const slideId of slideSelection.slideIds) {
    newPresentation = deleteSlideFromPresentation(newPresentation, slideId);
  }

  const slides = newPresentation.slides;
  let newSelection: EditorSelection | null = null;

  if (slides.length > 0) {
    const firstDeletedIndex = state.presentation.slides.findIndex(
      s => s.id === slideSelection.slideIds[0],
    );
    const newIndex = Math.min(firstDeletedIndex, slides.length - 1);
    newSelection = { type: 'slides', slideIds: [slides[newIndex].id] };
  }

  state.presentation = newPresentation;
  state.selection = newSelection;
  state.dragging = null;
  state.resizing = null;
  state.editingTextObjectId = null;
};

export const moveSlides: EditorReducer<number> = (state, action) => {
  if (!isSlideSelection(state.selection)) return;
  
  const selectedIds = state.selection.slideIds;
  if (selectedIds.length === 0) return;

  const newPresentation = moveSlidesInPresentation(
    state.presentation,
    selectedIds,
    action.payload,
  );

  if (newPresentation !== state.presentation) {
    state.presentation = newPresentation;
  }
};

export const changePresentationTitle: EditorReducer<string> = (state, action) => {
  const newPresentation = updatePresentationTitle(state.presentation, action.payload);

  if (newPresentation !== state.presentation) {
    state.presentation = newPresentation;
  }
};

export const changeSlideBackground: EditorReducer<Slide['background']> = (state, action) => {
  const slideId = getSelectedSlideId(state);
  if (!slideId) return;

  const slide = findSlideById(state, slideId);
  if (!slide) return;

  const updatedSlide = updateSlideBackground(slide, action.payload);
  const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);
  state.presentation = newPresentation;
};