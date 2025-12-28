import { describe, it, expect } from 'vitest';
import { moveObject, resizeObject, setObjectZIndex } from '../utils/ObjectUtils';
import { createMinimalImage, createMaximalImage } from '../factory/ImageObjectFactory';
import { createMinimalText, createMaximalText } from '../factory/TextObjectFactory';
import type { ImageObject, TextObject } from '../types/ObjectTypes';
import {
  updateFontFamily,
  updateFontSize,
  updateText,
  updateTextColor,
} from '../utils/TextObjectUtils';

describe('ObjectUtils - ImageObject', () => {
  it('moveObject with minimal image: updates position, returns new object, original unchanged', () => {
    const minimal: ImageObject = createMinimalImage();
    const snapshot: ImageObject = {
      ...minimal,
    };

    const moved = moveObject(minimal, 10, 20);

    expect(moved.x).toBe(10);
    expect(moved.y).toBe(20);

    // other fields preserved
    expect(moved.width).toBe(snapshot.width);
    expect(moved.height).toBe(snapshot.height);
    expect(moved.src).toBe(snapshot.src);

    // immutability
    expect(moved).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('moveObject with maximal image: updates position, returns new object, original unchanged', () => {
    const maximal: ImageObject = createMaximalImage();
    const snapshot: ImageObject = {
      ...maximal,
    };

    const moved = moveObject(maximal, 999, 888);

    expect(moved.x).toBe(999);
    expect(moved.y).toBe(888);

    // original unchanged
    expect(maximal.x).toBe(snapshot.x);
    expect(maximal.y).toBe(snapshot.y);

    // extras preserved on returned object
    expect(moved.src).toBe(snapshot.src);
    expect(moved.width).toBe(snapshot.width);
    expect(moved.height).toBe(snapshot.height);

    expect(moved).not.toBe(maximal);
  });

  it('resizeObject with minimal image: updates size, returns new object, original unchanged', () => {
    const minimal: ImageObject = createMinimalImage();
    const snapshot: ImageObject = {
      ...minimal,
    };

    const resized = resizeObject(minimal, 55, 66);

    expect(resized.width).toBe(55);
    expect(resized.height).toBe(66);

    // other fields preserved
    expect(resized.x).toBe(snapshot.x);
    expect(resized.y).toBe(snapshot.y);
    expect(resized.src).toBe(snapshot.src);

    expect(resized).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('resizeObject with maximal image: updates size, returns new object, original unchanged', () => {
    const maximal: ImageObject = createMaximalImage();
    const snapshot: ImageObject = {
      ...maximal,
    };

    const resized = resizeObject(maximal, 301, 302);

    expect(resized.width).toBe(301);
    expect(resized.height).toBe(302);

    // original unchanged
    expect(maximal.width).toBe(snapshot.width);
    expect(maximal.height).toBe(snapshot.height);

    // other fields preserved
    expect(resized.src).toBe(snapshot.src);
    expect(resized.x).toBe(snapshot.x);

    expect(resized).not.toBe(maximal);
  });

  it('setObjectZIndex with minimal image: updates zIndex, returns new object, original unchanged', () => {
    const minimal: ImageObject = createMinimalImage();
    const snapshot: ImageObject = {
      ...minimal,
    };

    const updated = setObjectZIndex(minimal, 42);

    expect(updated.zIndex).toBe(42);

    // other fields preserved
    expect(updated.x).toBe(snapshot.x);
    expect(updated.y).toBe(snapshot.y);
    expect(updated.width).toBe(snapshot.width);

    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('setObjectZIndex with maximal image: updates zIndex, returns new object, original unchanged', () => {
    const maximal: ImageObject = createMaximalImage();
    const snapshot: ImageObject = {
      ...maximal,
    };

    const updated = setObjectZIndex(maximal, -7);

    expect(updated.zIndex).toBe(-7);

    // original unchanged
    expect(maximal.zIndex).toBe(snapshot.zIndex);

    // other fields preserved
    expect(updated.src).toBe(snapshot.src);
    expect(updated.width).toBe(snapshot.width);

    expect(updated).not.toBe(maximal);
  });
});

describe('ObjectUtils - TextObject', () => {
  it('moveObject with minimal text: updates position, returns new object, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    const moved = moveObject(minimal, 15, 25);

    expect(moved.x).toBe(15);
    expect(moved.y).toBe(25);

    // other fields preserved
    expect(moved.content).toBe(snapshot.content);
    expect(moved.width).toBe(snapshot.width);

    expect(moved).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('moveObject with maximal text: updates position, returns new object, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const moved = moveObject(maximal, 777, 666);

    expect(moved.x).toBe(777);
    expect(moved.y).toBe(666);

    // original unchanged
    expect(maximal.x).toBe(snapshot.x);
    expect(maximal.y).toBe(snapshot.y);

    // other fields preserved
    expect(moved.content).toBe(snapshot.content);
    expect(moved.width).toBe(snapshot.width);

    expect(moved).not.toBe(maximal);
  });

  it('resizeObject with minimal text: updates size, returns new object, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    const resized = resizeObject(minimal, 120, 80);

    expect(resized.width).toBe(120);
    expect(resized.height).toBe(80);

    // other fields preserved
    expect(resized.content).toBe(snapshot.content);
    expect(resized.x).toBe(snapshot.x);

    expect(resized).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('resizeObject with maximal text: updates size, returns new object, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const resized = resizeObject(maximal, 400, 200);

    expect(resized.width).toBe(400);
    expect(resized.height).toBe(200);

    // original unchanged
    expect(maximal.width).toBe(snapshot.width);
    expect(maximal.height).toBe(snapshot.height);

    // other fields preserved
    expect(resized.content).toBe(snapshot.content);

    expect(resized).not.toBe(maximal);
  });

  it('setObjectZIndex with minimal text: updates zIndex, returns new object, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    const updated = setObjectZIndex(minimal, 11);

    expect(updated.zIndex).toBe(11);

    // other fields preserved
    expect(updated.content).toBe(snapshot.content);
    expect(updated.width).toBe(snapshot.width);

    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('setObjectZIndex with maximal text: updates zIndex, returns new object, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = setObjectZIndex(maximal, -11);

    expect(updated.zIndex).toBe(-11);

    // original unchanged
    expect(maximal.zIndex).toBe(snapshot.zIndex);

    // other fields preserved
    expect(updated.content).toBe(snapshot.content);

    expect(updated).not.toBe(maximal);
  });

  it('updateText: updates content, returns new object, original unchanged', () => {
    const text: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...text,
    };

    const updated = updateText(text, 'New content');

    expect(updated.content).toBe('New content');

    // other fields preserved
    expect(updated.x).toBe(snapshot.x);
    expect(updated.y).toBe(snapshot.y);
    expect(updated.width).toBe(snapshot.width);

    expect(updated).not.toBe(text);
    expect(text).toEqual(snapshot);
  });

  it('updateFontSize: updates fontSize, returns new object, original unchanged', () => {
    const text: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...text,
    };

    const updated = updateFontSize(text, 24);

    expect(updated.fontSize).toBe(24);

    // other fields preserved
    expect(updated.content).toBe(snapshot.content);
    expect(updated.x).toBe(snapshot.x);

    expect(updated).not.toBe(text);
    expect(text).toEqual(snapshot);
  });

  it('updateFontFamily: updates fontFamily, returns new object, original unchanged', () => {
    const text: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...text,
    };

    const updated = updateFontFamily(text, 'Arial');

    expect(updated.fontFamily).toBe('Arial');

    // other fields preserved
    expect(updated.content).toBe(snapshot.content);
    expect(updated.x).toBe(snapshot.x);

    expect(updated).not.toBe(text);
    expect(text).toEqual(snapshot);
  });

  it('updateTextColor: updates color, returns new object, original unchanged', () => {
    const text: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...text,
    };

    const updated = updateTextColor(text, '#ff0000');

    expect(updated.color).toBe('#ff0000');

    // other fields preserved
    expect(updated.content).toBe(snapshot.content);
    expect(updated.x).toBe(snapshot.x);

    expect(updated).not.toBe(text);
    expect(text).toEqual(snapshot);
  });
});
