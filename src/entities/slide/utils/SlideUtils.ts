import type { Slide } from '../types/SlideTypes.ts';
import type { SlideObject } from '../../object/types/ObjectTypes.ts';

export function addObjectToSlide(slide: Slide, object: SlideObject): Slide {
    return {
        ...slide,
        objects: [...slide.objects, object],
    };
}

export function removeObjectFromSlide(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter((obj) => obj.id !== objectId),
    };
}

export function updateObjectInSlide(
    slide: Slide,
    objectId: string,
    updatedObject: SlideObject
): Slide {
    return {
        ...slide,
        objects: slide.objects.map((obj) => (obj.id === objectId ? updatedObject : obj)),
    };
}

export function findObjectInSlide(slide: Slide, objectId: string): SlideObject | undefined {
    return slide.objects.find((obj) => obj.id === objectId);
}

export function updateSlideBackground(slide: Slide, background: Slide['background']): Slide {
    return {
        ...slide,
        background,
    };
}

