import type { ImageObject } from '../../entities/object';
import type { Slide } from '../../entities/slide';
import styles from './SlideCanvas.module.css';

type Props = {
  image: ImageObject;
  slide?: Slide | null;
  onObjectClick: (id: string, backgroundColor: string) => void;
  onSelectObject?: (id: string, multiSelect?: boolean) => void;
  isSelected?: boolean;
};

export default function ImageObjectComponent({
  image,
  slide,
  onObjectClick,
  onSelectObject,
  isSelected,
}: Props) {
  const bg = slide?.background?.type === 'color' ? slide.background.value : 'none';

  return (
    <div
      key={image.id}
      className={`${styles['base-object']} ${styles['image-object']} ${isSelected ? styles.selected : ''}`}
      style={{
        left: image.x,
        top: image.y,
        width: image.width,
        height: image.height,
        zIndex: image.zIndex,
      }}
      data-object-id={image.id}
      onClick={e => {
        onObjectClick(image.id, bg);
        onSelectObject?.(image.id, e.shiftKey);
      }}
    >
      <img src={image.src} alt={image.src ? 'Slide image' : ''} />
    </div>
  );
}
