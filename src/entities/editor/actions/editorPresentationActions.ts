import { isSlideSelection, type Editor, type EditorSelection } from '../types/EditorTypes.ts';
import {
  addSlideToPresentation,
  deleteSlideFromPresentation,
  moveSlides as moveSlidesInPresentation,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../../presentation';
import { createSlide, type Slide } from '../../slide';
import { getSelectedSlideId, getSelectedSlideIds } from '../selection/editorSelection.ts';

export function addSlide(editor: Editor): Editor {
  const newSlide: Slide = createSlide();
  const newPresentation = addSlideToPresentation(editor.presentation, newSlide);

  return {
    ...editor,
    presentation: newPresentation,
    selection: { type: 'slides', slideIds: [newSlide.id] },
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
}

export function deleteSlide(editor: Editor): Editor {
  if (!isSlideSelection(editor.selection) || editor.selection.slideIds.length === 0) {
    return editor;
  }

  let newPresentation = editor.presentation;
  const slideSelection = editor.selection;
  for (const slideId of slideSelection.slideIds) {
    newPresentation = deleteSlideFromPresentation(newPresentation, slideId);
  }

  const slides = newPresentation.slides;
  let newSelection: EditorSelection | null = null;

  if (slides.length > 0) {
    const firstDeletedIndex = editor.presentation.slides.findIndex(
      s => s.id === slideSelection.slideIds[0],
    );
    const newIndex = Math.min(firstDeletedIndex, slides.length - 1);
    newSelection = { type: 'slides', slideIds: [slides[newIndex].id] };
  }

  return {
    ...editor,
    presentation: newPresentation,
    selection: newSelection,
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
}

export function moveSlides(editor: Editor, targetIndex: number): Editor {
  const selectedSlideIds = getSelectedSlideIds(editor);

  if (selectedSlideIds.length === 0) {
    return editor;
  }

  const newPresentation = moveSlidesInPresentation(
    editor.presentation,
    selectedSlideIds,
    targetIndex,
  );

  if (newPresentation === editor.presentation) {
    return editor;
  }

  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function changePresentationTitle(editor: Editor, newTitle: string): Editor {
  const newPresentation = updatePresentationTitle(editor.presentation, newTitle);

  if (newPresentation === editor.presentation) {
    return editor;
  }

  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function changeSlideBackground(editor: Editor, background: Slide['background']): Editor {
  const slideId = getSelectedSlideId(editor);
  if (!slideId) return editor;

  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const updatedSlide = { ...slide, background };
  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
  };
}
