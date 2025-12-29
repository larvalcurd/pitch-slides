import { useEffect, useRef } from 'react';
import type { TextObject } from '../../entities/object';
import styles from './SlideCanvas.module.css';
import { useTextEditing } from '../../hooks/useTextEditing';

type Props = {
  text: TextObject;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateContent: (content: string) => void;
};

export default function TextObjectComponent({
  text,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateContent,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { tempContent, setTempContent, handleKeyDown } = useTextEditing({
    initialContent: text.content,
    onSave: (content: string) => {
      onUpdateContent(content);
      onStopEditing();
    },
    onCancel: () => {
      onStopEditing();
    },
  });

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className={styles.textContent}
        style={{
          fontSize: text.fontSize ?? 16,
          fontFamily: text.fontFamily ?? 'inherit',
          color: text.color ?? '#111',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          resize: 'none',
          overflow: 'hidden',
        }}
        value={tempContent}
        onChange={e => setTempContent(e.target.value)}
        onBlur={() => onUpdateContent(tempContent)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    );
  }

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
