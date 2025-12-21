import { useMemo } from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../../entities/object/types/ObjectTypes.ts';
import TextObjectComponent from './TextObjectComponent.tsx';
import ImageObjectComponent from './ImageObjectComponent.tsx';

type SlideObjectsRendererProps = {
  objects: SlideObject[];
  selectedObjectIds: string[];
  onSelectObject?: (id: string, multiSelect?: boolean) => void;
  slide?: Slide | null;
};

export default function SlideObjectsRenderer({
  objects,
  selectedObjectIds,
  onSelectObject,
  slide,
}: SlideObjectsRendererProps) {
  const selectedSet = useMemo(() => new Set(selectedObjectIds), [selectedObjectIds]);

  const renderObject = (obj: SlideObject) => {
    const isSelected = selectedSet.has(obj.id);

    if (obj.type === 'text') {
      return (
        <TextObjectComponent
          key={obj.id}
          text={obj}
          slide={slide}
          onSelectObject={onSelectObject}
          isSelected={isSelected}
        />
      );
    }

    if (obj.type === 'image') {
      return (
        <ImageObjectComponent
          key={obj.id}
          image={obj}
          slide={slide}
          onSelectObject={onSelectObject}
          isSelected={isSelected}
        />
      );
    }

    return null;
  };

  return <>{objects.map(renderObject)}</>;
}
