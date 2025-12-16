import { useCallback, useState } from 'react';
import type { Presentation } from '../entities/presentation/types/PresentationTypes.ts';
import type { Slide } from '../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../entities/object/types/ObjectTypes.ts';
import {
  addSlide,
  createPresentation,
  deleteSlide,
  setSelectedSlide,
  updatePresentationTitle,
  updateSlideInPresentation,
} from '../entities/presentation/utils/PresentationUtils.ts';
import { createSlide } from '../entities/slide/factory/SlideFactory.ts';
import { createTextObject } from '../entities/object/factory/TextObjectFactory.ts';
import { createImageObject } from '../entities/object/factory/ImageObjectFactory.ts';
import { addObjectToSlide } from '../entities/slide/utils/SlideUtils.ts';

export default function usePresentation() {
  const [presentation, setPresentation] = useState<Presentation>(() =>
    createPresentation('p1', 'Untitled presentation', [createSlide()]),
  );

  const changeTitle = useCallback((newTitle: string) => {
    setPresentation(prev => updatePresentationTitle(prev, newTitle));
  }, []);

  const handleAddSlide = useCallback(() => {
    setPresentation(prev => {
      const newSlide: Slide = createSlide();
      return addSlide(prev, newSlide);
    });
  }, []);

  const handleDeleteSlide = useCallback(() => {
    setPresentation(prev => {
      if (!prev.selectedSlideId) return prev;
      return deleteSlide(prev, prev.selectedSlideId);
    });
  }, []);

  const handleSelectSlide = useCallback((slideId: string) => {
    setPresentation(prev => setSelectedSlide(prev, slideId));
  }, []);

  const handleAddObject = useCallback((type: 'text' | 'image') => {
    setPresentation(prev => {
      const slide = prev.slides.find(s => s.id === prev.selectedSlideId);
      if (!slide) return prev;

      let obj: SlideObject;
      if (type === 'text') {
        obj = createTextObject({
          x: 20,
          y: 20,
          width: 300,
          height: 80,
          content: 'New text',
        });
      } else {
        const imgW = 240;
        const paddingFromEdge = 30;
        const SLIDE_WIDTH = 960;
        const x = SLIDE_WIDTH - imgW - paddingFromEdge;
        obj = createImageObject({
          x,
          y: 20,
          width: imgW,
          height: 160,
          src: 'public/images/scale_1200.jpg',
        });
      }

      const updatedSlide = addObjectToSlide(slide, obj);
      return updateSlideInPresentation(prev, slide.id, updatedSlide);
    });
  }, []);

  const handleUpdateSlide = useCallback((slide: Slide) => {
    setPresentation(prev => updateSlideInPresentation(prev, slide.id, slide));
  }, []);

  return {
    presentation,
    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleAddObject,
    handleUpdateSlide,
  } as const;
}
