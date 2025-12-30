import type { Editor } from "../types/EditorTypes";
import type { DragPreview } from "../types/UIStateTypes";

export const startDragging = (
    editor: Editor,
    objectIds: string[],
    mouseX: number,
    mouseY: number
): Editor => {
    const currentSlide = editor.presentation.slides.find(
    s => s.id === editor.selection?.slideId
  );
  
  if (!currentSlide || objectIds.length === 0) {
    return editor;
  }

  const originalObjectPositions: Record<string, { x: number; y: number }> = {};
  
  objectIds.forEach(id => {
    const obj = currentSlide.objects.find(o => o.id === id);
    if (obj) {
      originalObjectPositions[id] = { x: obj.x, y: obj.y };
    }
  });

  return {
    ...editor,
    dragging: {
      objectIds,
      startMouseX: mouseX,
      startMouseY: mouseY,
      currentMouseX: mouseX,
      currentMouseY: mouseY,
      originalObjectPositions,
    },
    editingTextId: null,
    resizing: null,
export const calculateDragPreview = (
  editor: Editor,
  mouseX: number,
  mouseY: number
): { preview: DragPreview | null; editor: Editor } => {
  if (!editor.dragging) {
    return { preview: null, editor };
  }

  const updatedDragging = {
    ...editor.dragging,
    currentMouseX: mouseX,
    currentMouseY: mouseY,
  };

  const deltaX = mouseX - editor.dragging.startMouseX;
  const deltaY = mouseY - editor.dragging.startMouseY;

  const positions: Record<string, { x: number; y: number }> = {};
  editor.dragging.objectIds.forEach(objectId => {
    const original = editor.dragging!.originalObjectPositions[objectId];
    if (original) {
      positions[objectId] = {
        x: original.x + deltaX,
        y: original.y + deltaY,
      };
    }
  });

  const updatedEditor = {
    ...editor,
    dragging: updatedDragging,
  };

  return { preview: { positions }, editor: updatedEditor };
};

export const applyDrag = (editor: Editor): Editor => {
  if (!editor.dragging || !editor.selection?.slideId) {
    return editor;
  }

  const slideIndex = editor.presentation.slides.findIndex(
    s => s.id === editor.selection.slideId
  );
  if (slideIndex === -1) {
    return { ...editor, dragging: null };
  }

  const slide = editor.presentation.slides[slideIndex];
  const deltaX = editor.dragging.currentMouseX - editor.dragging.startMouseX;
  const deltaY = editor.dragging.currentMouseY - editor.dragging.startMouseY;

  const updatedObjects = slide.objects.map(obj => {
    if (editor.dragging!.objectIds.includes(obj.id)) {
      const original = editor.dragging!.originalObjectPositions[obj.id];
      if (original) {
        return {
          ...obj,
          x: original.x + deltaX,
          y: original.y + deltaY,
        };
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
};

export const cancelDragging = (editor: Editor): Editor => ({
  ...editor,
  dragging: null,
});

export const isDragging = (editor: Editor): boolean => !!editor.dragging;

export const getDragDelta = (
  editor: Editor,
  mouseX: number,
  mouseY: number
): { deltaX: number; deltaY: number } | null => {
  if (!editor.dragging) {
    return null;
  }
  return {
    deltaX: mouseX - editor.dragging.startMouseX,
    deltaY: mouseY - editor.dragging.startMouseY,
  };
};