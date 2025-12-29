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
import { moveObject, updateTextContent } from '../entities/object';

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
  setEditor(prev => {
    const newEditor = addObject(prev, type);
    if (type === 'text') {
      const newObject = newEditor.presentation.slides
        .find(s => s.id === newEditor.presentation.selectedSlideId)
        ?.objects.slice(-1)[0];
      if (newObject) {
        newEditor.editingTextObjectId = newObject.id;
      }
    }
    return newEditor;
  });
}, []);


  const handleDeleteObject = useCallback(() => {
  setEditor(prev => {
    const currentEditingId = prev.editingTextObjectId;
    const newEditor = deleteObject(prev);
    
    if (currentEditingId && !newEditor.presentation.slides
      .find(s => s.id === newEditor.presentation.selectedSlideId)
      ?.objects.some(o => o.id === currentEditingId)) {
      newEditor.editingTextObjectId = null;
    }
    return newEditor;
  });
}, []);

  const handleChangeSlideBackground = useCallback((background: Slide['background']) => {
    setEditor(prev => changeSlideBackground(prev, background));
  }, []);

  const handleSelectObject = useCallback((objectId: string | null, multiSelect?: boolean) => {
  setEditor(prev => {
    const newEditor = selectObject(prev, objectId, multiSelect);
    if (objectId) {
      const selectedObj = prev.presentation.slides
        .find(s => s.id === prev.selectedSlideId)
        ?.objects.find(o => o.id === objectId);
      newEditor.editingTextObjectId = selectedObj?.type === 'text' ? objectId : null;
    } else {
      newEditor.editingTextObjectId = null;
    }
    return newEditor;
  });
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

  const handleStartEditingText = useCallback((objectId: string) => {
    setEditor(prev => ({ ...prev, editingTextObjectId: objectId }));
  }, []);

  const handleStopEditingText = useCallback(() => {
    setEditor(prev => ({ ...prev, editingTextObjectId: null }));
  }, []);

  const handleUpdateTextContent = useCallback((objectId: string, content: string) => {
    setEditor(prev => {
      const currentSlide = prev.presentation.slides.find(s => s.id === prev.selectedSlideId);
      if (!currentSlide) return prev;
      const textObject = currentSlide.objects.find(o => o.id === objectId && o.type === 'text');
      if (!textObject) return prev;
      const updatedObject = updateTextContent(textObject as any, content);
      const updatedSlide = {
        ...currentSlide,
        objects: currentSlide.objects.map(o => (o.id === objectId ? updatedObject : o)),
      };
      const newPresentation = {
        ...prev.presentation,
        slides: prev.presentation.slides.map(s => (s.id === currentSlide.id ? updatedSlide : s)),
      };
      return {
        ...prev,
        presentation: newPresentation,
      };
    });
  }, []);

  const setEditingTextObject = useCallback((id: string | null) => {
  setEditor(prev => ({ ...prev, editingTextObjectId: id }));
}, []);

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
    editingTextObjectId: editor.editingTextObjectId,
    handleStartEditingText,
    handleStopEditingText,
    handleUpdateTextContent,
    setEditingTextObject
  } as const;
}
