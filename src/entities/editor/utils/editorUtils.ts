import type { Editor } from '../types/EditorTypes.ts';
import type { Slide } from '../../slide/types/SlideTypes.ts';
import type { SlideObject } from '../../object/types/ObjectTypes.ts';
import {
  createPresentation,
  addSlideToPresentation,
  deleteSlideFromPresentation,
  setSelectedSlide,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../../presentation/utils/PresentationUtils.ts';
import { createSlide } from '../../slide/factory/SlideFactory.ts';
import { createTextObject } from '../../object/factory/TextObjectFactory.ts';
import { createImageObject } from '../../object/factory/ImageObjectFactory.ts';
import { addObjectToSlide, removeObjectFromSlide } from '../../slide/utils/SlideUtils.ts';

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
  };
}

export function selectSlide(editor: Editor, slideId: string): Editor {
  const newPresentation = setSelectedSlide(editor.presentation, slideId);
  return {
    ...editor,
    presentation: newPresentation,
    selectedSlideId: slideId,
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
    obj = createTextObject({
      x: 20,
      y: 20,
      width: 300,
      height: 80,
      content: 'New text',
    });
  } else {
    const imgW = 240;
    const paddingFromEdge = 30;
    const SLIDE_WIDTH = 960;
    const x = SLIDE_WIDTH - imgW - paddingFromEdge;
    obj = createImageObject({
      x,
      y: 20,
      width: imgW,
      height: 160,
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

  const updatedSlide = removeObjectFromSlide(slide, editor.selection.objectIds[0]);
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

  const updatedSlide = { ...slide, background };
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);
  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function selectObject(editor: Editor, objectId: string): Editor {
  if (!editor.selectedSlideId) return editor;
  return {
    ...editor,
    selection: {
      slideId: editor.selectedSlideId,
      objectIds: [objectId],
    },
  };
}
