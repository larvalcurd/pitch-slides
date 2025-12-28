import React from 'react';
import styles from './PresentationTitle.module.css';

type PresentationTitleProps = {
  title: string;
  onTitleChange: (newTitle: string) => void;
  disabled?: boolean;
};

export default function PresentationTitle({
  title,
  onTitleChange,
  disabled = false,
}: PresentationTitleProps) {
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
