import type { ResizeHandle } from '../../object';

export type DragState =
  | {
      type: 'object';
      slideId: string;
      objectIds: string[];
      startMouseX: number;
      startMouseY: number;
      currentMouseX: number;
      currentMouseY: number;
      originalPositions: Record<string, { x: number; y: number }>;
    }
  | {
      type: 'slides';
      slideIds: string[];
      startMouseY: number;
      currentMouseY: number;
      targetIndex: number | null;
    };

export type ResizeState = {
  objectId: string;
  handle: ResizeHandle;
  startMouseX: number;
  startMouseY: number;
  original: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type DragPreview = {
  positions: { [objectId: string]: { x: number; y: number } };
};

export type ResizePreview = {
  x: number;
  y: number;
  width: number;
  height: number;
};
