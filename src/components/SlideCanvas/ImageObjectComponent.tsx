import type { ImageObject } from '../../entities/object';
import styles from './SlideCanvas.module.css';

type Props = {
  image: ImageObject;
};

export default function ImageObjectComponent({ image }: Props) {
  return (
    <img className={styles.imageContent} src={image.src} alt="Slide image" draggable={false} />
  );
}
