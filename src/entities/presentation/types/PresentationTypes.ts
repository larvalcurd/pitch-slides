import type { Slide } from '../../slide';
import type { ObjectSelection } from '../../object';

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  selectedObjects?: ObjectSelection | null;
  selectedSlideId?: string | null;
};
