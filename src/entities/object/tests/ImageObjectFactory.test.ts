// typescript
import { describe, it, expect, vi } from 'vitest';

// Mock nanoid before importing factories so ids are deterministic
vi.mock('nanoid', () => ({ nanoid: () => 'fixed-nanoid' }));

import {
    createImageObject,
    createMinimalImage,
    createMaximalImage,
} from '../factory/ImageObjectFactory.ts';
import { DEFAULT_BASE } from '../factory/defaults.ts';
import type { BaseObject } from '../types/ObjectTypes.ts';

describe('ImageObjectFactory', () => {
    const baseArgs = { x: 5, y: 6, width: 120, height: 80, src: 'img.png' };

    it('generates id when none provided and applies basic defaults', () => {
        const img = createImageObject(baseArgs);
        expect(img.id).toBe('fixed-nanoid');
        expect(img.type).toBe('image');
        expect(img.src).toBe('img.png');
        expect(img.x).toBe(5);
        expect(img.y).toBe(6);
        expect(img.width).toBe(120);
        expect(img.height).toBe(80);
        expect(img.zIndex).toBe(DEFAULT_BASE.zIndex);
    });

    it('preserves provided id', () => {
        const img = createImageObject({ ...baseArgs, id: 'custom-id' });
        expect(img.id).toBe('custom-id');
    });

    it('respects overrides for base fields (e.g., zIndex)', () => {
        const img = createImageObject({ ...baseArgs, zIndex: 42 });
        expect(img.zIndex).toBe(42);
    });

    it('createMinimalImage applies minimal defaults and merges overrides', () => {
        const created = createMinimalImage({ src: 'min.png', zIndex: 9 });
        expect(created.src).toBe('min.png');
        expect(created.x).toBe(0);
        expect(created.y).toBe(0);
        expect(created.width).toBe(100);
        expect(created.height).toBe(100);
        expect(created.zIndex).toBe(9);
    });

    it('createMaximalImage returns maximal instance and accepts overrides', () => {
        const maximal = createMaximalImage({ src: 'over.png', zIndex: 7 });
        expect(maximal.src).toBe('over.png');
        expect(maximal.zIndex).toBe(7);
        // maximal defaults from factory implementation (position/size chosen there)
        expect(maximal.x).toBeDefined();
        expect(maximal.width).toBeDefined();
    });

    it('does not mutate input params and returns a new object', () => {
        const params: Partial<BaseObject> & { x: number; y: number; width: number; height: number } = {
            x: 2,
            y: 4,
            width: 8,
            height: 16,
        };
        const copy = { ...params };
        const obj = createImageObject({ ...params, src: 'a.png' });
        expect(params).toEqual(copy);
        expect(obj).not.toBe(params as unknown as BaseObject);
    });

    it('multiple creations without id produce non-empty string ids', () => {
        const a = createImageObject({ x: 0, y: 0, width: 1, height: 1, src: '' });
        const b = createImageObject({ x: 0, y: 0, width: 1, height: 1, src: '' });
        expect(typeof a.id).toBe('string');
        expect(typeof b.id).toBe('string');
        expect(a.id.length).toBeGreaterThan(0);
        expect(b.id.length).toBeGreaterThan(0);
    });
});
