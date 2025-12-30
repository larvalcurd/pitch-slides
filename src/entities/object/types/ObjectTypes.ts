export type ResizeHandle =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export type BaseObject = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

export type TextObject = BaseObject & {
  type: 'text';
  content: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
};

export type ImageObject = BaseObject & {
  type: 'image';
  src: string;
};

export type SlideObject = TextObject | ImageObject;
