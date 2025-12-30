import type { Editor, ObjectSelection } from '../types/EditorTypes.ts';
import {
  addSlideToPresentation,
  deleteSlideFromPresentation,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../../presentation';
import { createSlide, type Slide } from '../../slide';

export function addSlide(editor: Editor): Editor {
  const newSlide: Slide = createSlide();
  const newPresentation = addSlideToPresentation(editor.presentation, newSlide);
  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      slideId: newSlide.id,
      objectIds: [],
    },
  };
}

export function deleteSlide(editor: Editor): Editor {
  if (!editor.selection?.slideId) return editor;
  const slideIdToDelete = editor.selection.slideId;
  const newPresentation = deleteSlideFromPresentation(editor.presentation, slideIdToDelete);

  const slides = newPresentation.slides;
  let newSelection: ObjectSelection | null = editor.selection;

  if (slides.length === 0) {
    newSelection = null;
  } else if (slideIdToDelete === editor.selection.slideId) {
    const deletedIndex = editor.presentation.slides.findIndex(s => s.id === slideIdToDelete);
    const nextSlide = slides[deletedIndex] ?? slides[deletedIndex - 1] ?? slides[0];
    newSelection = { slideId: nextSlide.id, objectIds: [] };
  }

  return {
    ...editor,
    presentation: newPresentation,
    selection: newSelection,
  };
}

export function changePresentationTitle(editor: Editor, newTitle: string): Editor {
  const newPresentation = updatePresentationTitle(editor.presentation, newTitle);
  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function changeSlideBackground(editor: Editor, background: Slide['background']): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
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
