import type { Presentation } from '../../presentation';
import type { DragState, ResizeState } from './UIStateTypes';

export type ObjectSelection = {
  slideId: string;
  objectIds: string[];
};

export type Editor = {
  presentation: Presentation;
  selection: ObjectSelection | null;

  dragging: DragState | null;
  resizing: ResizeState | null;
  editingTextObjectId: string | null;
};

export type SerializableEditor = {
  presentation: Presentation;
  selection: ObjectSelection | null;
};
