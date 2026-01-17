import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import {
  isObjectSelection,
  isSlideSelection,
  type Editor,
  type EditorSelection,
} from '../entities/editor/types/EditorTypes';
import { startDragging, updateDragging, applyDrag, cancelDragging } from '../entities/editor';
import {
  addObjectToSlide,
  createSlide,
  removeObjectFromSlide,
  updateObjectInSlide,
  updateSlideBackground,
  type Slide,
} from '../entities/slide';
import {
  addSlideToPresentation,
  deleteSlideFromPresentation,
  moveSlides as moveSlidesInPresentation,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../entities/presentation';
import { getSelectedSlideId } from '../entities/editor/selection/editorSelection';
import {
  createImageObject,
  createTextObject,
  moveObject,
  resizeObject,
  updateTextContent,
} from '../entities/object';
import type { ImagePayload } from '../entities/object/types/ImagePayload';
import { calculateTextPosition } from '../entities/object/utils/objectPositioning';

const findSlideById = (state: Editor, slideId: string): Slide | null =>
  state.presentation.slides.find(s => s.id === slideId) || null;

const createInitialState = (): Editor => {
  const firstSlide = createSlide();
  return {
    presentation: {
      id: nanoid(),
      title: 'Untitled Presentation',
      slides: [firstSlide],
    },
    selection: {
      type: 'slides',
      slideIds: [firstSlide.id],
    },
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
};

const initialState: Editor = createInitialState();

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    resetEditor: () => createInitialState(),

    addSlide(state) {
      const newSlide = createSlide();
      const newPresentation = addSlideToPresentation(state.presentation, newSlide);

      state.presentation = newPresentation;
      state.selection = { type: 'slides', slideIds: [newSlide.id] };
      state.dragging = null;
      state.resizing = null;
      state.editingTextObjectId = null;
    },

    deleteSlide(state) {
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
    },

    changePresentationTitle(state, action: PayloadAction<string>) {
      const newPresentation = updatePresentationTitle(state.presentation, action.payload);

      if (newPresentation === state.presentation) {
        return;
      }

      state.presentation = newPresentation;
    },

    changeSlideBackground(state, action: PayloadAction<Slide['background']>) {
      const slideId = getSelectedSlideId(state);
      if (!slideId) return;

      const slide = findSlideById(state, slideId);
      if (!slide) return;

      const updatedSlide = updateSlideBackground(slide, action.payload);
      const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);
      state.presentation = newPresentation;
    },

    selectSlide(state, action: PayloadAction<string>) {
      state.selection = { type: 'slides', slideIds: [action.payload] };
      state.dragging = null;
      state.resizing = null;
      state.editingTextObjectId = null;
    },

    toggleSlideSelection(state, action: PayloadAction<string>) {
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
    },

    selectObject(state, action: PayloadAction<{ slideId: string; objectId: string }>) {
      state.selection = {
        type: 'objects',
        slideId: action.payload.slideId,
        objectIds: [action.payload.objectId],
      };
    },

    toggleObjectSelection(state, action: PayloadAction<{ slideId: string; objectId: string }>) {
      if (
        !isObjectSelection(state.selection) ||
        state.selection.slideId !== action.payload.slideId
      ) {
        state.selection = {
          type: 'objects',
          slideId: action.payload.slideId,
          objectIds: [action.payload.objectId],
        };
        return;
      }

      const currentIds = state.selection.objectIds;
      const isSelected = currentIds.includes(action.payload.objectId);

      const newIds = isSelected
        ? currentIds.filter(id => id !== action.payload.objectId)
        : [...currentIds, action.payload.objectId];

      if (newIds.length === 0) {
        state.selection = { type: 'slides', slideIds: [action.payload.slideId] };
      } else {
        state.selection = {
          type: 'objects',
          slideId: action.payload.slideId,
          objectIds: newIds,
        };
      }
    },

    clearSelection(state) {
      state.selection = null;
      state.dragging = null;
      state.resizing = null;
      state.editingTextObjectId = null;
    },

    clearObjectSelection(state) {
      if (isObjectSelection(state.selection)) {
        state.selection = { type: 'slides', slideIds: [state.selection.slideId] };
        state.editingTextObjectId = null;
      }
    },

    startEditingText(state, action: PayloadAction<string>) {
      state.editingTextObjectId = action.payload;
    },

    stopEditingText(state) {
      state.editingTextObjectId = null;
    },

    clearUIState(state) {
      state.editingTextObjectId = null;
      state.dragging = null;
      state.resizing = null;
    },

    addTextObject(state) {
      const selectedSlideId = getSelectedSlideId(state);
      if (!selectedSlideId) return;

      const slide = findSlideById(state, selectedSlideId);
      if (!slide) return;

      const position = calculateTextPosition();
      const textObject = createTextObject({ ...position, content: 'New text' });
      const updatedSlide = addObjectToSlide(slide, textObject);
      const newPresentation = updateSlideInPresentation(
        state.presentation,
        selectedSlideId,
        updatedSlide,
      );

      state.presentation = newPresentation;
      state.selection = { type: 'objects', slideId: selectedSlideId, objectIds: [textObject.id] };
      state.editingTextObjectId = textObject.id;
    },

    addImageObject(state, action: PayloadAction<ImagePayload>) {
      const selectedSlideId = getSelectedSlideId(state);
      if (!selectedSlideId) return;

      const slide = findSlideById(state, selectedSlideId);
      if (!slide) return;

      const imageObject = createImageObject(action.payload);
      const updatedSlide = addObjectToSlide(slide, imageObject);
      const newPresentation = updateSlideInPresentation(
        state.presentation,
        selectedSlideId,
        updatedSlide,
      );

      state.presentation = newPresentation;
      state.selection = { type: 'objects', slideId: selectedSlideId, objectIds: [imageObject.id] };
    },

    deleteObject(state) {
      if (!isObjectSelection(state.selection)) return;

      const { slideId, objectIds } = state.selection;
      const slide = findSlideById(state, slideId);
      if (!slide) return;

      const updatedSlide = objectIds.reduce(
        (currentSlide, objectId) => removeObjectFromSlide(currentSlide, objectId),
        slide,
      );
      const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);

      state.presentation = newPresentation;
      state.selection = { type: 'slides', slideIds: [slideId] };
      state.editingTextObjectId = null;
    },

    updateTextObject(state, action: PayloadAction<{ objectId: string; content: string }>) {
      if (!isObjectSelection(state.selection)) return;

      const { slideId } = state.selection;
      const slide = findSlideById(state, slideId);
      if (!slide) return;

      const object = slide.objects.find(o => o.id === action.payload.objectId);
      if (!object || object.type !== 'text') return;

      const updatedObject = updateTextContent(object, action.payload.content);
      const updatedSlide = updateObjectInSlide(slide, action.payload.objectId, updatedObject);
      const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);

      state.presentation = newPresentation;
    },

    updateObjectPosition(state, action: PayloadAction<{ objectId: string; x: number; y: number }>) {
      if (!isObjectSelection(state.selection)) return;

      const { slideId } = state.selection;
      const slide = findSlideById(state, slideId);
      if (!slide) return;

      const object = slide.objects.find(o => o.id === action.payload.objectId);
      if (!object) return;

      const updatedObject = moveObject(object, action.payload.x, action.payload.y);
      const updatedSlide = updateObjectInSlide(slide, action.payload.objectId, updatedObject);
      const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);

      state.presentation = newPresentation;
    },
    
    updateObjectSize(
      state,
      action: PayloadAction<{ objectId: string; width: number; height: number }>,
    ) {
      if (!isObjectSelection(state.selection)) return;

      const { slideId } = state.selection;
      const slide = findSlideById(state, slideId);
      if (!slide) return;

      const object = slide.objects.find(o => o.id === action.payload.objectId);
      if (!object) return;

      const updatedObject = resizeObject(object, action.payload.width, action.payload.height);
      const updatedSlide = updateObjectInSlide(slide, action.payload.objectId, updatedObject);
      const newPresentation = updateSlideInPresentation(state.presentation, slideId, updatedSlide);

      state.presentation = newPresentation;
    },
    
    moveSlides(state, action: PayloadAction<number>) {
      if (!isSlideSelection(state.selection)) return;
      
      const selectedIds = state.selection.slideIds;
      if (selectedIds.length === 0) return;

      const newPresentation = moveSlidesInPresentation(
        state.presentation,
        selectedIds,
        action.payload,
      );

      if (newPresentation === state.presentation) {
        return;
      }

      state.presentation = newPresentation;
    },

    startDrag(state, action: PayloadAction<{ mouseX: number; mouseY: number }>) {
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
    },

    updateDragPosition(state, action: PayloadAction<{ mouseX: number; mouseY: number; targetIndex?: number }>) {
      return updateDragging(state, action.payload.mouseX, action.payload.mouseY, action.payload.targetIndex);
    },

    finishDrag(state) {
      if (!state.dragging) return state;

      if (!state.dragging.thresholdPassed) {
        return cancelDragging(state);
      }

      return applyDrag(state);
    },

    cancelDrag(state) {
      return cancelDragging(state);
    },
  },
});

export const {
  addSlide,
  deleteSlide,
  changePresentationTitle,
  changeSlideBackground,
  selectSlide,
  toggleSlideSelection,
  selectObject,
  toggleObjectSelection,
  clearSelection,
  clearObjectSelection,
  startEditingText,
  stopEditingText,
  clearUIState,
  addTextObject,
  addImageObject,
  deleteObject,
  moveSlides,
  startDrag,
  updateDragPosition,
  finishDrag,
  cancelDrag,
  updateTextObject,
  updateObjectPosition,
  updateObjectSize,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
