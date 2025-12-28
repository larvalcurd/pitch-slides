import { useCallback, useState } from 'react';
import type { Editor } from '../entities/editor';
import { updateObjectInSlide, type Slide } from '../entities/slide';
import {
  createEditor,
  addSlide,
  deleteSlide,
  selectSlide,
  changePresentationTitle,
  addObject,
  deleteObject,
  changeSlideBackground,
  selectObject,
} from '../entities/editor';
import { updateSlideInPresentation } from '../entities/presentation';
import { moveObject } from '../entities/object';

export default function usePresentation() {
  const [editor, setEditor] = useState<Editor>(() => createEditor());

  const changeTitle = useCallback((newTitle: string) => {
    setEditor(prev => changePresentationTitle(prev, newTitle));
  }, []);

  const handleAddSlide = useCallback(() => {
    setEditor(prev => addSlide(prev));
  }, []);

  const handleDeleteSlide = useCallback(() => {
    setEditor(prev => deleteSlide(prev));
  }, []);

  const handleSelectSlide = useCallback((slideId: string) => {
    setEditor(prev => selectSlide(prev, slideId));
  }, []);

  const handleAddObject = useCallback((type: 'text' | 'image') => {
    setEditor(prev => addObject(prev, type));
  }, []);

  const handleDeleteObject = useCallback(() => {
    setEditor(prev => deleteObject(prev));
  }, []);

  const handleChangeSlideBackground = useCallback((background: Slide['background']) => {
    setEditor(prev => changeSlideBackground(prev, background));
  }, []);

  const handleSelectObject = useCallback((objectId: string | null, multiSelect?: boolean) => {
  setEditor(prev => selectObject(prev, objectId, multiSelect));
}, []);

  const handleUpdateObjectPosition = useCallback((objectId: string, newX: number, newY: number) => {
    setEditor(prev => {
      const currentSlideId = prev.selection?.slideId;
      if (!currentSlideId) return prev;

      const slide = prev.presentation.slides.find(s => s.id === currentSlideId);
      if (!slide) return prev;

      const obj = slide.objects.find(o => o.id === objectId);
      if (!obj) return prev;

      const updatedObj = moveObject(obj, newX, newY);
      const updatedSlide = updateObjectInSlide(slide, objectId, updatedObj);
      const newPresentation = updateSlideInPresentation(
        prev.presentation,
        currentSlideId,
        updatedSlide,
      );

      return {
        ...prev,
        presentation: newPresentation,
      };
    });
  }, []);

  const handleUpdateObjectSize = useCallback(
    (objectId: string, newX: number, newY: number, newWidth: number, newHeight: number) => {
      setEditor(prev => {
        const currentSlideId = prev.selection?.slideId;
        if (!currentSlideId) return prev;

        const slide = prev.presentation.slides.find(s => s.id === currentSlideId);
        if (!slide) return prev;

        const obj = slide.objects.find(o => o.id === objectId);
        if (!obj) return prev;

        const updatedObj = {
          ...obj,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };

        const updatedSlide = {
          ...slide,
          objects: slide.objects.map(o => (o.id === objectId ? updatedObj : o)),
        };

        const newPresentation = {
          ...prev.presentation,
          slides: prev.presentation.slides.map(s => (s.id === currentSlideId ? updatedSlide : s)),
        };

        return {
          ...prev,
          presentation: newPresentation,
        };
      });
    },
    [],
  );

  const currentSlide = editor.presentation.slides.find(s => s.id === editor.selectedSlideId);

  return {
    editor,
    presentation: editor.presentation,
    currentSlide,
    selectedSlideId: editor.selection?.slideId,
    selectedObjectIds: editor.selection?.objectIds || [],
    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleAddObject,
    handleDeleteObject,
    handleChangeSlideBackground,
    handleSelectObject,
    handleUpdateObjectPosition,
    handleUpdateObjectSize,
  } as const;
}
