import { describe, it, expect } from 'vitest';
import {
  updateTextContent,
  updateTextFontSize,
  updateTextFontFamily,
  updateText,
  updateFontSize,
  updateFontFamily,
  updateTextColor,
} from '../utils/TextObjectUtils';
import { createMinimalText, createMaximalText } from '../factory/TextObjectFactory';
import type { TextObject } from '../types/ObjectTypes';
import { MAX_TEXT_LENGTH } from '../../../utils/constants';

describe('TextObjectUtils', () => {
  it('updateTextContent with minimal text: sets content, preserves other fields, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    const updated = updateTextContent(minimal, 'New content');

    expect(updated.content).toBe('New content');

    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);

    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextContent with maximal text: sets content, preserves other fields, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateTextContent(maximal, 'Overridden content');

    expect(updated.content).toBe('Overridden content');
    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextContent trims whitespace from content', () => {
    const minimal: TextObject = createMinimalText();
    const updated = updateTextContent(minimal, '  trimmed content  ');
    expect(updated.content).toBe('trimmed content');
  });

  it('updateTextContent throws error for empty content after trim', () => {
    const minimal: TextObject = createMinimalText();
    expect(() => updateTextContent(minimal, '   ')).toThrow('Text content cannot be empty');
    expect(() => updateTextContent(minimal, '')).toThrow('Text content cannot be empty');
  });

  it('updateTextContent throws error for content exceeding max length', () => {
    const minimal: TextObject = createMinimalText();
    const longContent = 'a'.repeat(MAX_TEXT_LENGTH + 1);
    expect(() => updateTextContent(minimal, longContent)).toThrow(
      `Text content exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
    );
  });

  it('updateTextFontSize with minimal text: adds fontSize, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    expect(minimal.fontSize).toBeUndefined();

    const updated = updateTextFontSize(minimal, 24);

    expect(updated.fontSize).toBe(24);
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextFontSize with maximal text: updates fontSize, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateTextFontSize(maximal, 32);

    expect(updated.fontSize).toBe(32);
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextFontFamily with minimal text: adds fontFamily, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    expect(minimal.fontFamily).toBeUndefined();

    const updated = updateTextFontFamily(minimal, 'Arial');

    expect(updated.fontFamily).toBe('Arial');
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextFontFamily with maximal text: updates fontFamily, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateTextFontFamily(maximal, 'Times New Roman');

    expect(updated.fontFamily).toBe('Times New Roman');
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateText with minimal text: sets content, preserves other fields, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    const updated = updateText(minimal, 'New content');

    expect(updated.content).toBe('New content');
    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateText with maximal text: sets content, preserves other fields, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateText(maximal, 'Overridden content');

    expect(updated.content).toBe('Overridden content');
    expect(updated.x).toBe(snapshot.x);
    expect(updated.width).toBe(snapshot.width);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateFontSize with minimal text: adds fontSize, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    expect(minimal.fontSize).toBeUndefined();

    const updated = updateFontSize(minimal, 24);

    expect(updated.fontSize).toBe(24);
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateFontSize with maximal text: updates fontSize, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateFontSize(maximal, 32);

    expect(updated.fontSize).toBe(32);
    expect(updated.content).toBe(snapshot.content);
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateFontFamily with minimal text: adds fontFamily, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    expect(minimal.fontFamily).toBeUndefined();

    const updated = updateFontFamily(minimal, 'Arial');

    expect(updated.fontFamily).toBe('Arial');
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateFontFamily with maximal text: updates fontFamily, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateFontFamily(maximal, 'Times New Roman');

    expect(updated.fontFamily).toBe('Times New Roman');
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextColor with minimal text: adds color, original unchanged', () => {
    const minimal: TextObject = createMinimalText();
    const snapshot: TextObject = {
      ...minimal,
    };

    expect(minimal.color).toBeUndefined();

    const updated = updateTextColor(minimal, '#FF0000');

    expect(updated.color).toBe('#FF0000');
    expect(updated).not.toBe(minimal);
    expect(minimal).toEqual(snapshot);
  });

  it('updateTextColor with maximal text: updates color, original unchanged', () => {
    const maximal: TextObject = createMaximalText();
    const snapshot: TextObject = {
      ...maximal,
    };

    const updated = updateTextColor(maximal, '#00FF00');

    expect(updated.color).toBe('#00FF00');
    expect(updated).not.toBe(maximal);
    expect(maximal).toEqual(snapshot);
  });

  it('updateTextContent throws error for content exceeding 500 characters', () => {
    const minimal: TextObject = createMinimalText();
    const longContent = 'a'.repeat(501);
    expect(() => updateTextContent(minimal, longContent)).toThrow(
      'Text content exceeds maximum length of 500 characters',
    );
  });

  it('updateTextContent accepts valid content', () => {
    const minimal: TextObject = createMinimalText();
    const updated = updateTextContent(minimal, 'Valid content');
    expect(updated.content).toBe('Valid content');
  });
});
