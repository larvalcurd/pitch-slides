import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../../entities/object/types/ObjectTypes.ts';
import { wrapperStyle, columnStyle, titleStyle, viewportStyle } from './SlideCanvas.styles.ts';
import TextObjectComponent from './TextObjectComponent.tsx';
import ImageObjectComponent from './ImageObjectComponent.tsx';

type Props = {
  slide?: Slide | null;
  onSelectObject?: (objectId: string, multiSelect?: boolean) => void;
  selectedObjectIds?: string[];
};

export default function SlideCanvas({ slide, onSelectObject, selectedObjectIds }: Props) {
  const handleObjectClick = (id: string, backgroundColor: string) => {
    console.log(id, backgroundColor);
  };

  const renderObject = (obj: SlideObject) => {
    const isSelected = selectedObjectIds?.includes(obj.id);

    if (obj.type === 'text') {
      return (
        <TextObjectComponent
          key={obj.id}
          text={obj}
          slide={slide}
          onObjectClick={handleObjectClick}
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
          onObjectClick={handleObjectClick}
          onSelectObject={onSelectObject}
          isSelected={isSelected}
        />
      );
    }

    return null;
  };

  return (
    <div style={wrapperStyle}>
      {slide ? (
        <div style={columnStyle}>
          <div style={titleStyle} aria-hidden={false}>
            {slide.title ?? 'Untitled slide'}
          </div>

          <div style={viewportStyle(slide)} role="region" aria-label="Slide viewport">
            {slide.objects.map(renderObject)}
          </div>
        </div>
      ) : (
        <div
          style={{
            margin: 'auto',
            color: '#6b7280',
          }}
        >
          No slide selected
        </div>
      )}
    </div>
  );
}
