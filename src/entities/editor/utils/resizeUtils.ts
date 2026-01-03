import type { ResizeHandle } from '../../object';
import { isObjectSelection, type Editor } from '../types/EditorTypes';
import type { ResizePreview, ResizeState } from '../types/UIStateTypes';
import { DEFAULT_MIN_WIDTH, DEFAULT_MIN_HEIGHT } from '../../../utils/constants';

export const startResizing = (
  editor: Editor,
  objectId: string,
  handle: ResizeHandle,
  mouseX: number,
  mouseY: number,
): Editor => {
  if (!isObjectSelection(editor.selection)) {
    return editor;
  }

  const { slideId, objectIds } = editor.selection;

  if (!objectIds.includes(objectId)) {
    return editor;
  }

  const currentSlide = editor.presentation.slides.find(slide => slide.id === slideId);

  if (!currentSlide) {
    return editor;
  }

  const obj = currentSlide.objects.find(o => o.id === objectId);
  if (!obj) {
    return editor;
  }

  return {
    ...editor,
    resizing: {
      objectId,
      handle,
      startMouseX: mouseX,
      startMouseY: mouseY,
      original: {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
      },
    },
    dragging: null,
    editingTextObjectId: null,
  };
};

export const getResizeDelta = (
  resizeing: ResizeState,
  currentMouseX: number,
  currentMouseY: number,
): { x: number; y: number } => ({
  x: currentMouseX - resizeing.startMouseX,
  y: currentMouseY - resizeing.startMouseY,
});

export const calculateResizePreview = (
  resizing: ResizeState,
  currentMouseX: number,
  currentMouseY: number,
  minWidth: number = DEFAULT_MIN_WIDTH,
  minHeight: number = DEFAULT_MIN_HEIGHT,
): ResizePreview => {
  const delta = getResizeDelta(resizing, currentMouseX, currentMouseY);
  const { x, y, width, height } = resizing.original;

  let newX = x;
  let newY = y;
  let newWidth = width;
  let newHeight = height;

  switch (resizing.handle) {
    case 'top-left':
      newX = x + delta.x;
      newY = y + delta.y;
      newWidth = width - delta.x;
      newHeight = height - delta.y;
      break;

    case 'top':
      newY = y + delta.y;
      newHeight = height - delta.y;
      break;

    case 'top-right':
      newY = y + delta.y;
      newWidth = width + delta.x;
      newHeight = height - delta.y;
      break;

    case 'right':
      newWidth = width + delta.x;
      break;

    case 'bottom-right':
      newWidth = width + delta.x;
      newHeight = height + delta.y;
      break;

    case 'bottom':
      newHeight = height + delta.y;
      break;

    case 'bottom-left':
      newX = x + delta.x;
      newWidth = width - delta.x;
      newHeight = height + delta.y;
      break;

    case 'left':
      newX = x + delta.x;
      newWidth = width - delta.x;
      break;
  }

  // Применяем ограничение минимальной ширины
  if (newWidth < minWidth) {
    const diff = minWidth - newWidth;
    newWidth = minWidth;

    // Корректируем X для левых handle
    if (
      resizing.handle === 'top-left' ||
      resizing.handle === 'left' ||
      resizing.handle === 'bottom-left'
    ) {
      newX -= diff;
    }
  }

  if (newHeight < minHeight) {
    const diff = minHeight - newHeight;
    newHeight = minHeight;

    if (
      resizing.handle === 'top-left' ||
      resizing.handle === 'top' ||
      resizing.handle === 'top-right'
    ) {
      newY -= diff;
    }
  }

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
  };
};

export const applyResize = (editor: Editor, finalBounds: ResizePreview): Editor => {
  if (!editor.resizing) {
    return editor;
  }

  if (!isObjectSelection(editor.selection)) {
    return {
      ...editor,
      resizing: null,
    };
  }

  const { slideId } = editor.selection;
  const { objectId } = editor.resizing;

  const updatedSlides = editor.presentation.slides.map(slide => {
    if (slide.id !== slideId) {
      return slide;
    }

    const updatedObjects = slide.objects.map(obj => {
      if (obj.id !== objectId) return obj;

      return {
        ...obj,
        x: finalBounds.x,
        y: finalBounds.y,
        width: finalBounds.width,
        height: finalBounds.height,
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
    resizing: null,
  };
};

export const cancelResizing = (editor: Editor): Editor => ({
  ...editor,
  resizing: null,
});

export const isResizingActive = (editor: Editor): boolean => {
  return editor.resizing !== null;
};

export const getResizingObjectId = (editor: Editor): string | null => {
  return editor.resizing?.objectId ?? null;
};

export const isObjectBeingResized = (editor: Editor, objectId: string): boolean => {
  return editor.resizing?.objectId === objectId;
};

export const getResizingHandle = (editor: Editor): ResizeHandle | null => {
  return editor.resizing?.handle ?? null;
};

export const getCursorForHandle = (handle: ResizeHandle): string => {
  switch (handle) {
    case 'top-left':
    case 'bottom-right':
      return 'nwse-resize';

    case 'top-right':
    case 'bottom-left':
      return 'nesw-resize';

    case 'top':
    case 'bottom':
      return 'ns-resize';

    case 'left':
    case 'right':
      return 'ew-resize';

    default:
      return 'default';
  }
};
