import type { TextObject } from '../../entities/object';
import type { Slide } from '../../entities/slide';
import styles from './SlideCanvas.module.css';

type Props = {
  text: TextObject;
  slide?: Slide | null;
  onSelectObject?: (id: string, multiSelect?: boolean) => void;
  isSelected?: boolean;
};

export default function TextObjectComponent({ text, onSelectObject, isSelected }: Props) {
  return (
    <div
      className={`${styles['base-object']} ${styles['text-object']} ${isSelected ? styles.selected : ''}`}
      style={{
        left: text.x,
        top: text.y,
        width: text.width,
        height: text.height,
        zIndex: text.zIndex,
        fontSize: text.fontSize ?? 16,
        color: text.color ?? '#111',
      }}
      data-object-id={text.id}
      onClick={e => {
        onSelectObject?.(text.id, e.shiftKey);
      }}
    >
      {text.content}
    </div>
  );
}
