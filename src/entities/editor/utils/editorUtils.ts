import type { Editor } from '../types/EditorTypes.ts';
import {
  addSlideToPresentation,
  createPresentation,
  deleteSlideFromPresentation,
  setSelectedSlide,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../../presentation';
import { addObjectToSlide, createSlide, removeObjectFromSlide, type Slide } from '../../slide';
import { createImageObject, createTextObject, type SlideObject } from '../../object';
import {
  calculateTextPosition,
  calculateImagePosition,
} from '../../object/utils/objectPositioning';

export function createEditor(): Editor {
  const presentation = createPresentation('p1', 'Untitled presentation', [createSlide()]);
  return {
    presentation,
    selection: null,
    selectedSlideId: presentation.selectedSlideId,
  };
}

export function addSlide(editor: Editor): Editor {
  const newSlide: Slide = createSlide();
  const newPresentation = addSlideToPresentation(editor.presentation, newSlide);
  return {
    ...editor,
    presentation: newPresentation,
    selectedSlideId: newPresentation.selectedSlideId,
  };
}

export function deleteSlide(editor: Editor): Editor {
  if (!editor.selectedSlideId) return editor;
  const newPresentation = deleteSlideFromPresentation(editor.presentation, editor.selectedSlideId);
  return {
    ...editor,
    presentation: newPresentation,
    selectedSlideId: newPresentation.selectedSlideId,
    selection: editor.selection?.slideId === editor.selectedSlideId ? null : editor.selection,
  };
}

export function selectSlide(editor: Editor, slideId: string): Editor {
  const newPresentation = setSelectedSlide(editor.presentation, slideId);
  return {
    ...editor,
    presentation: newPresentation,
    selectedSlideId: newPresentation.selectedSlideId,
    selection: { slideId, objectIds: [] }, // Обнови selection
  };
}

export function changePresentationTitle(editor: Editor, newTitle: string): Editor {
  const newPresentation = updatePresentationTitle(editor.presentation, newTitle);
  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function addObject(editor: Editor, type: 'text' | 'image'): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selectedSlideId);
  if (!slide) return editor;

  let obj: SlideObject;
  if (type === 'text') {
    const position = calculateTextPosition();
    obj = createTextObject({
      ...position,
      content: 'New text',
    });
  } else {
    const position = calculateImagePosition();
    obj = createImageObject({
      ...position,
      src: 'images/scale_1200.jpg',
    });
  }

  const updatedSlide = addObjectToSlide(slide, obj);
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);
  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function deleteObject(editor: Editor): Editor {
  if (!editor.selection) return editor;
  const slide = editor.presentation.slides.find(s => s.id === editor.selectedSlideId);
  if (!slide) return editor;

  const updatedSlide = editor.selection.objectIds.reduce(
    (currentSlide, objectId) => removeObjectFromSlide(currentSlide, objectId),
    slide,
  );
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);
  return {
    ...editor,
    presentation: newPresentation,
    selection: null,
  };
}

export function changeSlideBackground(editor: Editor, background: Slide['background']): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selectedSlideId);
  if (!slide) return editor;

  const updatedSlide = {
    ...slide,
    background,
  };
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);
  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function selectObject(editor: Editor, objectId: string | null, multiSelect = false): Editor {
  if (!editor.selectedSlideId) return editor;

  if (objectId === null) {
    return {
      ...editor,
      selection: null,
    };
  }

  const currentIds = editor.selection?.objectIds || [];
  const newIds = multiSelect ? [...currentIds, objectId] : [objectId];
  return {
    ...editor,
    selection: {
      slideId: editor.selectedSlideId,
      objectIds: newIds,
    },
  };
}
