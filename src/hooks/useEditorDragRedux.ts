import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { startDrag, updateDragPosition, finishDrag } from '../store/editorSlice';

type UseEditorDragReduxProps = {
  onTargetIndex?: (mouseX: number, mouseY: number) => number | undefined;
};

export default function useEditorDragRedux({ onTargetIndex }: UseEditorDragReduxProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const isDragging = useSelector((state: RootState) => state.editor.dragging !== null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dispatch(startDrag({ mouseX: e.clientX, mouseY: e.clientY }));
  }, [dispatch]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const targetIndex = onTargetIndex?.(e.clientX, e.clientY);
      dispatch(updateDragPosition({ mouseX: e.clientX, mouseY: e.clientY, targetIndex }));
    };

    const handleMouseUp = () => {
      dispatch(finishDrag());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dispatch, onTargetIndex]);

  return { handleMouseDown };
}