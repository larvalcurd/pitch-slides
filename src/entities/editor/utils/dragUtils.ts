import { isObjectSelection, type Editor } from '../types/EditorTypes';
import type { DragState, DragPreview } from '../types/UIStateTypes';
import { moveSlides } from '../actions/editorPresentationActions';

export function startDragging(
  editor: Editor,
  context:
    | {
        type: 'object';
        slideId: string;
        objectIds: string[];
      }
    | {
        type: 'slides';
        slideIds: string[];
      },
  mouseX: number,
  mouseY: number,
): Editor {
  if (context.type === 'object') {
    if (!isObjectSelection(editor.selection)) return editor;
    if (context.objectIds.length === 0) return editor;

    const currentSlide = editor.presentation.slides.find(slide => slide.id === context.slideId);
    if (!currentSlide) return editor;

    const originalPositions: Record<string, { x: number; y: number }> = {};

    for (const objectId of context.objectIds) {
      const obj = currentSlide.objects.find(o => o.id === objectId);
      if (obj) {
        originalPositions[objectId] = { x: obj.x, y: obj.y };
      }
    }

    const validObjectIds = Object.keys(originalPositions);
    if (validObjectIds.length === 0) return editor;

    return {
      ...editor,
      dragging: {
        type: 'object',
        slideId: context.slideId,
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
  }

  if (context.type === 'slides') {
    if (context.slideIds.length === 0) return editor;

    return {
      ...editor,
      dragging: {
        type: 'slides',
        slideIds: context.slideIds,
        startMouseY: mouseY,
        currentMouseY: mouseY,
        targetIndex: null,
      },
    };
  }

  return editor;
}

export function getDragDelta(
  dragging: DragState,
  currentMouseX: number,
  currentMouseY: number,
): { x: number; y: number } {
  if (dragging.type !== 'object') {
    return { x: 0, y: 0 };
  }

  return {
    x: currentMouseX - dragging.startMouseX,
    y: currentMouseY - dragging.startMouseY,
  };
}

export function calculateDragPreview(
  dragging: DragState,
  currentMouseX: number,
  currentMouseY: number,
): DragPreview {
  if (dragging.type !== 'object') {
    return { positions: {} };
  }

  const delta = getDragDelta(dragging, currentMouseX, currentMouseY);

  const positions: Record<string, { x: number; y: number }> = {};

  Object.entries(dragging.originalPositions).forEach(([id, original]) => {
    positions[id] = {
      x: original.x + delta.x,
      y: original.y + delta.y,
    };
  });

  return { positions };
}

export function applyDrag(editor: Editor): Editor {
  if (!editor.dragging) return editor;

  if (editor.dragging.type === 'object') {
    const { slideId, originalPositions } = editor.dragging;

    const deltaX = editor.dragging.currentMouseX - editor.dragging.startMouseX;
    const deltaY = editor.dragging.currentMouseY - editor.dragging.startMouseY;

    const updatedSlides = editor.presentation.slides.map(slide => {
      if (slide.id !== slideId) return slide;

      return {
        ...slide,
        objects: slide.objects.map(obj => {
          const original = originalPositions[obj.id];
          if (!original) return obj;

          return {
            ...obj,
            x: original.x + deltaX,
            y: original.y + deltaY,
          };
        }),
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
  }

  if (editor.dragging.type === 'slides') {
    const { targetIndex } = editor.dragging;

    if (targetIndex == null) {
      return { ...editor, dragging: null };
    }

    return moveSlides({ ...editor, dragging: null }, targetIndex);
  }

  return editor;
}

export function cancelDragging(editor: Editor): Editor {
  return {
    ...editor,
    dragging: null,
  };
}
