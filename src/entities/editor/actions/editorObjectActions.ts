import type { Editor } from '../types/EditorTypes.ts';
import { updateSlideInPresentation } from '../../presentation';
import { addObjectToSlide, removeObjectFromSlide, updateObjectInSlide } from '../../slide';
import { createImageObject, createTextObject } from '../../object';
import {
  calculateTextPosition,
  calculateImagePosition,
} from '../../object/utils/objectPositioning';
import { updateTextContent } from '../../object/utils/TextObjectUtils';
import { moveObject, resizeObject } from '../../object/utils/ObjectUtils';

export function addObject(editor: Editor, type: 'text' | 'image'): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
  if (!slide) return editor;

  let obj;
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
  const selection = editor.selection;
  if (!selection) return editor;

  const slide = editor.presentation.slides.find(s => s.id === selection.slideId);
  if (!slide) return editor;

  const updatedSlide = selection.objectIds.reduce(
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

export function updateTextObject(editor: Editor, objectId: string, content: string): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object || object.type !== 'text') return editor;

  const updatedObject = updateTextContent(object, content);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function updateObjectPosition(
  editor: Editor,
  objectId: string,
  x: number,
  y: number,
): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object) return editor;

  const updatedObject = moveObject(object, x, y);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
  };
}

export function updateObjectSize(
  editor: Editor,
  objectId: string,
  width: number,
  height: number,
): Editor {
  const slide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object) return editor;

  const updatedObject = resizeObject(object, width, height);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
  };
}
