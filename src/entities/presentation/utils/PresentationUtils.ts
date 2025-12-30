import type { Slide } from '../../slide';
import type { Presentation } from '../types/PresentationTypes.ts';

export function createPresentation(id: string, title: string, slides: Slide[] = []): Presentation {
  return {
    id,
    title,
    slides,
  };
}

export function updatePresentationTitle(
  presentation: Presentation,
  newTitle: string,
): Presentation {
  if (presentation.title === newTitle) return presentation;
  return {
    ...presentation,
    title: newTitle,
  };
}

export function addSlideToPresentation(presentation: Presentation, slide: Slide): Presentation {
  return {
    ...presentation,
    slides: [...presentation.slides, slide],
  };
}

export function deleteSlideFromPresentation(
  presentation: Presentation,
  slideId: string,
): Presentation {
  const newSlides = presentation.slides.filter(s => s.id !== slideId);

  if (newSlides.length === presentation.slides.length) return presentation;

  return {
    ...presentation,
    slides: newSlides,
  };
}

export function moveSlide(
  presentation: Presentation,
  slideId: string,
  newIndex: number,
): Presentation {
  const slides = [...presentation.slides];
  const currentIndex = slides.findIndex(slide => slide.id === slideId);

  if (currentIndex === -1) return presentation;

  const clampedIndex = Math.max(0, Math.min(newIndex, slides.length - 1));

  if (clampedIndex === currentIndex) return presentation;

  const [moved] = slides.splice(currentIndex, 1);
  slides.splice(clampedIndex, 0, moved);

  return {
    ...presentation,
    slides,
  };
}

export function updateSlideInPresentation(
  presentation: Presentation,
  slideId: string,
  updatedSlide: Slide,
): Presentation {
  let changed = false;
  const slides = presentation.slides.map(slide => {
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
