import type { SlideObject } from '../../object';

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
