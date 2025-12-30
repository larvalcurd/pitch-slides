import type { Slide } from '../../slide';

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
};
