import type { TextObject } from '../types/ObjectTypes.ts';
import { applyPatchText } from '../factory/helpers.ts';

export function updateTextContent(obj: TextObject, content: string): TextObject {
  return applyPatchText(obj, { content });
}

export function updateTextFontSize(obj: TextObject, fontSize: number): TextObject {
  return applyPatchText(obj, { fontSize });
}

export function updateTextFontFamily(obj: TextObject, fontFamily: string): TextObject {
  return applyPatchText(obj, { fontFamily });
}
