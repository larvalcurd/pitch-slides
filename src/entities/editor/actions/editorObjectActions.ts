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
import type { ImagePayload } from '../../object/types/ImagePayload.ts';

export function addTextObject(editor: Editor): Editor {
  const slideId = editor.selection?.slideId;
  if (!slideId) return editor;

  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const position = calculateTextPosition();
  const textObject = createTextObject({
    ...position,
    content: 'New text',
  });

  const updatedSlide = addObjectToSlide(slide, textObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slide.id, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      slideId,
      objectIds: [textObject.id],
    },
    editingTextObjectId: textObject.id,
  };
}

export function addImageObject(editor: Editor, payload: ImagePayload): Editor {
  const slideId = editor.selection?.slideId;
  if (!slideId) return editor;

  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const imageObject = createImageObject(payload);
  const updatedSlide = addObjectToSlide(slide, imageObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      slideId,
      objectIds: [imageObject.id],
    },
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
