import { useCallback } from 'react';
import type { Slide } from '../entities/slide';
import {
  getSelectedSlideIds,
  getSelectedSlideId,
  getSelectedObjectIds,
  getSelectedSlide,
} from '../entities/editor/selection/editorSelection';
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
  const dispatch = useDispatch<AppDispatch>();

  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const editingTextObjectId = useSelector((state: RootState) => state.editor.editingTextObjectId);
  const editorForSelection = useSelector((state: RootState) => state.editor);

  const selectedSlideIds = getSelectedSlideIds(editorForSelection);
  const selectedSlideId = getSelectedSlideId(editorForSelection);
  const currentSlide = getSelectedSlide(editorForSelection);
  const selectedObjectIds = getSelectedObjectIds(editorForSelection);

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

  const handleChangeSlideBackground = useCallback(
    (background: Slide['background']) => {
      dispatch(changeSlideBackground(background));
    },
    [dispatch],
  );

  const handleAddText = useCallback(() => {
    dispatch(addTextObject());
  }, [dispatch]);

  const handleAddImage = useCallback(
    (payload: ImagePayload) => {
      dispatch(addImageObject(payload));
    },
    [dispatch],
  );

  const handleDeleteObject = useCallback(() => {
    dispatch(deleteObject());
  }, [dispatch]);

  const handleSelectObject = useCallback(
    (objectId: string, multi: boolean) => {
      if (!selectedSlideId) return;

      if (multi) {
        dispatch(toggleObjectSelection({ slideId: selectedSlideId, objectId }));
      } else {
        dispatch(selectObject({ slideId: selectedSlideId, objectId }));
      }
    },
    [dispatch, selectedSlideId],
  );

  const handleDeselectAll = useCallback(() => {
    dispatch(clearUIState());
    dispatch(clearObjectSelection());
  }, [dispatch]);

  const handleStartEditingText = useCallback(
    (objectId: string) => {
      dispatch(startEditingText(objectId));
    },
    [dispatch],
  );

  const handleStopEditingText = useCallback(() => {
    dispatch(stopEditingText());
  }, [dispatch]);

  const handleUpdateTextContent = useCallback(
    (objectId: string, content: string) => {
      dispatch(updateTextObject({ objectId, content }));
    },
    [dispatch],
  );

  const handleUpdateObjectPosition = useCallback(
    (objectId: string, x: number, y: number) => {
      dispatch(updateObjectPosition({ objectId, x, y }));
    },
    [dispatch],
  );

  const handleUpdateObjectSize = useCallback(
    (objectId: string, width: number, height: number) => {
      dispatch(updateObjectSize({ objectId, width, height }));
    },
    [dispatch],
  );

  return {
    data: {
      presentation,
      currentSlide,
      selectedSlideIds,
      selectedObjectIds,
      editingTextObjectId,
    },
    actions: {
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
      handleStartEditingText,
      handleStopEditingText,
      handleUpdateTextContent,
      handleUpdateObjectPosition,
      handleUpdateObjectSize,
    },
  } as const;
}
