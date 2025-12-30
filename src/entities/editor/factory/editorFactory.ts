import { nanoid } from '@reduxjs/toolkit';
import { createPresentation } from '../../presentation';
import { createSlide } from '../../slide';
import type { Editor } from '../types/EditorTypes';

export const createEditor = (): Editor => {
  const presentation = createPresentation(nanoid(), 'Untitled Presentation', [createSlide()]);

  return {
    presentation,
    selection: {
      slideId: presentation.slides[0].id,
      objectIds: [],
    },
    dragging: null,
    resizing: null,
    editingTextObjectId: null,
  };
};
