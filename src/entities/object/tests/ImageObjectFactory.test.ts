import { describe, it, expect, vi } from 'vitest';

vi.mock('nanoid', () => ({
  nanoid: () => 'fixed-nanoid',
}));

import {
  createImageObject,
  DEFAULT_IMAGE_POSITION,
  DEFAULT_Z_INDEX,
  MAX_WIDTH,
} from '../factory/ImageObjectFactory.ts';
import type { ImagePayload } from '../types/ImagePayload.ts';

describe('ImageObjectFactory', () => {
  it('generates id', () => {
    const payload: ImagePayload = {
      src: 'img.png',
      naturalWidth: 100,
      naturalHeight: 100,
    };
    const img = createImageObject(payload);
    expect(img.id).toBe('fixed-nanoid');
  });

  it('sets type to image', () => {
    const payload: ImagePayload = {
      src: 'img.png',
      naturalWidth: 100,
      naturalHeight: 100,
    };
    const img = createImageObject(payload);
    expect(img.type).toBe('image');
  });

  it('sets src from payload', () => {
    const payload: ImagePayload = {
      src: 'test.png',
      naturalWidth: 100,
      naturalHeight: 100,
    };
    const img = createImageObject(payload);
    expect(img.src).toBe('test.png');
  });

  it('sets x, y, zIndex to default values', () => {
    const payload: ImagePayload = {
      src: 'img.png',
      naturalWidth: 100,
      naturalHeight: 100,
    };
    const img = createImageObject(payload);
    expect(img.x).toBe(DEFAULT_IMAGE_POSITION.x);
    expect(img.y).toBe(DEFAULT_IMAGE_POSITION.y);
    expect(img.zIndex).toBe(DEFAULT_Z_INDEX);
  });

  it('does not scale width and height when naturalWidth <= MAX_WIDTH', () => {
    const payload: ImagePayload = {
      src: 'img.png',
      naturalWidth: MAX_WIDTH,
      naturalHeight: 300,
    };
    const img = createImageObject(payload);
    expect(img.width).toBe(MAX_WIDTH);
    expect(img.height).toBe(300);
  });

  it('scales width and height when naturalWidth > MAX_WIDTH', () => {
    const payload: ImagePayload = {
      src: 'img.png',
      naturalWidth: 1000,
      naturalHeight: 500,
    };
    const img = createImageObject(payload);
    const expectedScale = MAX_WIDTH / 1000;
    expect(img.width).toBe(1000 * expectedScale);
    expect(img.height).toBe(500 * expectedScale);
  });

  it('does not mutate input payload', () => {
    const payload: ImagePayload = {
      src: 'a.png',
      naturalWidth: 200,
      naturalHeight: 150,
    };
    const copy = { ...payload };
    createImageObject(payload);
    expect(payload).toEqual(copy);
  });

  it('generates non-empty string id', () => {
    const payload: ImagePayload = {
      src: '',
      naturalWidth: 1,
      naturalHeight: 1,
    };
    const img = createImageObject(payload);
    expect(typeof img.id).toBe('string');
    expect(img.id.length).toBeGreaterThan(0);
  });
});
