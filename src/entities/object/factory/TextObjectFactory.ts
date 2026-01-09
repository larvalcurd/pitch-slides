import type { BaseObject, TextObject } from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatchText } from './helpers.ts';

type CreateTextObjectParams = Partial<BaseObject> & {
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
};

export function createTextObject(params: CreateTextObjectParams): TextObject {
  const base = createBaseObject(params);
  const txt: TextObject = {
    ...base,
    type: 'text',
    content: params.content,
  };
  return applyPatchText(txt, params as Partial<TextObject>);
}

export function createMinimalText(overrides?: Partial<TextObject>) {
  return applyPatchText(
    createTextObject({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      content: '',
    }),
    overrides,
  );
}

export function createMaximalText(overrides?: Partial<TextObject>) {
  const t = createTextObject({
    x: 10,
    y: 10,
    width: 300,
    height: 100,
    content: 'Full Text',
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
  });
  return overrides ? applyPatchText(t, overrides) : t;
}
