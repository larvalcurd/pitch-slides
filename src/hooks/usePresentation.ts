import { useCallback, useState } from 'react';
import type { Editor } from '../entities/editor/EditorTypes.ts';
import type { Slide } from '../entities/slide/types/SlideTypes.ts';
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
} from '../entities/editor/editor.ts';

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

  const handleSelectObject = useCallback((objectId: string) => {
    setEditor(prev => selectObject(prev, objectId));
  }, []);

  return {
    presentation: editor.presentation,
    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleAddObject,
    handleDeleteObject,
    handleChangeSlideBackground,
    handleSelectObject,
    selectedObjectIds: editor.selection?.objectIds || [],
  } as const;
}
