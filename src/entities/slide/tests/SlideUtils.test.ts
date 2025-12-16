import { describe, it, expect } from 'vitest';
import {
  addObjectToSlide,
  removeObjectFromSlide,
  updateObjectInSlide,
  findObjectInSlide,
  updateSlideBackground,
} from '../utils/SlideUtils';
import { createMinimalImage, createMaximalImage } from '../../object/factory/ImageObjectFactory';
import { createMinimalText, createMaximalText } from '../../object/factory/TextObjectFactory';
import type { Slide, SlideBackground } from '../types/SlideTypes';

function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

function createMinimalSlide(): Slide {
  return {
    id: 'slide-min',
    objects: [],
  };
}

function createMaximalSlide(): Slide {
  const imgMin = createMinimalImage();
  const imgMax = createMaximalImage();
  const txtMin = createMinimalText();
  const txtMax = createMaximalText();

  return {
    id: 'slide-max',
    title: 'Full Slide',
    background: { type: 'image', value: 'bg-full.png' },
    objects: [imgMin, imgMax, txtMin, txtMax],
  };
}

describe('SlideUtils (deep immutability)', () => {
  it('addObjectToSlide - minimal slide: append + deep immutability', () => {
    const slide = createMinimalSlide();
    const snapshot = deepClone(slide);

    const obj = createMinimalText();
    const res = addObjectToSlide(slide, obj);

    expect(res.objects.length).toBe(1);
    expect(res.objects[0]).toEqual(obj);

    expect(res).not.toBe(slide);
    expect(res.objects).not.toBe(slide.objects);

    expect(slide).toEqual(snapshot);
  });

  it('addObjectToSlide - maximal slide: append + deep immutability', () => {
    const slide = createMaximalSlide();
    const snapshot = deepClone(slide);

    const newObj = createMinimalImage();
    const res = addObjectToSlide(slide, newObj);

    expect(res.objects.length).toBe(slide.objects.length + 1);
    expect(res.objects.at(-1)).toEqual(newObj);

    expect(res).not.toBe(slide);
    expect(res.objects).not.toBe(slide.objects);

    expect(slide).toEqual(snapshot);
  });

  it('removeObjectFromSlide - deletes correct object immutably', () => {
    const slide = createMaximalSlide();
    const snapshot = deepClone(slide);

    const targetId = slide.objects[1].id;
    const res = removeObjectFromSlide(slide, targetId);

    expect(res.objects.some(o => o.id === targetId)).toBe(false);
    expect(res.objects.length).toBe(slide.objects.length - 1);

    expect(res).not.toBe(slide);
    expect(res.objects).not.toBe(slide.objects);

    expect(slide).toEqual(snapshot);
  });

  it('updateObjectInSlide - replaces correct object immutably', () => {
    const slide = createMaximalSlide();
    const snapshot = deepClone(slide);

    const target = slide.objects[2];
    const updated = { ...target, x: (target.x ?? 0) + 100 };

    const res = updateObjectInSlide(slide, target.id, updated);

    // replaced correctly
    const found = res.objects.find(o => o.id === target.id);
    expect(found).toEqual(updated);

    // untouched others
    slide.objects.forEach((orig, i) => {
      if (orig.id !== target.id) {
        expect(res.objects[i]).toEqual(orig);
      }
    });

    expect(res).not.toBe(slide);
    expect(res.objects).not.toBe(slide.objects);

    expect(slide).toEqual(snapshot);
  });

  it('findObjectInSlide - returns object by id', () => {
    const slide = createMaximalSlide();
    const target = slide.objects[0];

    const found = findObjectInSlide(slide, target.id);

    expect(found).toEqual(target);
  });

  it('updateSlideBackground - changes background immutably', () => {
    const slide = createMaximalSlide();
    const snapshot = deepClone(slide);

    const newBg: SlideBackground = { type: 'color', value: '#ff0000' };
    const res = updateSlideBackground(slide, newBg);

    expect(res.background).toEqual(newBg);
    expect(res).not.toBe(slide);

    expect(slide).toEqual(snapshot);
  });
});
