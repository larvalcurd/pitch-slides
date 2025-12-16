import type { SlideObject } from '../../object/types/ObjectTypes.ts';

export type Slide = {
  id: string;
  title?: string;
  background?: SlideBackground;
  objects: SlideObject[];
};

export type SlideBackground = ColorBackground | ImageBackground;

export type ColorBackground = {
  type: 'color';
  value: string;
};

export type ImageBackground = {
  type: 'image';
  value: string;
};
