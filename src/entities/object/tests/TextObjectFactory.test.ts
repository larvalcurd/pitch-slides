import { describe, it, expect, vi } from 'vitest';

vi.mock('nanoid', () => ({ nanoid: () => 'fixed-nanoid' }));

import {
  createTextObject,
  createMinimalText,
  createMaximalText,
} from '../factory/TextObjectFactory.ts';
import { DEFAULT_BASE } from '../factory/defaults.ts';
import type { BaseObject, TextObject } from '../types/ObjectTypes.ts';

describe('TextObjectFactory', () => {
  const baseArgs = { x: 5, y: 6, width: 120, height: 80, content: 'Hello' };

  it('generates id when none provided and applies base defaults', () => {
    const txt = createTextObject(baseArgs);
    expect(txt.id).toBe('fixed-nanoid');
    expect(txt.type).toBe('text');
    expect(txt.content).toBe('Hello');
    expect(txt.x).toBe(5);
    expect(txt.y).toBe(6);
    expect(txt.width).toBe(120);
    expect(txt.height).toBe(80);
    expect(txt.zIndex).toBe(DEFAULT_BASE.zIndex);
  });

  it('preserves provided id', () => {
    const txt = createTextObject({ ...baseArgs, id: 'custom-id' });
    expect(txt.id).toBe('custom-id');
  });

  it('accepts text-specific overrides (fontFamily, fontSize, color) via params', () => {
    const txt = createTextObject({
      ...baseArgs,
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#ff0000',
    } as Partial<BaseObject> & {
      x: number;
      y: number;
      width: number;
      height: number;
      content: string;
    });
    expect(txt.fontFamily).toBe('Arial');
    expect(txt.fontSize).toBe(14);
    expect(txt.color).toBe('#ff0000');
  });

  it('createMinimalText applies minimal defaults and merges overrides', () => {
    const created = createMinimalText({ fontFamily: 'Times', zIndex: 9 });
    expect(created.content).toBe('');
    expect(created.x).toBe(0);
    expect(created.y).toBe(0);
    expect(created.width).toBe(100);
    expect(created.height).toBe(50);
    expect(created.zIndex).toBe(9);
    expect(created.fontFamily).toBe('Times');
  });

  it('createMaximalText returns maximal instance and accepts overrides', () => {
    const maximal = createMaximalText({ content: 'Over', zIndex: 7 });
    expect(maximal.content).toBe('Over');
    expect(maximal.zIndex).toBe(7);
    expect(maximal.x).toBe(10);
    expect(maximal.width).toBe(300);
    expect(maximal.height).toBe(100);
  });

  it('does not mutate input params and returns a new object', () => {
    const params: Partial<BaseObject> & {
      x: number;
      y: number;
      width: number;
      height: number;
      content?: string;
    } = {
      x: 2,
      y: 4,
      width: 8,
      height: 16,
    };
    const copy = { ...params };
    const obj = createTextObject({ ...params, content: 'a' } as TextObject);
    expect(params).toEqual(copy);
    expect(obj).not.toBe(params as unknown as BaseObject);
  });

  it('multiple creations without id produce non-empty string ids', () => {
    const a = createTextObject({ x: 0, y: 0, width: 1, height: 1, content: '' });
    const b = createTextObject({ x: 0, y: 0, width: 1, height: 1, content: '' });
    expect(typeof a.id).toBe('string');
    expect(typeof b.id).toBe('string');
    expect(a.id.length).toBeGreaterThan(0);
    expect(b.id.length).toBeGreaterThan(0);
  });
});
