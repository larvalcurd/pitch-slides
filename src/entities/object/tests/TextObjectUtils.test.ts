import { describe, it, expect } from 'vitest';
import {
  updateTextContent,
  updateTextFontSize,
  updateTextFontFamily,
} from '../utils/TextObjectUtils';
import { createMinimalText, createMaximalText } from '../factory/TextObjectFactory';
import type { TextObject } from '../types/ObjectTypes';

describe('TextObjectUtils', () => {
  it('updateTextContent with minimal text: sets content, preserves other fields, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = { ...minimal };

    const updated = updateTextContent(minimal, 'New content');

    expect(updated.content).toBe('New content');
    // other fields preserved
    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);
    // immutability
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextContent with maximal text: sets content, preserves other fields, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = { ...maximal };

    const updated = updateTextContent(maximal, 'Overridden content');

    expect(updated.content).toBe('Overridden content');
    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextFontSize with minimal text: adds fontSize, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = { ...minimal };

    // minimal should not have fontSize set
    expect(minimal.fontSize).toBeUndefined();

    const updated = updateTextFontSize(minimal, 24);

    expect(updated.fontSize).toBe(24);
    // other fields preserved
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextFontSize with maximal text: updates fontSize, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = { ...maximal };

    const updated = updateTextFontSize(maximal, 32);

    expect(updated.fontSize).toBe(32);
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextFontFamily with minimal text: adds fontFamily, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = { ...minimal };

    expect(minimal.fontFamily).toBeUndefined();

    const updated = updateTextFontFamily(minimal, 'Arial');

    expect(updated.fontFamily).toBe('Arial');
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextFontFamily with maximal text: updates fontFamily, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = { ...maximal };

    const updated = updateTextFontFamily(maximal, 'Times New Roman');

    expect(updated.fontFamily).toBe('Times New Roman');
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });
});
