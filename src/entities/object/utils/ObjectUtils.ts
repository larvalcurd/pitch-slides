import type { BaseObject } from '../types/ObjectTypes.ts';
import { applyPatchBase } from '../factory/helpers.ts';

export function moveObject<T extends BaseObject>(object: T, x: number, y: number): T {
  return applyPatchBase(object, {
    x,
    y,
  }) as T;
}

export function resizeObject<T extends BaseObject>(object: T, width: number, height: number): T {
  return applyPatchBase(object, {
    width,
    height,
  }) as T;
}

export function setObjectZIndex<T extends BaseObject>(object: T, zIndex: number): T {
  return applyPatchBase(object, {
    zIndex,
  }) as T;
}
