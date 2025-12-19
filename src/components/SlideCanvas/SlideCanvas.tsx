import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../../entities/object/types/ObjectTypes.ts';
import styles from './SlideCanvas.module.css';
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
    <div className={styles.wrapper}>
      {slide ? (
        <div className={styles.column}>
          <div className={styles.title} aria-hidden={false}>
            {slide.title ?? 'Untitled slide'}
          </div>

          <div
            className={styles.viewport}
            style={{
              backgroundColor:
                slide?.background?.type === 'color' ? slide.background.value : undefined,
              backgroundImage:
                slide?.background?.type === 'image' ? `url(${slide.background.value})` : undefined,
              backgroundSize: slide?.background?.type === 'image' ? 'cover' : undefined,
              backgroundPosition: slide?.background?.type === 'image' ? 'center' : undefined,
            }}
            role="region"
            aria-label="Slide viewport"
          >
            {slide.objects.map(renderObject)}
          </div>
        </div>
      ) : (
        <div className={styles['no-slide']}>No slide selected</div>
      )}
    </div>
  );
}
