import { nanoid } from 'nanoid';
import type { ImageObject } from '../types/ObjectTypes';
import type { ImagePayload } from '../types/ImagePayload';

const DEFAULT_IMAGE_POSITION = { x: 100, y: 100 };
const DEFAULT_Z_INDEX = 1;
const MAX_WIDTH = 300;

export function createImageObject(payload: ImagePayload): ImageObject {
  const scale = Math.min(1, MAX_WIDTH / payload.naturalWidth);

  return {
    id: nanoid(),
    type: 'image',
    x: DEFAULT_IMAGE_POSITION.x,
    y: DEFAULT_IMAGE_POSITION.y,
    width: payload.naturalWidth * scale,
    height: payload.naturalHeight * scale,
    zIndex: DEFAULT_Z_INDEX,
    src: payload.src,
  };
}

// import type { BaseObject, ImageObject } from '../types/ObjectTypes.ts';
// import { createBaseObject } from './BaseObjectFactory.ts';
// import { applyPatchImage } from './helpers.ts';

// type CreateImageObjectParams = Partial<BaseObject> & {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   src: string;
// };

// export function createImageObject(params: CreateImageObjectParams): ImageObject {
//   const base = createBaseObject(params);
//   const img: ImageObject = {
//     ...base,
//     type: 'image',
//     src: params.src,
//   };

//   return applyPatchImage(img, params as Partial<ImageObject>);
// }

// export function createMinimalImage(overrides?: Partial<ImageObject>) {
//   return applyPatchImage(
//     createImageObject({
//       x: 0,
//       y: 0,
//       width: 100,
//       height: 100,
//       src: '',
//     }),
//     overrides,
//   );
// }

// export function createMaximalImage(overrides?: Partial<ImageObject>) {
//   const img = createImageObject({
//     x: 50,
//     y: 50,
//     width: 400,
//     height: 300,
//     src: 'big-image.png',
//   });
//   return overrides ? applyPatchImage(img, overrides) : img;
// }
