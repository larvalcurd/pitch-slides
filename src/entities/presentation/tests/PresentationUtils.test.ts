import { describe, it, expect } from 'vitest';
import {
  createPresentation,
  updatePresentationTitle,
  moveSlide,
  updateSlideInPresentation,
  addSlideToPresentation,
  deleteSlideFromPresentation,
} from '../utils/PresentationUtils';
import { createMinimalImage, createMaximalImage } from '../../object';
import { createMinimalText, createMaximalText } from '../../object';
import type { Presentation } from '../types/PresentationTypes';
import type { Slide } from '../../slide';

function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

function createMinimalSlide(id = 'slide-min'): Slide {
  return {
    id,
    objects: [],
  };
}

function createMaximalSlide(id = 'slide-max'): Slide {
  const img1 = createMinimalImage();
  const img2 = createMaximalImage();
  const txt1 = createMinimalText();
  const txt2 = createMaximalText();

  return {
    id,
    title: 'Slide ' + id,
    background: {
      type: 'image',
      value: `bg-${id}.png`,
    },
    objects: [img1, img2, txt1, txt2],
  };
}

function createMinimalPresentation(): Presentation {
  return {
    id: 'pres-min',
    title: 'Minimal',
    slides: [],
  };
}

function createMaximalPresentation(): Presentation {
  const s1 = createMaximalSlide('s1');
  const s2 = createMaximalSlide('s2');

  return {
    id: 'pres-max',
    title: 'Full Presentation',
    slides: [s1, s2],
  };
}

describe('PresentationUtils (deep immutability + behavior)', () => {
  it('createPresentation - minimal (no slides)', () => {
    const p = createPresentation('p1', 'T'); // using exported factory
    expect(p.id).toBe('p1');
    expect(p.title).toBe('T');
    expect(p.slides).toEqual([]);
  });

  it('createPresentation - with slides', () => {
    const slide = createMaximalSlide('first');
    const p = createPresentation('p2', 'HasSlides', [slide]);
    expect(p.slides).toEqual([slide]);
  });

  it('updatePresentationTitle - minimal: changes title immutably', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const res = updatePresentationTitle(pres, 'New Title');

    expect(res.title).toBe('New Title');
    expect(res).not.toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('updatePresentationTitle - maximal: no-op when same title', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const res = updatePresentationTitle(pres, pres.title);

    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('addSlideToPresentation - minimal: appends slide', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const newSlide = createMinimalSlide('ns');
    const res = addSlideToPresentation(pres, newSlide);

    expect(res.slides.length).toBe(1);
    expect(res.slides[0]).toEqual(newSlide);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('addSlideToPresentation - maximal: appends slide', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const newSlide = createMaximalSlide('ns2');
    const res = addSlideToPresentation(pres, newSlide);

    expect(res.slides.length).toBe(pres.slides.length + 1);
    expect(res.slides.at(-1)).toEqual(newSlide);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('removeSlide - minimal: no-op and immutable', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const res = deleteSlideFromPresentation(pres, 'no-id');

    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('deleteSlideFromPresentation - maximal: removes slide', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);
    const slideToDelete = pres.slides[0];

    const res = deleteSlideFromPresentation(pres, slideToDelete.id);

    expect(res.slides.length).toBe(pres.slides.length - 1);
    expect(res.slides.some(s => s.id === slideToDelete.id)).toBe(false);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('moveSlide - minimal: moving non-existing slide returns original', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const res = moveSlide(pres, 'no-id', 1);

    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('moveSlide - maximal: moves slide immutably', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const fromId = pres.slides[0].id;
    const res = moveSlide(pres, fromId, 1);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    // moved slide now at index 1
    expect(res.slides[1].id).toBe(fromId);
    // other slide preserved (deep equal and same reference where untouched)
    expect(res.slides[0]).toEqual(pres.slides[1]);
    expect(pres).toEqual(snap);
  });

  it('updateSlideInPresentation - minimal: no-op when slide not found', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const updatedSlide = createMinimalSlide('x');
    const res = updateSlideInPresentation(pres, 'x', updatedSlide);

    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('updateSlideInPresentation - maximal: replaces target slide immutably', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const targetId = pres.slides[0].id;
    const updated = {
      ...pres.slides[0],
      title: 'Updated Title',
    };

    const res = updateSlideInPresentation(pres, targetId, updated);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);

    const found = res.slides.find(s => s.id === targetId);
    expect(found).toEqual(updated);

    pres.slides.forEach(s => {
      if (s.id !== targetId) {
        const r = res.slides.find(rs => rs.id === s.id);
        expect(r).toEqual(s);
        expect(r).toBe(s);
      }
    });

    expect(pres).toEqual(snap);
  });
});

describe('PresentationUtils (additional coverage & edge cases)', () => {
  it('createPresentation - minimal shape matches expected', () => {
    const p = createPresentation('p1', 'T');
    expect(p).toEqual({
      id: 'p1',
      title: 'T',
      slides: [],
    });
  });

  it('updatePresentationTitle - no-op: returns same reference when title is identical (minimal)', () => {
    const pres = createPresentation('p2', 'Same');
    const snap = deepClone(pres);
    const res = updatePresentationTitle(pres, 'Same');
    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('moveSlide - clamp negative index: moves last -> first', () => {
    const s1 = createMaximalSlide('s1');
    const s2 = createMaximalSlide('s2');
    const s3 = createMaximalSlide('s3');
    const pres: Presentation = {
      id: 'p-move',
      title: 'T',
      slides: [s1, s2, s3],
    };
    const snap = deepClone(pres);

    const res = moveSlide(pres, s3.id, -5);
    expect(res).not.toBe(pres);
    expect(res.slides[0].id).toBe(s3.id);
    expect(res.slides[1]).toEqual(s1);
    expect(res.slides[2]).toEqual(s2);
    expect(pres).toEqual(snap);
  });

  it('moveSlide - clamp large index: moves first -> last', () => {
    const s1 = createMaximalSlide('s1x');
    const s2 = createMaximalSlide('s2x');
    const s3 = createMaximalSlide('s3x');
    const pres: Presentation = {
      id: 'p-move-2',
      title: 'T',
      slides: [s1, s2, s3],
    };
    const snap = deepClone(pres);

    const res = moveSlide(pres, s1.id, 9999);
    expect(res).not.toBe(pres);
    expect(res.slides[2].id).toBe(s1.id);
    expect(res.slides[0]).toEqual(s2);
    expect(res.slides[1]).toEqual(s3);
    expect(pres).toEqual(snap);
  });

  it('updatePresentationTitle - minimal: changes title immutably and shape preserved', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);
    const res = updatePresentationTitle(pres, 'New Title');

    expect(res.title).toBe('New Title');
    expect(res).not.toBe(pres);
    expect(Object.keys(res).sort()).toEqual(Object.keys(pres).sort());
    expect(pres).toEqual(snap);
  });

  it('deleteSlideFromPresentation - maximal: removes slide', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);
    const slideToDelete = pres.slides[0];

    const res = deleteSlideFromPresentation(pres, slideToDelete.id);
    expect(res).not.toBe(pres);
    expect(res.slides.some(s => s.id === slideToDelete.id)).toBe(false);
    expect(pres).toEqual(snap);
  });

  it('moveSlide - no-op (non-existing id): returns original', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);
    const res = moveSlide(pres, 'no-id', 1);
    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('updateSlideInPresentation - maximal: replaces target slide immutably and preserves others by reference', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const targetId = pres.slides[0].id;
    const updated = {
      ...pres.slides[0],
      title: 'Updated Title',
    };

    const res = updateSlideInPresentation(pres, targetId, updated);
    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    const found = res.slides.find(s => s.id === targetId);
    expect(found).toEqual(updated);
    pres.slides.forEach(s => {
      if (s.id !== targetId) {
        const r = res.slides.find(rs => rs.id === s.id);
        expect(r).toEqual(s);
        expect(r).toBe(s);
      }
    });
    expect(pres).toEqual(snap);
  });
});
