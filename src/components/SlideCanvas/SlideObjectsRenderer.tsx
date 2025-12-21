import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../../entities/object/types/ObjectTypes.ts';
import TextObjectComponent from './TextObjectComponent.tsx';
import ImageObjectComponent from './ImageObjectComponent.tsx';
import useObjectSelection from '../../hooks/useObjectSelection.ts';

type SlideObjectsRendererProps = {
  objects: SlideObject[];
  selectedObjectIds: string[];
  onSelectObject: (id: string, multiSelect?: boolean) => void;
  slide?: Slide | null;
};

export default function SlideObjectsRenderer({
  objects,
  selectedObjectIds,
  onSelectObject,
  slide,
}: SlideObjectsRendererProps) {
  const { isSelected, toggleSelection } = useObjectSelection({
    selectedIds: selectedObjectIds,
    onSelect: onSelectObject,
  });

  const renderObject = (obj: SlideObject) => {
    const selected = isSelected(obj.id);

    if (obj.type === 'text') {
      return (
        <TextObjectComponent
          key={obj.id}
          text={obj}
          slide={slide}
          onSelectObject={toggleSelection}
          isSelected={selected}
        />
      );
    }

    if (obj.type === 'image') {
      return (
        <ImageObjectComponent
          key={obj.id}
          image={obj}
          slide={slide}
          onSelectObject={toggleSelection}
          isSelected={selected}
        />
      );
    }

    return null;
  };

  return <>{objects.map(renderObject)}</>;
}
