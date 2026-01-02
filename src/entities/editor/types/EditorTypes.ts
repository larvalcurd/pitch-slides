import type { Presentation } from '../../presentation';
import type { DragState, ResizeState } from './UIStateTypes';

export type EditorSelection =
  | { type: 'slides'; slideIds: string[] }
  | { type: 'objects'; slideId: string; objectIds: string[] };

type SlideSelection = Extract<EditorSelection, { type: 'slides' }>;
type ObjectSelection = Extract<EditorSelection, { type: 'objects' }>;

export type Editor = {
  presentation: Presentation;
  selection: EditorSelection | null;

  dragging: DragState | null;
  resizing: ResizeState | null;
  editingTextObjectId: string | null;
};

export type SerializableEditor = {
  presentation: Presentation;
  selection: EditorSelection | null;
};

export const isSlideSelection = (selection: EditorSelection | null): selection is SlideSelection =>
  selection?.type === 'slides';

export const isObjectSelection = (
  selection: EditorSelection | null,
): selection is ObjectSelection => selection?.type === 'objects';
