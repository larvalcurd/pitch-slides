import { describe, it, expect } from 'vitest';
import { createBaseObject } from '../factory/BaseObjectFactory';
import type { BaseObject } from '../types/ObjectTypes';

describe('createBaseObject', () => {
  it('creates object with required fields and defaults', () => {
    const params = {
      x: 5,
      y: 10,
      width: 200,
      height: 150,
    };
    const obj = createBaseObject(params);
    expect(obj.x).toBe(5);
    expect(obj.y).toBe(10);
    expect(obj.width).toBe(200);
    expect(obj.height).toBe(150);
    expect(typeof obj.zIndex).toBe('number');
    expect(obj.zIndex).toBe(0);
    expect(typeof obj.id).toBe('string');
    expect(obj.id.length).toBeGreaterThan(0);
  });

  it('uses provided id when present', () => {
    const params = {
      id: 'custom-id',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    };
    const obj = createBaseObject(params);
    expect(obj.id).toBe('custom-id');
  });

  it('overrides default fields when provided', () => {
    const params = {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
      zIndex: 7,
    };
    const obj = createBaseObject(params);
    expect(obj.zIndex).toBe(7);
  });

  it('does not mutate the params object and returns a new object', () => {
    const params: Partial<BaseObject> & {
      x: number;
      y: number;
      width: number;
      height: number;
    } = {
      x: 2,
      y: 4,
      width: 8,
      height: 16,
    };
    const paramsCopy = {
      ...params,
    };
    const obj = createBaseObject(params);
    expect(params).toEqual(paramsCopy);
    expect(obj).not.toBe(params as unknown as BaseObject);
  });

  it('multiple creations without id produce string ids', () => {
    const a = createBaseObject({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    const b = createBaseObject({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    expect(typeof a.id).toBe('string');
    expect(typeof b.id).toBe('string');
    expect(a.id.length).toBeGreaterThan(0);
    expect(b.id.length).toBeGreaterThan(0);
  });
});
