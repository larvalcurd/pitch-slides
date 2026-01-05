import { useCallback, useState } from 'react';
import type { Editor } from '../entities/editor/types/EditorTypes';
import type { Slide } from '../entities/slide';
import { createEditor } from '../entities/editor/factory/editorFactory';
import { moveSlides } from '../entities/editor/actions/editorPresentationActions';
import {
  getSelectedSlideIds,
  getSelectedSlideId,
  getSelectedObjectIds,
} from '../entities/editor/selection/editorSelection';

import useEditorDrag from './useEditorDrag';
import useEditorResize from './useEditorResize';
import type { ImagePayload } from '../entities/object/types/ImagePayload';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import {
  addSlide,
  changePresentationTitle,
  changeSlideBackground,
  deleteSlide,
  selectSlide,
  toggleSlideSelection,
  updateEditor,
  selectObject,
  toggleObjectSelection,
  clearObjectSelection,
  startEditingText,
  stopEditingText,
  clearUIState,
  addTextObject,
  addImageObject,
  deleteObject,
  updateTextObject,
  updateObjectPosition,
  updateObjectSize,
} from '../store/editorSlice';

export default function usePresentation() {
  // const [editor, setEditor] = useState<Editor>(() => createEditor());

  const editor = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch<AppDispatch>();

  const applyEditorUpdate = useCallback(
    (update: (editor: Editor) => Editor) => {
      const newEditor = update(editor);
      dispatch(updateEditor(newEditor));
    },
    [dispatch, editor],
  );

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

  const changeTitle = useCallback(
    (newTitle: string) => {
      dispatch(changePresentationTitle(newTitle));
    },
    [dispatch],
  );

  const handleAddSlide = useCallback(() => {
    dispatch(addSlide());
  }, [dispatch]);

  const handleDeleteSlide = useCallback(() => {
    dispatch(deleteSlide());
  }, [dispatch]);

  const handleSelectSlide = useCallback(
    (slideId: string, multi: boolean) => {
      if (multi) {
        dispatch(toggleSlideSelection(slideId));
      } else {
        dispatch(selectSlide(slideId));
      }
    },
    [dispatch],
  );

  // const handleMoveSlides = useCallback((targetIndex: number) => {
  //   setEditor(prev => moveSlides(prev, targetIndex));
  // }, []);

  // const handleChangeSlideBackground = useCallback((background: Slide['background']) => {
  //   setEditor(prev => changeSlideBackground(prev, background));
  // }, []);

  const handleChangeSlideBackground = useCallback(
    (background: Slide['background']) => {
      dispatch(changeSlideBackground(background));
    },
    [dispatch],
  );

  // const handleAddText = useCallback(() => {
  //   setEditor(prev => addTextObject(prev));
  // }, []);

  const handleAddText = useCallback(() => {
    dispatch(addTextObject());
  }, [dispatch]);

  // const handleAddImage = useCallback((payload: ImagePayload) => {
  //   setEditor(prev => addImageObject(prev, payload));
  // }, []);

  const handleAddImage = useCallback(
    (payload: ImagePayload) => {
      dispatch(addImageObject(payload));
    },
    [dispatch],
  );

  // const handleDeleteObject = useCallback(() => {
  //   setEditor(prev => deleteObject(prev));
  // }, []);

  const handleDeleteObject = useCallback(() => {
    dispatch(deleteObject());
  }, [dispatch]);

  // const handleSelectObject = useCallback((objectId: string, multi: boolean) => {
  //   setEditor(prev => {
  //     const slideId = getSelectedSlideId(prev);
  //     if (!slideId) return prev;

  //     return multi
  //       ? toggleObjectSelection(prev, slideId, objectId)
  //       : selectObject(prev, slideId, objectId);
  //   });
  // }, []);

  const handleSelectObject = useCallback(
    (objectId: string, multi: boolean) => {
      const slideId = getSelectedSlideId(editor);
      if (!slideId) return;

      if (multi) {
        dispatch(toggleObjectSelection({ slideId, objectId }));
      } else {
        dispatch(selectObject({ slideId, objectId }));
      }
    },
    [dispatch, editor],
  );

  // const handleDeselectAll = useCallback(() => {
  //   setEditor(prev => clearUIState(clearObjectSelection(prev)));
  // }, []);

  const handleDeselectAll = useCallback(() => {
    dispatch(clearUIState());
    dispatch(clearObjectSelection());
  }, [dispatch]);

  // const handleStartEditingText = useCallback((objectId: string) => {
  //   setEditor(prev => startEditingText(prev, objectId));
  // }, []);

  const handleStartEditingText = useCallback(
    (objectId: string) => {
      dispatch(startEditingText(objectId));
    },
    [dispatch],
  );

  // const handleStopEditingText = useCallback(() => {
  //   setEditor(prev => stopEditingText(prev));
  // }, []);

  const handleStopEditingText = useCallback(() => {
    dispatch(stopEditingText());
  }, [dispatch]);

  // const handleUpdateTextContent = useCallback((objectId: string, content: string) => {
  //   setEditor(prev => updateTextObject(prev, objectId, content));
  // }, []);

  const handleUpdateTextContent = useCallback(
    (objectId: string, content: string) => {
      dispatch(updateTextObject({ objectId, content }));
    },
    [dispatch],
  );

  // const handleUpdateObjectPosition = useCallback((objectId: string, x: number, y: number) => {
  //   setEditor(prev => updateObjectPosition(prev, objectId, x, y));
  // }, []);

  const handleUpdateObjectPosition = useCallback(
    (objectId: string, x: number, y: number) => {
      dispatch(updateObjectPosition({ objectId, x, y }));
    },
    [dispatch],
  );

  // const handleUpdateObjectSize = useCallback((objectId: string, width: number, height: number) => {
  //   setEditor(prev => updateObjectSize(prev, objectId, width, height));
  // }, []);

  const handleUpdateObjectSize = useCallback(
    (objectId: string, width: number, height: number) => {
      dispatch(updateObjectSize({ objectId, width, height }));
    },
    [dispatch],
  );

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
