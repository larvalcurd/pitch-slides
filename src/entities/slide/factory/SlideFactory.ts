import type { Slide } from '../types/SlideTypes.ts';
import { nanoid } from 'nanoid';

function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}
export function createSlide(params: Partial<Slide> = {}): Slide {
  return {
    id: params.id ?? nanoid(),
    title: params.title ?? 'New Slide',
    objects: params.objects ?? [],
    background: params.background ?? { type: 'color', value: getRandomColor() },
  };
}
