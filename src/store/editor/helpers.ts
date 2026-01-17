import type { Editor } from '../../entities/editor/types/EditorTypes';
import type { Slide } from '../../entities/slide';

export const findSlideById = (state: Editor, slideId: string): Slide | null =>
  state.presentation.slides.find(s => s.id === slideId) || null;