import type { Slide } from '../types/SlideTypes.ts';
import { nanoid } from 'nanoid';

export function createSlide(params: Partial<Slide> = {}): Slide {
    return {
        id: params.id ?? nanoid(),
        title: params.title ?? 'New Slide',
        objects: params.objects ?? [],
        background: params.background ?? { type: 'color', value: '#FFFFFF' },
    };
}
