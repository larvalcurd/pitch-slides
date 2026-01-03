import { isObjectSelection, type Editor } from '../types/EditorTypes';
import type { DragPreview, DragState } from '../types/UIStateTypes';

export const startDragging = (
  editor: Editor,
  objectIds: string[],
  mouseX: number,
  mouseY: number,
): Editor => {
  if (!isObjectSelection(editor.selection)) {
    return editor;
  }

  if (objectIds.length === 0) {
    return editor;
  }

  const { slideId } = editor.selection;

  const currentSlide = editor.presentation.slides.find(slide => slide.id === slideId);

  if (!currentSlide) {
    return editor;
  }

  const originalPositions: Record<string, { x: number; y: number }> = {};

  for (const objectId of objectIds) {
    const obj = currentSlide.objects.find(o => o.id === objectId);
    if (obj) {
      originalPositions[objectId] = { x: obj.x, y: obj.y };
    }
  }

  const validObjectIds = Object.keys(originalPositions);

  if (validObjectIds.length === 0) {
    return editor;
  }

  return {
    ...editor,
    dragging: {
      objectIds: validObjectIds,
      startMouseX: mouseX,
      startMouseY: mouseY,
      currentMouseX: mouseX,
      currentMouseY: mouseY,
      originalPositions,
    },
    resizing: null,
    editingTextObjectId: null,
  };
};

export const getDragDelta = (
  dragging: DragState,
  currentMouseX: number,
  currentMouseY: number,
): { x: number; y: number } => ({
  x: currentMouseX - dragging.startMouseX,
  y: currentMouseY - dragging.startMouseY,
});

export const calculateDragPreview = (
  dragging: DragState,
  currentMouseX: number,
  currentMouseY: number,
): DragPreview => {
  const delta = getDragDelta(dragging, currentMouseX, currentMouseY);

  const positions: Record<string, { x: number; y: number }> = {};

  Object.entries(dragging.originalPositions).forEach(([id, originalPos]) => {
    positions[id] = {
      x: originalPos.x + delta.x,
      y: originalPos.y + delta.y,
    };
  });

  return { positions };
};

export const applyDrag = (
  editor: Editor,
  finalPositions: Record<string, { x: number; y: number }>,
): Editor => {
  if (!isObjectSelection(editor.selection)) {
    return {
      ...editor,
      dragging: null,
    };
  }

  const { slideId } = editor.selection;

  const updatedSlides = editor.presentation.slides.map(slide => {
    if (slide.id !== slideId) {
      return slide;
    }

    const updatedObjects = slide.objects.map(obj => {
      const newPos = finalPositions[obj.id];
      if (!newPos) return obj;

      return {
        ...obj,
        x: newPos.x,
        y: newPos.y,
      };
    });

    return {
      ...slide,
      objects: updatedObjects,
    };
  });

  return {
    ...editor,
    presentation: {
      ...editor.presentation,
      slides: updatedSlides,
    },
    dragging: null,
  };
};

export const cancelDragging = (editor: Editor): Editor => ({
  ...editor,
  dragging: null,
});

export const isDraggingActive = (editor: Editor): boolean => {
  return editor.dragging !== null;
};

export const getDraggingObjectIds = (editor: Editor): string[] => {
  return editor.dragging?.objectIds ?? [];
};

export const isObjectBeingDragged = (editor: Editor, objectId: string): boolean => {
  return editor.dragging?.objectIds.includes(objectId) ?? false;
};
