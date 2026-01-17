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

    const primaryObject = currentSlide.objects.find(o => o.id === validObjectIds[0]);
    if (!primaryObject) return editor;

    const dragOffsetX = mouseX - primaryObject.x;
    const dragOffsetY = mouseY - primaryObject.y;

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
        dragOffsetX,
        dragOffsetY,
        thresholdPassed: false,
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
        thresholdPassed: false,
      },
    };
  }

  return editor;
}

export function updateDragging(
  editor: Editor,
  mouseX: number,
  mouseY: number,
  targetIndex?: number,
): Editor {
  if (!editor.dragging) return editor;

  const threshold = 3;
  let thresholdPassed = editor.dragging.thresholdPassed;

  if (!thresholdPassed) {
    if (editor.dragging.type === 'object') {
      const dx = mouseX - editor.dragging.startMouseX;
      const dy = mouseY - editor.dragging.startMouseY;
      if (Math.sqrt(dx * dx + dy * dy) >= threshold) {
        thresholdPassed = true;
      }
    } else if (editor.dragging.type === 'slides') {
      const dy = mouseY - editor.dragging.startMouseY;
      if (Math.abs(dy) >= threshold) {
        thresholdPassed = true;
      }
    }
  }

  if (editor.dragging.type === 'object') {
    return {
      ...editor,
      dragging: {
        ...editor.dragging,
        currentMouseX: mouseX,
        currentMouseY: mouseY,
        thresholdPassed,
      },
    };
  } else if (editor.dragging.type === 'slides') {
    return {
      ...editor,
      dragging: {
        ...editor.dragging,
        currentMouseY: mouseY,
        targetIndex: targetIndex ?? editor.dragging.targetIndex,
        thresholdPassed,
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

  const deltaX = currentMouseX - dragging.startMouseX;
  const deltaY = currentMouseY - dragging.startMouseY;

  const primaryId = dragging.objectIds[0];
  const primaryOriginal = dragging.originalPositions[primaryId];

  const baseX = dragging.startMouseX + deltaX - dragging.dragOffsetX;
  const baseY = dragging.startMouseY + deltaY - dragging.dragOffsetY;

  const positions: Record<string, { x: number; y: number }> = {};

  Object.entries(dragging.originalPositions).forEach(([id, _original]) => {
    positions[id] = {
      x: baseX - primaryOriginal.x,
      y: baseY - primaryOriginal.y,
    };
  });

  return { positions };
}

export function applyDrag(editor: Editor): Editor {
  if (!editor.dragging) return editor;

  if (editor.dragging.type === 'object') {
    const { slideId, originalPositions, currentMouseX, startMouseX, currentMouseY, startMouseY, dragOffsetX, dragOffsetY, objectIds } = editor.dragging;

    const deltaX = currentMouseX - startMouseX;
    const deltaY = currentMouseY - startMouseY;

    const primaryId = objectIds[0];
    const primaryOriginal = originalPositions[primaryId];

    const baseX = startMouseX + deltaX - dragOffsetX;
    const baseY = startMouseY + deltaY - dragOffsetY;

    const slideIndex = editor.presentation.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return { ...editor, dragging: null };

    const slide = editor.presentation.slides[slideIndex];
    const updatedObjects = slide.objects.map(obj => {
      if (objectIds.includes(obj.id)) {
        const original = originalPositions[obj.id];
        if (original) {
          const newX = original.x + (baseX - primaryOriginal.x);
          const newY = original.y + (baseY - primaryOriginal.y);
          return { ...obj, x: newX, y: newY };
        }
      }
      return obj;
    });

    const updatedSlide = { ...slide, objects: updatedObjects };
    const updatedSlides = [...editor.presentation.slides];
    updatedSlides[slideIndex] = updatedSlide;

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
