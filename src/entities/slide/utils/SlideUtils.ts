import type { Slide } from '../types/SlideTypes.ts';
import type { SlideObject } from '../../object';
import { moveObject } from '../../object/utils/ObjectUtils';

export function addObjectToSlide(slide: Slide, object: SlideObject): Slide {
  return {
    ...slide,
    objects: [...slide.objects, object],
  };
}

export function removeObjectFromSlide(slide: Slide, objectId: string): Slide {
  return {
    ...slide,
    objects: slide.objects.filter(obj => obj.id !== objectId),
  };
}

export function updateObjectInSlide(
  slide: Slide,
  objectId: string,
  updatedObject: SlideObject,
): Slide {
  return {
    ...slide,
    objects: slide.objects.map(obj => (obj.id === objectId ? updatedObject : obj)),
  };
}

export function findObjectInSlide(slide: Slide, objectId: string): SlideObject | undefined {
  return slide.objects.find(obj => obj.id === objectId);
}

export function updateSlideBackground(slide: Slide, background: Slide['background']): Slide {
  return {
    ...slide,
    background,
  };
}

export function updateObjectsPositions(
  slide: Slide,
  objectIds: string[],
  deltaX: number,
  deltaY: number,
): Slide {
  return {
    ...slide,
    objects: slide.objects.map(obj => {
      if (objectIds.includes(obj.id)) {
        return moveObject(obj, obj.x + deltaX, obj.y + deltaY);
      }
      return obj;
    }),
  };
}
