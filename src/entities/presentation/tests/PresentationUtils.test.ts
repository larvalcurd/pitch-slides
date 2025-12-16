import { describe, it, expect } from 'vitest';
import {
  createPresentation,
  updatePresentationTitle,
  addSlide,
  deleteSlide,
  moveSlide,
  setSelectedSlide,
  updateSlideInPresentation,
} from '../utils/PresentationUtils';
import { createMinimalImage, createMaximalImage } from '../../object/factory/ImageObjectFactory';
import { createMinimalText, createMaximalText } from '../../object/factory/TextObjectFactory';
import type { Presentation } from '../types/PresentationTypes';
import type { Slide } from '../../slide/types/SlideTypes';

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
    selectedSlideId: s1.id,
    selectedObjects: {
      slideId: s1.id,
      objectIds: [s1.objects[0].id, s1.objects[1].id],
    },
  };
}

describe('PresentationUtils (deep immutability + behavior)', () => {
  it('createPresentation - minimal (no slides) sets selectedSlideId null and no mutation', () => {
    const p = createPresentation('p1', 'T'); // using exported factory
    expect(p.id).toBe('p1');
    expect(p.title).toBe('T');
    expect(p.slides).toEqual([]);
    expect(p.selectedSlideId).toBeNull();
    expect(p.selectedObjects).toBeNull();
  });

  it('createPresentation - with slides picks first slide as selected', () => {
    const slide = createMaximalSlide('first');
    const p = createPresentation('p2', 'HasSlides', [slide]);
    expect(p.selectedSlideId).toBe(slide.id);
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

  it('addSlide - minimal: appends slide and sets selectedSlideId to new slide id', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const newSlide = createMinimalSlide('ns');
    const res = addSlide(pres, newSlide);

    expect(res.slides.length).toBe(1);
    expect(res.slides[0]).toEqual(newSlide);
    expect(res.selectedSlideId).toBe(newSlide.id);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('addSlide - maximal: appends slide and selects the new slide (current behavior)', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const newSlide = createMaximalSlide('ns2');
    const res = addSlide(pres, newSlide);

    expect(res.slides.length).toBe(pres.slides.length + 1);
    expect(res.slides.at(-1)).toEqual(newSlide);
    expect(res.selectedSlideId).toBe(newSlide.id);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('removeSlide - minimal: no-op and immutable', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const res = deleteSlide(pres, 'no-id');

    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('removeSlide - maximal: removes slide, updates selectedSlideId and clears selectedObjects if needed', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const res = deleteSlide(pres, pres.selectedSlideId as string);

    expect(res.slides.some(s => s.id === pres.selectedSlideId)).toBe(false);

    const expectedSelected = res.slides[0]?.id ?? null;
    expect(res.selectedSlideId).toBe(expectedSelected);

    expect(res.selectedObjects).toBeNull();

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

  it('setSelectedSlide - minimal: setting to null/slide id behaves immutably', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const resNull = setSelectedSlide(pres, null);
    expect(resNull.selectedSlideId).toBeNull();
    expect(resNull).not.toBe(pres);
    expect(pres).toEqual(snap);

    const resInvalid = setSelectedSlide(pres, 'no-id');
    expect(resInvalid).toBe(pres);
  });

  it('setSelectedSlide - maximal: change selection clears selectedObjects and is immutable', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const otherId = pres.slides[1].id;
    const res = setSelectedSlide(pres, otherId);

    expect(res.selectedSlideId).toBe(otherId);
    expect(res.selectedObjects).toBeNull();
    expect(res).not.toBe(pres);
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
      selectedSlideId: null,
      selectedObjects: null,
    });
  });

  it('updatePresentationTitle - no-op: returns same reference when title is identical (minimal)', () => {
    const pres = createPresentation('p2', 'Same');
    const snap = deepClone(pres);
    const res = updatePresentationTitle(pres, 'Same');
    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('addSlide - when presentation.selectedSlideId is undefined: sets to new slide id', () => {
    const s1 = createMaximalSlide('a');
    const s2 = createMaximalSlide('b');

    const pres: Presentation = {
      id: 'p-undef',
      title: 'T',
      slides: [s1, s2],
    };
    const snap = deepClone(pres);

    const newSlide = createMinimalSlide('ns');
    const res = addSlide(pres, newSlide);

    expect(res.slides.length).toBe(3);
    expect(res.selectedSlideId).toBe(newSlide.id);

    expect(res).not.toBe(pres);
    expect(res.slides).not.toBe(pres.slides);
    expect(pres).toEqual(snap);
  });

  it('addSlide - when selectedSlideId is null (explicit): sets to new slide id', () => {
    const pres: Presentation = {
      id: 'p-null',
      title: 'T',
      slides: [],
      selectedSlideId: null,
    };
    const snap = deepClone(pres);
    const newSlide = createMinimalSlide('ns-null');
    const res = addSlide(pres, newSlide);

    expect(res.slides.length).toBe(1);
    expect(res.selectedSlideId).toBe(newSlide.id);
    expect(res).not.toBe(pres);
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
      selectedSlideId: s1.id,
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
      selectedSlideId: s1.id,
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

  it('removeSlide - maximal: removes selected slide and clears selectedObjects', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const res = deleteSlide(pres, pres.selectedSlideId as string);
    expect(res).not.toBe(pres);
    expect(res.slides.some(s => s.id === pres.selectedSlideId)).toBe(false);
    expect(res.selectedObjects).toBeNull();
    expect(pres).toEqual(snap);
  });

  it('moveSlide - no-op (non-existing id): returns original', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);
    const res = moveSlide(pres, 'no-id', 1);
    expect(res).toBe(pres);
    expect(pres).toEqual(snap);
  });

  it('setSelectedSlide - minimal: set to null returns new object and shape unchanged', () => {
    const pres = createMinimalPresentation();
    const snap = deepClone(pres);

    const resNull = setSelectedSlide(pres, null);
    expect(resNull).not.toBe(pres);
    expect(resNull.selectedSlideId).toBeNull();
    expect(pres).toEqual(snap);
  });

  it('setSelectedSlide - maximal: change selection clears selectedObjects and is immutable', () => {
    const pres = createMaximalPresentation();
    const snap = deepClone(pres);

    const otherId = pres.slides[1].id;
    const res = setSelectedSlide(pres, otherId);

    expect(res.selectedSlideId).toBe(otherId);
    expect(res.selectedObjects).toBeNull();
    expect(res).not.toBe(pres);
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
