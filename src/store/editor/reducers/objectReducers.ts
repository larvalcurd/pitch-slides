import type { PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import type { Editor } from '../../../entities/editor/types/EditorTypes';
import { isObjectSelection } from '../../../entities/editor/types/EditorTypes';
import {
  addObjectToSlide,
  removeObjectFromSlide,
  updateObjectInSlide,
} from '../../../entities/slide';
import { updateSlideInPresentation } from '../../../entities/presentation';
import { getSelectedSlideId } from '../../../entities/editor/selection/editorSelection';
import {
  createImageObject,
  createTextObject,
  moveObject,
  resizeObject,
  updateTextContent,
} from '../../../entities/object';
import { calculateTextPosition } from '../../../entities/object/utils/objectPositioning';
import { findSlideById } from '../helpers';
import type {
  ImagePayload,
  TextUpdatePayload,
  PositionUpdatePayload,
  SizeUpdatePayload,
} from '../types';

type EditorReducer<P = void> = CaseReducer<Editor, PayloadAction<P>>;

export const addTextObject: EditorReducer = (state) => {
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
};

export const addImageObject: EditorReducer<ImagePayload> = (state, action) => {
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
};

export const deleteObject: EditorReducer = (state) => {
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
};

export const updateTextObject: EditorReducer<TextUpdatePayload> = (state, action) => {
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
};

export const updateObjectPosition: EditorReducer<PositionUpdatePayload> = (state, action) => {
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
};

export const updateObjectSize: EditorReducer<SizeUpdatePayload> = (state, action) => {
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
};