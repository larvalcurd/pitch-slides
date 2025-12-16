import type { BaseObject, ImageObject } from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatchImage } from './helpers.ts';

type CreateImageObjectParams = Partial<BaseObject> & {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
};

export function createImageObject(params: CreateImageObjectParams): ImageObject {
  const base = createBaseObject(params);
  const img: ImageObject = {
    ...base,
    type: 'image',
    src: params.src,
  };

  return applyPatchImage(img, params as Partial<ImageObject>);
}

export function createMinimalImage(overrides?: Partial<ImageObject>) {
  return applyPatchImage(
    createImageObject({ x: 0, y: 0, width: 100, height: 100, src: '' }),
    overrides,
  );
}

export function createMaximalImage(overrides?: Partial<ImageObject>) {
  const img = createImageObject({
    x: 50,
    y: 50,
    width: 400,
    height: 300,
    src: 'big-image.png',
  });
  return overrides ? applyPatchImage(img, overrides) : img;
}
