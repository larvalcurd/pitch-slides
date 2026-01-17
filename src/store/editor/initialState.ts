import { nanoid } from '@reduxjs/toolkit';
import type { Editor } from '../../entities/editor/types/EditorTypes';
import { createSlide } from '../../entities/slide';

export const createInitialState = (): Editor => {
  const firstSlide = createSlide();
  return {
    presentation: {
      id: nanoid(),
      title: 'Untitled Presentation',
      slides: [firstSlide],
    },
    selection: {
      type: 'slides',
      slideIds: [firstSlide.id],
    },
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
};

export const initialState: Editor = createInitialState();