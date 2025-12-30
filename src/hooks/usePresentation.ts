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
import { selectSlide, selectObject } from '../entities/editor/selection/editorSelection';

import useEditorDrag from './useEditorDrag';
import useEditorResize from './useEditorResize';

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
    setEditor(prev => {
      const newEditor = addObject(prev, type);
      if (type === 'text') {
        const newObject = newEditor.presentation.slides
          .find(s => s.id === newEditor.selection?.slideId)
          ?.objects.slice(-1)[0];
        if (newObject) {
          return { ...newEditor, editingTextObjectId: newObject.id };
        }
      }
      return newEditor;
    });
  }, []);

  const handleDeleteObject = useCallback(() => {
    setEditor(prev => {
      const currentEditingId = prev.editingTextObjectId;
      const newEditor = deleteObject(prev);

      if (
        currentEditingId &&
        !newEditor.presentation.slides
          .find(s => s.id === newEditor.selection?.slideId)
          ?.objects.some(o => o.id === currentEditingId)
      ) {
        return { ...newEditor, editingTextObjectId: null };
      }
      return newEditor;
    });
  }, []);

  const handleSelectObject = useCallback((objectId: string | null, multiSelect?: boolean) => {
    setEditor(prev => {
      const newEditor = selectObject(prev, objectId, multiSelect);

      if (objectId) {
        const selectedObj = prev.presentation.slides
          .find(s => s.id === prev.selection?.slideId)
          ?.objects.find(o => o.id === objectId);
        return {
          ...newEditor,
          editingTextObjectId: selectedObj?.type === 'text' ? objectId : null,
        };
      }

      return { ...newEditor, editingTextObjectId: null };
    });
  }, []);
  const handleDeselectAll = useCallback(() => {
    setEditor(prev => {
      if (!prev.selection) return prev;

      return {
        ...prev,
        selection: {
          ...prev.selection,
          objectIds: [],
        },
        editingTextObjectId: null,
        dragging: null,
        resizing: null,
      };
    });
  }, []);

  const handleStartEditingText = useCallback((objectId: string) => {
    setEditor(prev => ({ ...prev, editingTextObjectId: objectId }));
  }, []);

  const handleStopEditingText = useCallback(() => {
    setEditor(prev => ({ ...prev, editingTextObjectId: null }));
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

  const setEditingTextObject = useCallback((id: string | null) => {
    setEditor(prev => ({ ...prev, editingTextObjectId: id }));
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
    setEditingTextObject,
    handleUpdateObjectPosition,
    handleUpdateObjectSize,
  } as const;
}
