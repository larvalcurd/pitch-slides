import type { BaseObject, ImageObject, TextObject } from '../types/ObjectTypes.ts';

export function shallowMergePatch<T extends object>(original: T, patch?: Partial<T>): T {
  if (!patch)
    return {
      ...original,
    };
  return {
    ...original,
    ...patch,
  };
}

export function applyPatchBase(original: BaseObject, patch?: Partial<BaseObject>): BaseObject {
  return shallowMergePatch(original, patch);
}

export function applyPatchImage(original: ImageObject, patch?: Partial<ImageObject>): ImageObject {
  return shallowMergePatch(original, patch) as ImageObject;
}

export function applyPatchText(original: TextObject, patch?: Partial<TextObject>): TextObject {
  return shallowMergePatch(original, patch) as TextObject;
}
