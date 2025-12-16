import type { BaseObject } from '../types/ObjectTypes.ts';
import { DEFAULT_BASE } from './defaults.ts';
import { nanoid } from 'nanoid';

type CreateBaseObjectParams = Partial<BaseObject> & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createBaseObject(params: CreateBaseObjectParams): BaseObject {
  return {
    ...DEFAULT_BASE,
    ...params,
    id: params.id ?? nanoid(),
  } as BaseObject;
}
