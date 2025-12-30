import type { TextObject } from '../types/ObjectTypes.ts';
import { applyPatchText } from '../factory/helpers.ts';
import { MAX_TEXT_LENGTH } from '../../../utils/constants.ts';

export function updateTextContent(obj: TextObject, content: string): TextObject {
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    throw new Error('Text content cannot be empty');
  }
  if (trimmedContent.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text content exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
  }
  return applyPatchText(obj, {
    content: trimmedContent,
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