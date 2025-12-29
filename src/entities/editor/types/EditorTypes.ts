import type { Presentation } from '../../presentation';

export type ObjectSelection = {
  slideId: string;
  objectIds: string[];
};

export type Editor = {
  presentation: Presentation;
  selection: ObjectSelection | null;
  selectedSlideId?: string | null;
  editingTextObjectId?: string | null;
};
