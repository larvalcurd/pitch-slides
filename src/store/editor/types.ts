import type { Slide } from '../../entities/slide';
import type { ImagePayload } from '../../entities/object/types/ImagePayload';

export type SlideBackgroundPayload = {
  background: Slide['background'];
};

export type ObjectSelectionPayload = {
  slideId: string;
  objectId: string;
};

export type TextUpdatePayload = {
  objectId: string;
  content: string;
};

export type PositionUpdatePayload = {
  objectId: string;
  x: number;
  y: number;
};

export type SizeUpdatePayload = {
  objectId: string;
  width: number;
  height: number;
};

export type DragStartPayload = {
  mouseX: number;
  mouseY: number;
};

export type DragUpdatePayload = {
  mouseX: number;
  mouseY: number;
  targetIndex?: number;
};

export type { ImagePayload };