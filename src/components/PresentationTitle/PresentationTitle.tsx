import React from 'react';
import styles from './PresentationTitle.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

type PresentationTitleProps = {
  onTitleChange: (newTitle: string) => void;
  disabled?: boolean;
};

export default function PresentationTitle({
  onTitleChange,
  disabled = false,
}: PresentationTitleProps) {
  const title = useSelector((state: RootState) => state.editor.presentation.title);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        id="presentation-title"
        name="presentationTitle"
        value={title}
        onChange={handleChange}
        placeholder="Enter Presentation title"
        className={styles.input}
        disabled={disabled}
        aria-disabled={disabled}
      />
    </div>
  );
}
