import type { Editor } from '../types/EditorTypes';
import { isObjectSelection } from '../types/EditorTypes';
import { updateSlideInPresentation } from '../../presentation';
import { addObjectToSlide, removeObjectFromSlide, updateObjectInSlide } from '../../slide';
import { createImageObject, createTextObject } from '../../object';
import { calculateTextPosition } from '../../object/utils/objectPositioning';
import { updateTextContent } from '../../object';
import { moveObject, resizeObject } from '../../object';
import type { ImagePayload } from '../../object/types/ImagePayload';
import { getSelectedSlideId } from '../selection/editorSelection';

export function addTextObject(editor: Editor): Editor {
  const selectedSlideId = getSelectedSlideId(editor);
  if (!selectedSlideId) return editor;

  const slide = editor.presentation.slides.find(s => s.id === selectedSlideId);
  if (!slide) return editor;

  const position = calculateTextPosition();
  const textObject = createTextObject({
    ...position,
    content: 'New text',
  });

  const updatedSlide = addObjectToSlide(slide, textObject);
  const newPresentation = updateSlideInPresentation(
    editor.presentation,
    selectedSlideId,
    updatedSlide,
  );

  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      type: 'objects',
      slideId: selectedSlideId,
      objectIds: [textObject.id],
    },
    editingTextObjectId: textObject.id,
  };
}

export function addImageObject(editor: Editor, payload: ImagePayload): Editor {
  const selectedSlideId = getSelectedSlideId(editor);
  if (!selectedSlideId) return editor;

  const slide = editor.presentation.slides.find(s => s.id === selectedSlideId);
  if (!slide) return editor;

  const imageObject = createImageObject(payload);
  const updatedSlide = addObjectToSlide(slide, imageObject);
  const newPresentation = updateSlideInPresentation(
    editor.presentation,
    selectedSlideId,
    updatedSlide,
  );

  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      type: 'objects',
      slideId: selectedSlideId,
      objectIds: [imageObject.id],
    },
  };
}

export function deleteObject(editor: Editor): Editor {
  if (!isObjectSelection(editor.selection)) return editor;

  const { slideId, objectIds } = editor.selection;
  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const updatedSlide = objectIds.reduce(
    (currentSlide, objectId) => removeObjectFromSlide(currentSlide, objectId),
    slide,
  );

  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
    selection: {
      type: 'slides',
      slideIds: [slideId],
    },
    editingTextObjectId: null,
  };
}

export function updateTextObject(editor: Editor, objectId: string, content: string): Editor {
  if (!isObjectSelection(editor.selection)) return editor;

  const { slideId } = editor.selection;
  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object || object.type !== 'text') return editor;

  const updatedObject = updateTextContent(object, content);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

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
  if (!isObjectSelection(editor.selection)) return editor;

  const { slideId } = editor.selection;
  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object) return editor;

  const updatedObject = moveObject(object, x, y);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

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
  if (!isObjectSelection(editor.selection)) return editor;

  const { slideId } = editor.selection;
  const slide = editor.presentation.slides.find(s => s.id === slideId);
  if (!slide) return editor;

  const object = slide.objects.find(o => o.id === objectId);
  if (!object) return editor;

  const updatedObject = resizeObject(object, width, height);
  const updatedSlide = updateObjectInSlide(slide, objectId, updatedObject);
  const newPresentation = updateSlideInPresentation(editor.presentation, slideId, updatedSlide);

  return {
    ...editor,
    presentation: newPresentation,
  };
}
