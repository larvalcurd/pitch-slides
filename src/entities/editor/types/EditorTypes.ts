import type { Presentation } from '../../presentation';
import type { ObjectSelection } from '../../object';

export type Editor = {
  presentation: Presentation;
  selection: ObjectSelection | null;
  selectedSlideId?: string | null;
};
