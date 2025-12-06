import type { Slide } from '../../slide/types/SlideTypes.ts';
import type { Presentation } from '../types/PresentationTypes.ts';

export function createPresentation(id: string, title: string, slides: Slide[] = []): Presentation {
    return {
        id,
        title,
        slides,
        selectedSlideId: slides[0]?.id || null,
        selectedObjects: null,
    };
}

export function updatePresentationTitle(
    presentation: Presentation,
    newTitle: string
): Presentation {
    if (presentation.title === newTitle) return presentation;
    return {
        ...presentation,
        title: newTitle,
    };
}

export function addSlide(presentation: Presentation, slide: Slide): Presentation {
    return {
        ...presentation,
        slides: [...presentation.slides, slide],
        selectedSlideId: presentation.selectedSlideId ?? slide.id,
    };
}

export function removeSlide(presentation: Presentation, slideId: string): Presentation {
    const newSlides = presentation.slides.filter((s) => s.id !== slideId);

    // if nothing removed, return original
    if (newSlides.length === presentation.slides.length) return presentation;

    const newSelectedSlideId =
        presentation.selectedSlideId === slideId ? newSlides[0]?.id || null : presentation.selectedSlideId;

    return {
        ...presentation,
        slides: newSlides,
        selectedSlideId: newSelectedSlideId,
        selectedObjects:
            presentation.selectedObjects?.slideId === slideId ? null : presentation.selectedObjects,
    };
}

export function moveSlide(
    presentation: Presentation,
    slideId: string,
    newIndex: number
): Presentation {
    const slides = [...presentation.slides];
    const currentIndex = slides.findIndex((slide) => slide.id === slideId);

    if (currentIndex === -1) return presentation;

    // clamp newIndex to valid range
    const clampedIndex = Math.max(0, Math.min(newIndex, slides.length - 1));

    // nothing to do
    if (clampedIndex === currentIndex) return presentation;

    const [moved] = slides.splice(currentIndex, 1);
    slides.splice(clampedIndex, 0, moved);

    return {
        ...presentation,
        slides,
    };
}

/**
 * Set the currently selected slide id.
 * - If `slideId` is null, selection is cleared.
 * - If `slideId` is not found among slides, original presentation is returned.
 * - If `slideId` equals current selection, original presentation is returned.
 * When selection changes, `selectedObjects` is cleared (selection is slide-scoped).
 */
export function setSelectedSlide(presentation: Presentation, slideId: string | null): Presentation {
    if (slideId === presentation.selectedSlideId) return presentation;

    if (slideId !== null) {
        const exists = presentation.slides.some((s) => s.id === slideId);
        if (!exists) return presentation;
    }

    return {
        ...presentation,
        selectedSlideId: slideId,
        selectedObjects: null,
    };
}

export function updateSlideInPresentation(
    presentation: Presentation,
    slideId: string,
    updatedSlide: Slide
): Presentation {
    let changed = false;
    const slides = presentation.slides.map((slide) => {
        if (slide.id === slideId) {
            changed = true;
            return updatedSlide;
        }
        return slide;
    });

    if (!changed) return presentation;

    return {
        ...presentation,
        slides,
    };
}
