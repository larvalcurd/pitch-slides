import type { TextObject } from '../../entities/object';
import styles from './SlideCanvas.module.css';

type Props = {
  text: TextObject;
};

export default function TextObjectComponent({ text }: Props) {
  return (
    <div
      className={styles.textContent}
      style={{
        fontSize: text.fontSize ?? 16,
        fontFamily: text.fontFamily ?? 'inherit',
        color: text.color ?? '#111',
      }}
    >
      {text.content}
    </div>
  );
}
