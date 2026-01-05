import { useCallback, useState } from 'react';
import type { Editor } from '../entities/editor';
import type { Slide } from '../entities/slide';
import { createEditor } from '../entities/editor/factory/editorFactory';
import {
  addSlide,
  deleteSlide,
  changePresentationTitle,
  changeSlideBackground,
  moveSlides,
} from '../entities/editor/actions/editorPresentationActions';
import {
  addImageObject,
  deleteObject,
  updateTextObject,
  updateObjectPosition,
  updateObjectSize,
  addTextObject,
} from '../entities/editor/actions/editorObjectActions';
import {
  selectSlide,
  selectObject,
  getSelectedSlideIds,
  getSelectedSlideId,
  getSelectedObjectIds,
  toggleSlideSelection,
  toggleObjectSelection,
} from '../entities/editor/selection/editorSelection';

import useEditorDrag from './useEditorDrag';
import useEditorResize from './useEditorResize';
import {
  clearObjectSelection,
  clearUIState,
  startEditingText,
  stopEditingText,
} from '../entities/editor/actions/editorUIActions';
import type { ImagePayload } from '../entities/object/types/ImagePayload';

export default function usePresentation() {
  const [editor, setEditor] = useState<Editor>(() => createEditor());

  const applyEditorUpdate = useCallback((update: (editor: Editor) => Editor) => {
    setEditor(update);
  }, []);

  const { isDragging, startDrag, getDeltaForObject } = useEditorDrag({
    editor,
    applyEditorUpdate,
    threshold: 3,
  });

  const { isResizing, resizingObjectId, resizePreview, startResize } = useEditorResize({
    editor,
    applyEditorUpdate,
    minWidth: 50,
    minHeight: 30,
  });

  const changeTitle = useCallback((newTitle: string) => {
    setEditor(prev => changePresentationTitle(prev, newTitle));
  }, []);

  const handleAddSlide = useCallback(() => {
    setEditor(prev => addSlide(prev));
  }, []);

  const handleDeleteSlide = useCallback(() => {
    setEditor(prev => deleteSlide(prev));
  }, []);

  const handleSelectSlide = useCallback((slideId: string, multi: boolean) => {
    setEditor(prev => (multi ? toggleSlideSelection(prev, slideId) : selectSlide(prev, slideId)));
  }, []);

  const handleMoveSlides = useCallback((targetIndex: number) => {
    setEditor(prev => moveSlides(prev, targetIndex));
  }, []);

  const handleChangeSlideBackground = useCallback((background: Slide['background']) => {
    setEditor(prev => changeSlideBackground(prev, background));
  }, []);

  const handleAddText = useCallback(() => {
    setEditor(prev => addTextObject(prev));
  }, []);

  const handleAddImage = useCallback((payload: ImagePayload) => {
    setEditor(prev => addImageObject(prev, payload));
  }, []);

  const handleDeleteObject = useCallback(() => {
    setEditor(prev => deleteObject(prev));
  }, []);

  const handleSelectObject = useCallback((objectId: string, multi: boolean) => {
    setEditor(prev => {
      const slideId = getSelectedSlideId(prev);
      if (!slideId) return prev;

      return multi
        ? toggleObjectSelection(prev, slideId, objectId)
        : selectObject(prev, slideId, objectId);
    });
  }, []);

  const handleDeselectAll = useCallback(() => {
    setEditor(prev => clearUIState(clearObjectSelection(prev)));
  }, []);

  const handleStartEditingText = useCallback((objectId: string) => {
    setEditor(prev => startEditingText(prev, objectId));
  }, []);

  const handleStopEditingText = useCallback(() => {
    setEditor(prev => stopEditingText(prev));
  }, []);

  const handleUpdateTextContent = useCallback((objectId: string, content: string) => {
    setEditor(prev => updateTextObject(prev, objectId, content));
  }, []);

  const handleUpdateObjectPosition = useCallback((objectId: string, x: number, y: number) => {
    setEditor(prev => updateObjectPosition(prev, objectId, x, y));
  }, []);

  const handleUpdateObjectSize = useCallback((objectId: string, width: number, height: number) => {
    setEditor(prev => updateObjectSize(prev, objectId, width, height));
  }, []);

  const selectedSlideIds = getSelectedSlideIds(editor);
  const selectedSlideId = getSelectedSlideId(editor);

  const currentSlide = editor.presentation.slides.find(s => s.id === selectedSlideId) ?? null;

  const selectedObjectIds = getSelectedObjectIds(editor);

  return {
    editor,
    presentation: editor.presentation,
    currentSlide,
    selectedSlideIds,
    selectedObjectIds,

    isDragging,
    startDrag,
    getDeltaForObject,

    isResizing,
    resizingObjectId,
    resizePreview,
    startResize,

    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleMoveSlides,
    handleChangeSlideBackground,

    handleAddText,
    handleAddImage,
    handleDeleteObject,

    handleSelectObject,
    handleDeselectAll,

    editingTextObjectId: editor.editingTextObjectId,
    handleStartEditingText,
    handleStopEditingText,
    handleUpdateTextContent,
    handleUpdateObjectPosition,
    handleUpdateObjectSize,
  } as const;
}
