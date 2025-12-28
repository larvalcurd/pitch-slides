import type { TextObject } from '../types/ObjectTypes.ts';
import { applyPatchText } from '../factory/helpers.ts';

export function updateTextContent(obj: TextObject, content: string): TextObject {
  return applyPatchText(obj, {
    content,
  });
}

export function updateTextFontSize(obj: TextObject, fontSize: number): TextObject {
  return applyPatchText(obj, {
    fontSize,
  });
}

export function updateTextFontFamily(obj: TextObject, fontFamily: string): TextObject {
  return applyPatchText(obj, {
    fontFamily,
  });
}

export function updateText(object: TextObject, content: string): TextObject {
  return applyPatchText(object, {
    content,
  });
}

export function updateFontSize(object: TextObject, fontSize: number): TextObject {
  return applyPatchText(object, {
    fontSize,
  });
}

export function updateFontFamily(object: TextObject, fontFamily: string): TextObject {
  return applyPatchText(object, {
    fontFamily,
  });
}

export function updateTextColor(object: TextObject, color: string): TextObject {
  return applyPatchText(object, {
    color,
  });
}
