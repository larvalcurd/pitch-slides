import { useCallback, useState } from 'react';
import type { Editor } from '../entities/editor/types/EditorTypes';
import type { Slide } from '../entities/slide';
import { createEditor } from '../entities/editor/factory/editorFactory';
import {
  addSlide,
  deleteSlide,
  changePresentationTitle,
  changeSlideBackground,
} from '../entities/editor/actions/editorPresentationActions';
import {
  addObject,
  deleteObject,
  updateTextObject,
  updateObjectPosition,
  updateObjectSize,
} from '../entities/editor/actions/editorObjectActions';
import {
  selectSlide,
  selectObject,
  clearSelection,
} from '../entities/editor/selection/editorSelection';

import useEditorDrag from './useEditorDrag';
import useEditorResize from './useEditorResize';
import {
  clearObjectSelection,
  clearUIState,
  startEditingText,
  stopEditingText,
} from '../entities/editor/actions/editorUIActions';

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

  const handleSelectSlide = useCallback((slideId: string) => {
    setEditor(prev => selectSlide(prev, slideId));
  }, []);

  const handleChangeSlideBackground = useCallback((background: Slide['background']) => {
    setEditor(prev => changeSlideBackground(prev, background));
  }, []);

  const handleAddObject = useCallback((type: 'text' | 'image') => {
    setEditor(prev => addObject(prev, type));
  }, []);

  const handleDeleteObject = useCallback(() => {
    setEditor(prev => deleteObject(prev));
  }, []);

  const handleSelectObject = useCallback((objectId: string | null, multiSelect?: boolean) => {
    setEditor(prev => selectObject(prev, objectId, multiSelect));
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

  const currentSlide = editor.presentation.slides.find(s => s.id === editor.selection?.slideId);
  const selectedObjectIds = editor.selection?.objectIds || [];

  return {
    editor,
    presentation: editor.presentation,
    currentSlide,
    selectedSlideId: editor.selection?.slideId,
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
    handleChangeSlideBackground,

    handleAddObject,
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
