import type { Slide } from '../../slide/types/SlideTypes.ts';
import type { ObjectSelection } from '../../object/types/ObjectTypes.ts';

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  selectedObjects?: ObjectSelection | null;
  selectedSlideId?: string | null;
};
